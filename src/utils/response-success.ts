import { Response } from "express";
import { responseStatus } from "@utils/prefix";

interface IResponseSuccess {
  code: number;
  status: string;
  data?: any;
}

interface IResponseSuccessCount {
  code: number;
  status: string;
  data?: any;
  count : any
}

const responseSuccess = (res: Response, code: number, data?: any) => {
  const response: IResponseSuccess = {
    code: code,
    status: responseStatus.success,
    data: data,
  };
  return res.json(response);
};

const responseSuccessCount = (res: Response, code: number, count : number,  data?: any) => {
  const response: IResponseSuccessCount = {
    code: code,
    status: responseStatus.success,
    count : count,
    data: data,

  };
  return res.json(response);
};



export { responseSuccess, responseSuccessCount };
