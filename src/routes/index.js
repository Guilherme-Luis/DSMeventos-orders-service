import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const { NODE_ENV, DSM_EVENTS_SERVICE, DSM_EVENTS_AUTH_SERVICE, DSM_EVENTS_WEBAPP } = process.env;

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

export default router;