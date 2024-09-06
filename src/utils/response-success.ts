import { Response } from "express";
import { responseStatus } from "@utils/prefix";

interface IResponseSuccess {
  code: number;
  status: string;
  data?: any;
  meta? : any
}

interface IResponseSuccessCount {
  code: number;
  status: string;
  data?: any;
  meta?: any;
  
}

interface IResponseSuccessFailed {
  code : number ;
  status : string;
  message : string;
  data ? :any;
}

const responseSuccess = (res: Response, code: number, data?: any, meta?:any) => {
  const response: IResponseSuccess = {
    code: code,
    status: responseStatus.success,
    data: data,
    meta: {}
  };
  return res.json(response);
};

const responseSuccessCount = (res: Response, code: number,  data?: any, meta?: any) => {
  const response: IResponseSuccessCount = {
    code: code,
    status: responseStatus.success,
    data: data,
    meta: meta

  };
  return res.json(response);
};

const responseSuccesFailed = (res: Response, code : number, message : string, data? : any) => {
  const response:  IResponseSuccessFailed = {
    code : code,
    status : responseStatus.success,
    message : message,
    data : data
  }
  return res.json(response)
}



export { responseSuccess, responseSuccessCount, responseSuccesFailed };
