import { Request, Response, NextFunction } from "express";
import refThreesholdService from "@services/api/v1/threeshold-api"
import { responseSuccess } from "@utils/response-success";
import { httpCode } from "@utils/prefix";
import { errorLogger } from "@config/logger";

const getThreesholdByNominal = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const nominal = req.body.nominal

        const response = await refThreesholdService.getThreesholdByNominal(nominal)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error Threeshold ${error}`);
        next(error);
    }
}

const getThreesholdByNominalandJenisPengadaan = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const nominal = req.body.nominal

        const jenis_pengadaan = req.body.jenis_pengadaan

        const response = await refThreesholdService.getThreesholdByNominalandJenisPengadaan(nominal, jenis_pengadaan)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error Threeshold ${error}`);
        next(error);
    }
}

export default {
    getThreesholdByNominal,
    getThreesholdByNominalandJenisPengadaan
}