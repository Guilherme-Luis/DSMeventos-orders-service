// src/routes/orders.js
import { Router } from 'express';
import auth from '../middleware/auth.js';
import { subscribe, mySubscriptions, cancelSubscription } from '../controllers/ordersController.js';

const router = Router();

router.post('/subscribe', auth, subscribe);
router.get('/my-subscriptions', auth, mySubscriptions);
router.delete('/:subscriptionId', auth, cancelSubscription);

export default router;