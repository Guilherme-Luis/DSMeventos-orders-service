// src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import './config/db.js'; // importa para garantir conexão com o DB (assume que db.js faz mongoose.connect)

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const { NODE_ENV } = process.env;
app.use(`/api/${NODE_ENV}`, routes);

try {
  const { default: swaggerSpec } = await import('./config/swagger.js'); // import dinâmico
  if (swaggerSpec) {
    const swaggerUi = (await import('swagger-ui-express')).default;
    app.use(`/api/${NODE_ENV}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`Swagger docs available at /api/${NODE_ENV}/docs`);
  }
} catch (err) {
  console.warn('Swagger documentation is not available.', err);
}

// Health endpoint raiz (curto/rápido)
app.get('/', (req, res) => {
  res.json({
    service: 'dsmeventos-orders-service',
    status: 'ok',
    apiRoot: `/api/${NODE_ENV}`,
    docs: `/api/${NODE_ENV}/docs`
  });
});

// Error handler simples
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
  });
});

export default app;
