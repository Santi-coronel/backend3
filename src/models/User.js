import mongoose from 'mongoose';
import { ROLES, ROLES_LIST } from '../constants/index.js';

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ROLES_LIST,
      default: ROLES.USER,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model('User', userSchema);
