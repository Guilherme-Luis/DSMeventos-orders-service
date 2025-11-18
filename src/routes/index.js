// src/routes/index.js
import express from 'express';
import dotenv from 'dotenv';
import ordersRoutes from './orders.js'; // monta as rotas do orders (preserva seu arquivo original)

dotenv.config();

const router = express.Router();
const { NODE_ENV,
  DSM_EVENTS_SERVICE,
  DSM_EVENTS_AUTH_SERVICE,
  DSM_EVENTS_WEBAPP
} = process.env;

/**
 * @swagger
 * /:
 *   get:
 *     summary: Base root endpoint for health check.
 *     description: Returns some basic information about the service and its status.
 *     tags:
 *       - Health Check
 *     responses:
 *       200:
 *         description: Execution successful.
 */
router.get('/', (req, res) => {
  res.status(200).json({
    message: ``,
    environment: NODE_ENV,
    dsmEventsService: DSM_EVENTS_SERVICE,
    dsmEventsAuthService: DSM_EVENTS_AUTH_SERVICE,
    dsmEventsWebapp: DSM_EVENTS_WEBAPP,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Mount orders routes under /orders
 * (routes implemented in src/routes/orders.js)
 */
router.use('/orders', ordersRoutes);

export default router;
