// import mongoose, { Types } from 'mongoose'

// export interface ODetails {
//   productIds: Types.ObjectId
//   qty: number
//   subTotal: number
//   orderId: Types.ObjectId
//   createdAt?: string
// }

// const Schema = mongoose.Schema

// const ODetailSchema = new Schema<ODetails>(
//   {
//     productIds: {
//       type: Schema.Types.ObjectId,
//       required: true,
//       ref: 'Products'
//     },
//     qty: {
//       type: Schema.Types.Number,
//       required: true
//     },
//     orderId: {
//       type: Schema.Types.ObjectId,
//       required: true,
//       ref: 'Orders'
//     }
//   },
//   {
//     timestamps: true
//   }
// )

// const ODetailsModel = mongoose.model('ODetails', ODetailSchema)

// export default ODetailsModel
