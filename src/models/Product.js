import mongoose from 'mongoose';
import {
  PRODUCT_STATUS,
  PRODUCT_STATUS_LIST,
  PRODUCT_CATEGORIES_LIST,
} from '../constants/index.js';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: PRODUCT_CATEGORIES_LIST,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: PRODUCT_STATUS_LIST,
      default: PRODUCT_STATUS.ACTIVE,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model('Product', productSchema);
