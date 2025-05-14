import Product from './product.model';
import { IProduct } from './product.interface';

const addProductIntoDB = async (product: IProduct) => {
  const result = await Product.create(product);
  return result;
};

const getAllProductsFromDB = async () => {
  const result = await Product.find();
  return result;
};

const getProductByIdFromDB = async (_id: string) => {
  const result = await Product.findById(_id);
  return result;
};

const updateProductIntoDB = async (_id: string, updatedProduct: Partial<IProduct>) => {
  const result = await Product.findByIdAndUpdate(_id, updatedProduct, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteProductFromDB = (_id: string) => {
  const result = Product.findByIdAndDelete(_id);
  return result;
};

export const productServices = {
  addProductIntoDB,
  getAllProductsFromDB,
  getProductByIdFromDB,
  updateProductIntoDB,
  deleteProductFromDB,
};
