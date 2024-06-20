import multer, { FileFilterCallback, Multer } from "multer";
import fs from "fs/promises";
import CustomError from "@middleware/error-handler";
import { Request } from "express";
import { httpCode } from "@utils/prefix";
import getConfig from "@config/dotenv";

// jenis file
enum FileType {
  UserPhoto = "userphoto",
  Aplikasi = "aplikasi",
  Invoice = "invoice",
}

// path file
const destinationMap: Record<FileType, string> = {
  [FileType.Aplikasi]: "./public/aplikasi",
  [FileType.Invoice]: "./public/invoice",
  [FileType.UserPhoto] : getConfig('FILE_SAVE_PHOTO')
};

const allowedMimeTypesImage = ["image/jpeg", "image/png", "image/jpg"];
const allowedMimeTypesPdf = ["application/pdf"];

const storage = multer.diskStorage({
  destination: async (req , file, callback) => {
    const type: FileType = req.body.type;
    if (!type) {
      return callback(new Error("Type harus di isi."), "");
    }

    if (!(type in destinationMap)) {
      return callback(
        new Error(
          `Type file harus salah satu dari ${Object.values(FileType).join("|")}`
        ),
        ""
      );
    }

    const folderPath = destinationMap[type];

    try {
      await fs.access(folderPath);
    } catch (error) {
      await fs.mkdir(folderPath, { recursive: true });
    }
    callback(null, folderPath);
  },
  filename: async (req , file, callback) => {
    const type: FileType = req.body.type;
    const name = Date.now();

    if (allowedMimeTypesImage.includes(file.mimetype)) {
      const fileName = `${type}-${name}.png`;
      callback(null, fileName);
    }

    if (allowedMimeTypesPdf.includes(file.mimetype)) {
      const fileName = `${type}-${name}.pdf`;
      callback(null, fileName);
    }
  },
});

const fileFilterImage = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (allowedMimeTypesImage.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
    cb(
      new CustomError(
        httpCode.unsupportedMediaType,
        `Format file harus berupa ${allowedMimeTypesImage.join(" | ")}`
      )
    );
  }
};

const uploadImage: Multer = multer({
  storage,
  fileFilter: fileFilterImage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

export { uploadImage };
