export interface IProduct {
  _id?: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  brand?: string;
  colors?: string[];
  sizes?: string[];
  images?: string[];
  tags?: string[];
  isFeatured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
