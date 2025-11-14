import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

dotenv.config();
export const prisma = new PrismaClient();
const schemaPath = path.resolve("prisma/schema.prisma");

export const connectDB = async () => {
    const { DB_URL, NODE_ENV } = process.env;
    try {
        if (!DB_URL) {
            throw new Error('Database is not defined in environment variables');
        }
        if (fs.existsSync(schemaPath)) {
            execSync(`npx prisma generate --schema=${schemaPath}`);
            if (NODE_ENV !== 'production') {
                execSync(`npx prisma db push --schema=${schemaPath}`);
            }
        }
        const connect = await mongoose.connect(DB_URL);
        console.log(`MongoDB Connected: ${connect.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};
