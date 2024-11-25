import OrderModel, { Orders } from '../models/orders.model'
import { ExtendedOrder } from '../models/orders.model'

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
export const findOne = async (role: string, userID: string, id: string): Promise<Orders | null> => {
  let result;
  if (role == 'admin') {
    result = await OrderModel.findById(id);
    (result as ExtendedOrder).forbidAccess = false;
  } else {
    result = await OrderModel.find({ _id: id, createdBy: userID})
    result = result.length > 0 ? result[0] : null;
    if (result != null) {
      (result as ExtendedOrder).forbidAccess = false;
    }
  }
  return result
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
