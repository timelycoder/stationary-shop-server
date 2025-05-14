import express from 'express';
import { orderControllers } from './order.controller';
import auth from '../../../middlewares/auth';

const router = express.Router();

router.post('/', auth('admin', 'user'), orderControllers.createOrder);
router.get('/', auth('admin'), orderControllers.getOrders);
router.get('/user/:userId', auth('user', 'admin'), orderControllers.getUserOrders); // get all orders of user
router.get('/:id', auth('admin'), orderControllers.getOrderById); // get order by _id
router.post('/success/:id', orderControllers.updatePayment);
router.post('/fail/:id', orderControllers.failedOrCanceledOrder);
router.post('/cancel/:id', orderControllers.failedOrCanceledOrder);
router.patch('/:id', auth('admin'), orderControllers.updateOrder); // update payment status, or other fields
router.delete('/:id', auth('admin'), orderControllers.deleteOrder); // delete order

export const OrderRoutes = router;
