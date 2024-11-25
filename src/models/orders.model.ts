import mongoose, { Types } from 'mongoose'

export interface ItemDetail {
  _id: Types.ObjectId;
  name: string;
  productId: Types.ObjectId;
  qty: number;
  subTotal: number;
}

export interface Orders {
  itemDetails: ItemDetail[]
  status: string[]
  grandTotal: number
  username: string
  createdBy: Types.ObjectId
  createdAt?: string
}

export interface ExtendedOrder extends Orders {
  forbidAccess?: boolean;
}

const Schema = mongoose.Schema

const OrderSchema = new Schema<Orders>(
  {
    itemDetails: [
      {
        name: {
          type: Schema.Types.String
        },
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Products'
        },
        qty: {
          type: Schema.Types.Number,
          required: true,
          min: 1,
          max: 5
        },
        subTotal: {
          type: Schema.Types.Number
        }
      }
    ],
    status: {
      type: [Schema.Types.String],
      required: true,
      enum: ['pending', 'completed', 'cancelled'],
      default: ['pending']
    },
    grandTotal: {
      type: Schema.Types.Number
    },
    username: {
      type: Schema.Types.String
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
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
