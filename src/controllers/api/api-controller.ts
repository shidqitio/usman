import { httpCode } from "@utils/prefix";
import { UserOutput } from "@models/user";
import example from "@services/api/v1/example-api";
import { NextFunction, Request, Response } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";

const lists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = req.query.page as string;
    const limit = req.query.limit as string;

    const response: UserOutput[] = await example.exampleApi(page, limit);

    responseSuccess(res, httpCode.ok, response);
  } catch (error) {
    errorLogger.error(`testing error debugger ${error}`);
    next(error);
  }
};

export default {
  lists,
};
