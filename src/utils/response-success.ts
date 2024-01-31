import { Response } from "express";
import { responseStatus } from "@utils/prefix";

interface IResponseSuccess {
  code: number;
  status: string;
  data?: any;
}

const responseSuccess = (res: Response, code: number, data?: any) => {
  const response: IResponseSuccess = {
    code: code,
    status: responseStatus.success,
    data: data,
  };
  return res.json(response);
};

export { responseSuccess };
