import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  brand: {
    type: String,
    default: "SUIIS"
  },

  price: {
    type: Number,
    required: true
  },

  image: {
    type: String
  },

  category: {
    type: String
  },

  description: {
    type: String
  },

  stock: {
    type: Number,
    default: 0
  },

  rating: {
    type: Number,
    default: 0
  }

},
{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;