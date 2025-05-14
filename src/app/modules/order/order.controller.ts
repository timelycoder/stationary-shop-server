import { Request, Response } from 'express';
import config from '../../config';

//ssl commerz
const SSLCommerzPayment = require('sslcommerz-lts');
const store_id = config.ssl_store_id;
const store_passwd = config.ssl_store_password;
const is_live = false; //true for live, false for sandbox
//ssl commerz
import mongoose from 'mongoose';
import { orderServices } from './order.services';
import { IOrder } from './order.interface';
import Order from './order.model';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

// CREATE TEMPORARY ORDER FIRST:: Only paid orders will be stored in DB
const createOrder = catchAsync(async (req: Request, res: Response) => {
  const transaction_id = new mongoose.Types.ObjectId().toString();
  const requestedData = req.body;
  //sslcommerz init
  const data = {
    total_amount: requestedData.totalAmount,
    currency: 'BDT',
    tran_id: transaction_id, // use unique tran_id for each api call
    success_url: `${config.server_url}/api/v1/orders/success/${transaction_id}`,
    fail_url: `${config.server_url}/api/v1/orders/fail/${transaction_id}`,
    cancel_url: `${config.server_url}/api/v1/orders/fail/${transaction_id}`,
    ipn_url: `${config.server_url}/ipn`,
    shipping_method: 'Courier',
    product_name: 'Computer.',
    product_category: 'general',
    product_profile: 'general',
    cus_name: 'Customer Name',
    cus_email: 'test@gmail.com',
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: requestedData?.shippingAddress?.city || 'Dhaka',
    cus_state: requestedData?.shippingAddress?.state || 'Dhaka',
    cus_postcode: requestedData?.shippingAddress?.zipCode || 1000,
    cus_country: requestedData?.shippingAddress?.country || 'Bangladesh',
    cus_phone: requestedData.contactPhone || '01711111111',
    cus_fax: '01711111111',
    ship_name: 'Shipping Name',
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: requestedData?.shippingAddress?.city || 'Dhaka',
    ship_state: requestedData?.shippingAddress?.state || 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.init(data).then((apiResponse: any) => {
    // Redirect the user to payment gateway
    const GatewayPageURL = apiResponse.GatewayPageURL;
    res.send({ url: GatewayPageURL });

    const orderData: IOrder = {
      userId: requestedData.userId,
      products: requestedData.products,
      totalAmount: requestedData.totalAmount,
      shippingCost: requestedData?.shippingCost || 0,
      shippingAddress: requestedData?.shippingAddress,
      contactPhone: requestedData.contactPhone,
      customerNote: requestedData?.customerNote || '',
      couponCode: requestedData?.couponCode || '',
      isPaid: false,
      transactionId: transaction_id,
      status: 'pending',
      trackingNumber: null,
    };

    // eslint-disable-next-line no-unused-vars
    const returnData = orderServices.createOrderIntoDB(orderData);
  });
});

const updatePayment = catchAsync(async (req: Request, res: Response) => {
  const transaction_id = req.params.id;
  const result = await orderServices.updatePaymentStatus(req.params.id as string);

  if (result.modifiedCount > 0) {
    res.redirect(`${config.client_url}/orders/success/${transaction_id}`);
  } else {
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Order not found',
      data: null,
    });
  }
});

// Payment failure will delete the order from DB
const failedOrCanceledOrder = catchAsync(async (req: Request, res: Response) => {
  const transaction_id = req.params.id;
  const result = await Order.deleteOne({
    transactionId: transaction_id,
  });

  if (result.deletedCount > 0) {
    res.redirect(`${config.client_url}/orders/fail/${transaction_id}`);
  } else {
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Order not found',
      data: null,
    });
  }
});

const getOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await orderServices.getOrders();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Orders getting successfully',
    data: orders,
  });
});

// get all orders of user
const getUserOrders = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  const result = await orderServices.getUserOrdersFromDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User orders getting successfully',
    data: result,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const order = await orderServices.getOrderById(orderId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order getting successfully',
    data: order,
  });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const result = await orderServices.updateOrder(orderId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order updated successfully',
    data: result,
  });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid order ID',
      data: null,
    });
  }
  const result = await orderServices.deleteOrder(orderId);

  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Order deleted successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Order not found',
      data: null,
    });
  }
});

export const orderControllers = {
  createOrder,
  updatePayment,
  failedOrCanceledOrder,
  getOrders,
  getUserOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
