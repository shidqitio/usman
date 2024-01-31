import { httpCode } from "@utils/prefix";
import { UserData } from "@middleware/authorization";
import { NextFunction, Request, Response } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";

const lists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let books = [
      {
        id: 1,
        name: "indrawan",
        email: "indrawan@ecampus.ut.ac.id",
      },
      {
        id: 2,
        name: "tio",
        email: "tio@ecampus.ut.ac.id",
      },
      {
        id: 3,
        name: "rendi",
        email: "rendi@ecampus.ut.ac.id",
      },
      {
        id: 4,
        name: "dholi",
        email: "dholi@ecampus.ut.ac.id",
      },
      {
        id: 5,
        name: "Rido",
        email: "rido@ecampus.ut.ac.id",
      },
    ];

    debugLogger.debug(`testing debug debugger ${books}`);
    errorLogger.error(`testing error debugger ${books}`);
    responseSuccess(res, httpCode.ok, books);
  } catch (error) {
    next(error);
  }
};

export default {
  lists,
};
