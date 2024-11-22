import mongoose, { Types } from 'mongoose'
import UserModel from './user.model';

export interface Orders {
  grandTotal: number;
  itemDetails: Types.ObjectId;
  status: string[];
  createdBy: Types.ObjectId;
  createdAt?: string;
}

const Schema = mongoose.Schema

const OrderSchema = new Schema<Orders>(
  {
    grandTotal: {
      type: Schema.Types.Number
    },
    itemDetails: [{
      type: Schema.Types.ObjectId,
      ref: "ODetails",
    }],
    status: {
      type: [Schema.Types.String],
      required: true,
      enum: ['pending', 'completed', 'cancelled'],
      default: ['pending']
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  {
    timestamps: true
  }
)

// OrderSchema.pre("save", function (next) {
//   const order = this;
//   const user = UserModel.findById(order.createdBy);

//   if (!user) {
//     return next(new Error("User Not Found"));
//   };

//   next();
// });

const OrderModel = mongoose.model('Orders', OrderSchema)

export default OrderModel
