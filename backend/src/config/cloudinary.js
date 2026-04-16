import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Genera el storage dinámico para Multer
 * @param {string} folderPath - Ruta de la carpeta en Cloudinary
 */
export const createCloudinaryStorage = (folderPath) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderPath,
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'svg'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }],
    },
  });
};

export default cloudinary;