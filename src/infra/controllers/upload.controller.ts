import { Request, Response, NextFunction } from 'express';
import { uploadImage } from '../../shared/upload';

export class UploadController {
  upload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file provided' });
        return;
      }

      // Limit file size to 5MB
      if (req.file.size > 5 * 1024 * 1024) {
        res.status(400).json({ message: 'File too large. Max 5MB.' });
        return;
      }

      const url = await uploadImage(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
      );

      res.status(200).json({ data: { url } });
    } catch (error) {
      next(error);
    }
  };
}
