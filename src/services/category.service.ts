import CategoryModel, { Category } from "../models/category.model";

export const create = async (payload: Category): Promise<Category | null> => {
  const result = await CategoryModel.create(payload);
  return result;
};
export const findAll = async (popName: string): Promise<Category[] | null> => {
  const result = await CategoryModel.find().populate(popName);
  return result;
};
export const findOne = async (id: string): Promise<Category | null> => {
  const result = await CategoryModel.findById(id);
  return result;
};
export const update = async (
  id: string,
  payload: Category
): Promise<Category | null> => {
  const result = await CategoryModel.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};
export const remove = async (id: string): Promise<Category | null> => {
  const result = await CategoryModel.findOneAndDelete({
    _id: id,
  });
  return result;
};