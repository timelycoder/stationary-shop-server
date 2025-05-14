import { Schema, model } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String },
    category: { type: String, default: 'generic' },
    stock: { type: Number, required: true, min: 0, default: 0 },
    brand: { type: String },
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    images: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Product = model<IProduct>('Product', productSchema);
export default Product;
