import mongoose, { SchemaType, Types } from "mongoose";
import { calculateTotal } from "../utils/calcTotal";

export interface ODetails {
  product: Types.ObjectId;
  qty: number;
  price: number;
  subTotal: number;
  order: Types.ObjectId;
  createdAt?: string;
}

const Schema = mongoose.Schema;

const ODetailSchema = new Schema<ODetails>(
  {
    product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Products",
    },
    qty: {
        type: Schema.Types.Number,
        required: true,
    },
    subTotal: {
        type: Schema.Types.Number,
    },
    order: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Orders",
    }
  },
  {
    timestamps: true,
  }
);

// ODetailSchema.pre("save", function (next) {
//     const odetail = this;
//     odetail.subTotal = calculateTotal(odetail.qty, odetail.price);
//     next();
// });

const ODetailsModel = mongoose.model("ODetails", ODetailSchema);

export default ODetailsModel;