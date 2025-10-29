import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { swaggerDocs } from './config/swagger.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const { PORT, NODE_ENV } = process.env;

app.use(express.json());
connectDB();

app.use(`/api/${NODE_ENV}`, routes);

swaggerDocs(app, PORT);

app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});