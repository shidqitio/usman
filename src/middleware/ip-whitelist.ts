import { Request, Response, NextFunction } from "express";
import UserAkses, { StatusUserActive } from "@models/user-akses";
import CustomError from "@middleware/error-handler";
import { httpCode } from "@utils/prefix";

const ipWhitelist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new CustomError(httpCode.unauthorized, "Unauthorized");
    }

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const whiteList: UserAkses | null = await UserAkses.findOne({
      where: {
        ip: ip,
        nip: req.user.nip,
        status: StatusUserActive.Active,
      },
    });

    if (!whiteList) {
      throw new CustomError(httpCode.unauthorized, "Ip Unautorized");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default ipWhitelist