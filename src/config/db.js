import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
export const prisma = new PrismaClient();


export const connectDB = async () => {
    const { DB_URL, DB_PORT, NODE_ENV } = process.env;
    try {
        if (!DB_URL || !DB_PORT) {
            throw new Error('Database is not defined in environment variables');
        }
        const connect = await mongoose.connect(`mongodb://${DB_URL}:${DB_PORT}/${NODE_ENV}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${connect.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};