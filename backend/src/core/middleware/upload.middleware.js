import multer from 'multer';
import { createCloudinaryStorage } from '../../config/cloudinary.js';

/**
 * Middleware para subir el logo del negocio
 */
export const uploadLogo = (req, res, next) => {
  const tenant = req.tenant;
  
  if (!tenant) {
    return res.status(400).json({ success: false, error: 'Contexto de negocio no encontrado' });
  }

  const folderPath = `modular-business/tenants/${tenant._id}/identity`;
  const storage = createCloudinaryStorage(folderPath);
  const upload = multer({ storage }).single('logo');

  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: 'Error al subir la imagen', details: err.message });
    }
    next();
  });
};