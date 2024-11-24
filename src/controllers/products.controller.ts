import { Request, Response } from "express";
import * as Yup from 'yup';
import { create, findAll, findOne, update, remove } from "../services/product.service"
import CategoryModel from "../models/category.model";

const createValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  price: Yup.number().required(),
  category: Yup.string().required(),
  description: Yup.string().required(),
  qty: Yup.number().required().min(1),
});

interface IPaginationQuery {
	page: number;
	limit: number;
	search?: string;
}

export default {
  createValidationSchema,
  async create(req: Request, res: Response) {
    /**
     #swagger.tags = ['Products']
     #swagger.security = [{
      "bearerAuth": []
     }]
     #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/ProductCreate"
      }
     }
     */
    try {
      const catId = req.body.categoryId
      const validProduct = await CategoryModel.findById(catId)
      if (!validProduct) {
        return res.status(500).json({
          message: "Invalid Category"
        })
      }

      const result = await create(req.body);
      const updateCategory = await CategoryModel.findByIdAndUpdate(
        result.categoryId,
        { $push: { products: result._id }}
      )
      res.status(201).json({
        data: result,
        message: "Success create product",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed create product",
      });
    }
  },
  async findAll(req: Request, res: Response) {
    /**
     #swagger.tags = ['Products']
     */
    try {
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as IPaginationQuery;

      const query = {};

      if (search) {
        Object.assign(query, {
          name: { $regex: search, $options: "i" },
        });
      }
      const result = await findAll();
      res.status(200).json({
        data: result,
        message: "Success get all products",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed get all products",
      });
    }
  },
  async findOne(req: Request, res: Response) {
    /**
     #swagger.tags = ['Products']
     */
    try {
      const result = await findOne(req.params?.id);

      res.status(200).json({
        data: result,
        message: "Success get one product",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed get one product",
      });
    }
  },
  async update(req: Request, res: Response) {
    /**
     #swagger.tags = ['Products']
     #swagger.security = [{
      "bearerAuth": []
     }]
    */
    try {
      const result = await update(req.params?.id, req.body);

      res.status(200).json({
        data: result,
        message: "Success update product",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed update product",
      });
    }
  },
  async delete(req: Request, res: Response) {
    /**
     #swagger.tags = ['Products']
     #swagger.security = [{
      "bearerAuth": []
     }]
    */
    try {
      const result = await remove(req.params?.id);

      res.status(200).json({
        data: result,
        message: "Success delete product",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed delete product",
      });
    }
  },
};