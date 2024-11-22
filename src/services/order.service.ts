import OrderModel, { Orders } from "../models/orders.model";

export const create = async (payload: Orders): Promise<Orders | null> => {
  const result = await OrderModel.create(payload);
  return result;
};
export const findAll = async (popName: string): Promise<Orders[] | null> => {
  const result = await OrderModel.find().populate(popName);
  return result;
};
export const findOne = async (id: string): Promise<Orders | null> => {
  const result = await OrderModel.findById(id);
  return result;
};
export const update = async (
  id: string,
  payload: Orders
): Promise<Orders | null> => {
  const result = await OrderModel.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};
export const remove = async (id: string): Promise<Orders | null> => {
  const result = await OrderModel.findOneAndDelete({
    _id: id,
  });
  return result;
};