import { httpCode } from "@utils/prefix";
import {
    ParameterSchema,
    PayloadJabatanSchema
} from "@schema/api/refJabatan-schema"
import { Request, Response, NextFunction } from "express";
import refJabatanService from "@services/api/v1/refJabatan-api";
import { responseSuccess } from "@utils/response-success";

import { errorLogger } from "@config/logger";


const getJabatanPpk = async (
    req : Request,
    res : Response,
    next : NextFunction
) : Promise<void>  => {
    try {
        const response = await refJabatanService.getJabatanPpk()

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error getJabatanppk ${error}`);
        next(error);
    }
}


const getPPPK = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id


        const response = await refJabatanService.getPPPK(id)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error getPppk ${error}`);
        next(error);
    }
}


export default {
    getJabatanPpk,
    getPPPK
}