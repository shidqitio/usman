import { httpCode } from "@utils/prefix";
import refMetodePengadaanService from "@services/api/v1/refMetodePengadaan-api";
import { Request, Response, NextFunction } from "express";
import { debugLogger, errorLogger } from "@config/logger";
import { responseSuccess } from "@utils/response-success";

const metodePengadaan = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const response = await refMetodePengadaanService.metodePengadaan()

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        next(error)
    }
}

export default {
    metodePengadaan
}