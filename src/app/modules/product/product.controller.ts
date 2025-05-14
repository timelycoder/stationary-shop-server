import { Request, Response } from 'express';
import { productServices } from './product.service';
import { IProduct } from './product.interface';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const addNewProduct = catchAsync(async (req: Request, res: Response) => {
  const product: IProduct = req.body;
  const result = await productServices.addProductIntoDB(product);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Product created successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await productServices.getAllProductsFromDB();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Products fetched successfully',
    data: result,
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await productServices.getProductByIdFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product fetched successfully by id',
    data: result,
  });
});

const updateProductById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await productServices.updateProductIntoDB(id, updatedData);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product updated successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await productServices.updateProductIntoDB(id, updatedData);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product updated successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await productServices.deleteProductFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product deleted successfully',
    data: result,
  });
});

export const productControllers = {
  addNewProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  updateProductById,
  deleteProduct,
};
