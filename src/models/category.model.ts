import mongoose, { Types } from "mongoose";

export interface Category {
  name: string;
  products: Types.ObjectId;
  createdAt?: string;
}

const Schema = mongoose.Schema;

const CategorySchema = new Schema<Category>(
  {
    name: {
      type: String,
      required: true,
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    }]
  },
  {
    timestamps: true,
  }
);

const CategoryModel = mongoose.model("Category", CategorySchema);

export default CategoryModel;
