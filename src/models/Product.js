import { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  createdAt: {
    type: String,
    default: new Date().toLocaleString(),
  },
},{timestamps: false});

const Product = model('Product', ProductSchema);

export default Product;