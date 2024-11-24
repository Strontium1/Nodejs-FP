// import ODetailsModel, { ODetails } from "../models/details.models";

// export const create = async (payload: ODetails): Promise<ODetails | null> => {
//   const result = await ODetailsModel.create(payload);
//   return result;
// };
// export const findAll = async (popName: string): Promise<ODetails[] | null> => {
//   const result = await ODetailsModel.find().populate(popName);
//   return result;
// };
// export const findOne = async (id: string): Promise<ODetails | null> => {
//   const result = await ODetailsModel.findById(id);
//   return result;
// };
// export const update = async (
//   id: string,
//   payload: ODetails
// ): Promise<ODetails | null> => {
//   const result = await ODetailsModel.findOneAndUpdate({ _id: id }, payload, {
//     new: true,
//   });
//   return result;
// };
// export const remove = async (id: string): Promise<ODetails | null> => {
//   const result = await ODetailsModel.findOneAndDelete({
//     _id: id,
//   });
//   return result;
// };