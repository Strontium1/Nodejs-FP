import OrderModel, { ItemDetail, Orders } from '../models/orders.model'
import { ExtendedOrder } from '../models/orders.model'
import { CustomError } from './auth.service'

export const create = async (payload: Orders): Promise<Orders | null> => {
  const result = await OrderModel.create(payload)
  return result
}
export const findAll = async (
  role: number,
  id: string
): Promise<Orders[] | null> => {
  const result = await OrderModel.find()
  return result
}
export const findOne = async (role: string, userID: string, id: string, item_id?: string): Promise<Orders | ItemDetail | undefined | null> => {
  let result;
  let items;
  result = await OrderModel.findById(id)
  if (!result) {
    throw new CustomError("Invalid order ID")
  }
  
  if (role == 'admin') {
    if (item_id === undefined) {
      return result
    } else {
      items = result?.itemDetails
      const selected_item = items.find((item) => item._id.equals(item_id))
      if (!selected_item) {
        throw new CustomError("Item not found")
      } else {
        return selected_item
      }
    }
  } else {
    if (item_id === undefined) {
      if (result.createdBy.toString() != userID) {
        throw new CustomError("Forbidden", 403)
      } else {
        return result
      }
    } else {
      if (result.createdBy.toString() != userID) {
        throw new CustomError("Forbidden", 403)
      } else {
        let items = result?.itemDetails
        const selected_item = items.find((item) => item._id.equals(item_id))
        if (!selected_item) {
          throw new CustomError("Item not found")
        } else {
          return selected_item
        }
      }
    }
  }
}
export const update = async (
  id: string,
  payload: Orders
): Promise<Orders | null> => {
  const result = await OrderModel.findOneAndUpdate({ _id: id }, payload, {
    new: true
  })
  return result
}
export const remove = async (id: string): Promise<Orders | null> => {
  const result = await OrderModel.findOneAndDelete({
    _id: id
  })
  return result
}
