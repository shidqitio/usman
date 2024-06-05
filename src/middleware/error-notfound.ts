import { Request, Response, NextFunction } from "express";
import { IErrorResponse } from "@middleware/error-handler";
import { httpCode } from "@utils/prefix";

const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  const response: IErrorResponse = {
    code: httpCode.notFound,
    status: "error",
    message: "Page not found",
  };

  return res.json(response);
};

export { notFound };
