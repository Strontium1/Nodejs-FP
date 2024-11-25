import { Request, Response } from 'express'
import {
  create,
  findAll,
  findOne,
  update,
  remove
} from '../services/order.service'
import * as Yup from 'yup'
import OrderModel from '../models/orders.model'
import { IRequestWithUser } from '../middlewares/auth.middleware'
import { getUserID, getUserRoles, getUserUsername } from '../utils/jwt'
import ProductsModel from '../models/products.model'

const orderValidationSchema = Yup.object().shape({
  grandTotal: Yup.number().optional(),
  itemDetails: Yup.array()
    .of(
      Yup.object({
        qty: Yup.number()
          .required('Quantity must be specified')
          .min(1, 'At least 1 quantity')
          .max(5, 'Max 5 quantity')
      })
    )
    .required()
    .min(1),
  username: Yup.string().nullable().default(undefined),
  status: Yup.string().required()
})

export default {
  orderValidationSchema,
  async create (req: Request, res: Response) {
    /**
     #swagger.tags = ['Orders']
     #swagger.security = [{
      "bearerAuth": []
     }]
     #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/OrderCreate"
      }
     }
     */
    try {
      const { itemDetails, status } = req.body

      await orderValidationSchema.validate({
        itemDetails: itemDetails,
        status: status
      })

      // validate itemDetails
      let err_count = 0
      let invalidNameErr = 0
      let invalidIDErr = 0
      let noIDandName = 0
      let orderExceedStock = 0
      const productIds = await Promise.all(
        itemDetails.map(async (items: any) => {
          if (items.name) {
            // get ID by name
            const product = await ProductsModel.findOne({
              name: items.name
            }).select('_id')
            const setTotal = await ProductsModel.findOne({
              name: items.name
            }).select('price')
            if (!product) {
              invalidNameErr += 1
              err_count += 1
              return { message: 'Invalid Name' }
            }

            // calculate stock and update products
            const qtyStock = await ProductsModel.findOne({
              name: items.name
            }).select('qty')
            if (qtyStock && qtyStock.qty) {
              var stockLeft = qtyStock.qty - items.qty
            } else {
              orderExceedStock += 1
              err_count += 1
              return { message: 'No Stock' }
            }
            if (stockLeft < 0) {
              orderExceedStock += 1
              err_count += 1
            } else {
              const updateStock = await ProductsModel.findByIdAndUpdate(
                product._id,
                { $set: { qty: stockLeft } }
              )
            }

            items.subTotal = setTotal ? setTotal.price * items.qty : null
            items.productId = product ? product._id : null
          } else if (items.productId) {
            const product = await ProductsModel.findById(
              items.productId
            ).select('name')
            const setTotal = await ProductsModel.findById(
              items.productId
            ).select('price')
            if (!product) {
              // get name by ID
              invalidIDErr += 1
              err_count += 1
              return { message: 'Invalid ID' }
            }

            // calculate stock
            const qtyStock = await ProductsModel.findById(
              items.productId
            ).select('qty')
            if (qtyStock && qtyStock.qty) {
              var stockLeft = qtyStock.qty - items.qty
            } else {
              orderExceedStock += 1
              err_count += 1
              return { message: 'No Stock' }
            }
            if (stockLeft < 0) {
              orderExceedStock += 1
              err_count += 1
              return { message: 'No Stock' }
            } else {
              const updateStock = await ProductsModel.findByIdAndUpdate(
                product._id,
                { $set: { qty: stockLeft } }
              )
            }

            items.subTotal = setTotal ? setTotal.price * items.qty : null
            items.name = product ? product.name : null
          } else {
            noIDandName += 1
            err_count += 1
            return { message: 'No Name and ID supplied' }
          }
          return items
        })
      )

      if (err_count > 0) {
        return res.status(500).json({
          message: 'Error when validating items',
          invalidName: `${invalidNameErr} error`,
          invalidID: `${invalidIDErr} error`,
          noIDandName: `${noIDandName} error`,
          orderExceedStock: `${orderExceedStock} error`
        })
      }

      if (!productIds) {
        return res.status(500).json({
          message: 'Something happened',
          data: productIds
        })
      }

      // Add ID to new order
      const order = new OrderModel({
        itemDetails: productIds,
        status: status,
        grandTotal: productIds.reduce(
          (total, item) => total + item.subTotal,
          0
        ),
        username: getUserUsername(req),
        createdBy: getUserID(req)
      })

      const result = await create(order)
      res.status(201).json({
        data: result,
        message: 'Success create order'
      })
    } catch (error) {
      const err = error as Error
      res.status(500).json({
        data: err.message,
        message: 'Failed create order'
      })
    }
  },
  async findAll (req: Request, res: Response) {
    /**
     #swagger.tags = ['Orders']
     */
    try {
      let result;
      const roles = getUserRoles(req)
      const id = getUserID(req)
      if (roles == 'admin'){
        result = await OrderModel.find()
      } else {
        result = await OrderModel.find({ createdBy: id })
      }

      if (!result || result.length < 1) {
        return res.status(500).json({
          message: `No order found for user ${getUserUsername(req)}.`
        })
      } else {
        res.status(200).json({
          data: result,
          message: 'Success get all orders'
        })
      }

    } catch (error) {
      const err = error as Error
      res.status(500).json({
        error: err.message,
        message: 'Failed get all orders'
      })
    }
  },
  async findOne (req: Request, res: Response) {
    /**
     #swagger.tags = ['Orders']
     */
    try {
      var result = await findOne(getUserRoles(req), getUserID(req), req.params.id)
      if (!result) {
        return res.status(500).json({
          message: "No order found or you don't have sufficient permission to access order."
        })
      }
      res.status(200).json({
        data: result,
        message: `Success get order ${req.params.id}`
      })
    } catch (error) {
      const err = error as Error
      res.status(500).json({
        error: err.message,
        message: `Failed get order ${req.params.id}`
      })
    }
  },
  async update (req: Request, res: Response) {
    /**
     #swagger.tags = ['Orders']
     #swagger.security = [{
      "bearerAuth": []
     }]
     */
    try {
      const result = await update(req.params?.id, req.body)

      res.status(200).json({
        data: result,
        message: 'Success update order'
      })
    } catch (error) {
      const err = error as Error
      res.status(500).json({
        data: err.message,
        message: `Failed update order ${req.params.id}`
      })
    }
  },
  async delete (req: Request, res: Response) {
    /**
     #swagger.tags = ['Orders']
     #swagger.security = [{
      "bearerAuth": []
     }]
     */
    try {
      var productID = await OrderModel.findById(req.params.id).select(
        'itemDetails'
      )
      if (!productID) {
        return res.status(500).json({
          message: 'Invalid order ID'
        })
      }

      productID.itemDetails.forEach(items => {
        const qtyProd = ProductsModel.findById(items.productId).then(
          prodItem => {
            if (!prodItem) {
              return res.status(500).json({
                message: 'Invalid product ID'
              })
            }
            prodItem.qty = prodItem.qty + items.qty
            prodItem.save()
          }
        )
      })
      const result = await remove(req.params?.id)

      res.status(200).json({
        data: result,
        message: `Success delete order ${req.params.id}`
      })
    } catch (error) {
      const err = error as Error
      res.status(500).json({
        data: err.message,
        message: `Failed delete order ${req.params.id}`
      })
    }
  }
}
