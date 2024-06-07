import { httpCode } from "@utils/prefix";
import { UserInput, UserOutput } from "@models/user";
import example from "@services/api/v1/example-api";
import { NextFunction, Request, Response } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import {
  DestroyExampleRequest,
  GetExampleRequest,
  PayloadExampleRequest,
  SearchExampleRequest,
  UpdatedExampleRequest,
} from "@schema/api/example-schema";
import { getSocketIO } from "@config/socket";

const lists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ioInstance = getSocketIO();

    const page: SearchExampleRequest["query"]["page"] = req.query
      .page as string;
    const limit: SearchExampleRequest["query"]["limit"] = req.query
      .limit as string;

    const response: UserOutput[] = await example.searchExampleApi(page, limit);

    if (ioInstance) {
      ioInstance.emit("user", response);
      responseSuccess(res, httpCode.ok, response);
    } else {
      res.status(500).send("Socket.IO not initialized");
    }
  } catch (error) {
    errorLogger.error(`testing error debugger ${error}`);
    next(error);
  }
};

const detail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ioInstance = getSocketIO();

    const id: GetExampleRequest["params"]["id"] = req.params.id as string;

    const response: UserOutput = await example.getExampleApi(id);

    if (ioInstance) {
      ioInstance.emit("user", response);
      responseSuccess(res, httpCode.ok, response);
    } else {
      res.status(500).send("Socket.IO not initialized");
    }
  } catch (error) {
    errorLogger.error(`testing error debugger ${error}`);
    next(error);
  }
};

const store = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const request: PayloadExampleRequest["body"] = req.body;

    const response: UserInput = await example.storeExampleApi(request);

    responseSuccess(res, httpCode.ok, response);
  } catch (error) {
    errorLogger.error(`testing error store ${error}`);
    next(error);
  }
};

const updated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const request: UpdatedExampleRequest["body"] = req.body;

    const response: UserInput = await example.updatedExampleApi(request);

    responseSuccess(res, httpCode.ok, response);
  } catch (error) {
    errorLogger.error(`testing error updated ${error}`);
    next(error);
  }
};

const destroy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id: DestroyExampleRequest["body"]["id"] = req.body.id;

    const response: UserOutput = await example.destroyExampleApi(id);

    responseSuccess(res, httpCode.ok, response);
  } catch (error) {
    errorLogger.error(`testing error debugger ${error}`);
    next(error);
  }
};

export default {
  lists,
  detail,
  store,
  updated,
  destroy,
};
