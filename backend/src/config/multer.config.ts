import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from "./cloudinary.config.js"



const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'uploadProfileImages',
      format: 'png',
      public_id:`${Date.now()}_${file.originalname}`
    };
  }
});





const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('هذا الأمتداد لي الصوره غيرر مسموح بيه'), false);
  }
};


  const parser = multer({ storage , fileFilter ,limits:{fileSize: 5 * 1024 * 1024}});

  export default parser