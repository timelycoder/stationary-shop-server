import { model, Schema } from 'mongoose';
import { IUser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { IShippingAddress } from '../order/order.interface';

// Sub-schema for Shipping Address
export const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false },
);

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  age: { type: Number },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    validate: {
      validator: function (value: string) {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);
      },
      message: '{VALUE} is not a valid email',
    },
    immutable: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  photo: String,
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: '{VALUE} is not valid, please provide a valid role',
    },
    default: 'user',
    required: true,
  },
  userStatus: {
    type: String,
    enum: ['active', 'inactive'],
    required: true,
    default: 'active',
  },
  shippingAddress: {
    type: ShippingAddressSchema,
  },
});

userSchema.pre('save', async function (next) {
  const user = this;

  user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds));
  next();
});
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

const User = model<IUser>('User', userSchema);
export default User;
