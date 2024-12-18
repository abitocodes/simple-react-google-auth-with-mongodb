import dotenv from 'dotenv';
dotenv.config();

export const mongoConfig = {
    development: {
        host: process.env.MONGO_DEV_HOST,
        dbName: process.env.MONGO_DEV_DBNAME
    },
    production: {
        envVariable: process.env.MONGO_PROD_URI
    }
};