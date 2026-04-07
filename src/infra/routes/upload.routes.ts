import { Router } from 'express';
import multer from 'multer';
import { UploadController } from '../controllers/upload.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const uploadRouter = Router();
const controller = new UploadController();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

uploadRouter.post('/', AuthMiddleware, upload.single('file'), controller.upload);

export { uploadRouter };
