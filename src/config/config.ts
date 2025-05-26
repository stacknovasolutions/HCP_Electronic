import dotenv from 'dotenv';

dotenv.config();

export const APP_PORT = Number(process.env.APP_PORT) || 8080;
export const JWT_SECRET = process.env.JWT_SECRET || 'somerandomkeyherena';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '24h';

export const AWS_KEY = process.env.AWS_KEY || '';
export const AWS_SECRET = process.env.AWS_SECRET || '';
export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';

export const MAILID = process.env.MAILID || '';
export const MAILPASS = process.env.MAILPASS || '';
export const ENCRYPTIONKEY = process.env.ENCRYPTIONKEY || '';
export const BASEURL = process.env.BASEURL || "";

export const REDIS = {
    HOST: process.env.REDIS_HOST || "127.0.0.1",
    PORT: Number(process.env.REDIS_PORT) || 6379,
    PASSWORD: process.env.REDIS_PASSWORD || ''
}