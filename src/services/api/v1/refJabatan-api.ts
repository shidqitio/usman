import RefJabatan from "@models/refJabatan-model";
import CustomError from "@middleware/error-handler";
import db from "@config/database";
import { httpCode } from "@utils/prefix";
import { Op } from "sequelize";
import { debugLogger } from "@config/logger";
import PBJ from "@models/refPbj-model";

import {
    PayloadJabatanSchema,
    ParameterSchema
} from "@schema/api/refJabatan-schema"


const getJabatanPpk = async () : Promise<RefJabatan[]> => {
    try {
        const ppk : RefJabatan[] = await RefJabatan.findAll({
            where : {
                kode_jabatan_atasan : {
                    [Op.is] : null
                }
            },
            attributes : {
                exclude : ["ucr","uch","udcr","udch"]
            },
            include : [
                {
                    model : PBJ,
                    as : "PBJ"
                }
            ]
        })

        return ppk
    } catch (error) {
        debugLogger.debug(error)
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.status, error.message);
          } else {
            throw new CustomError(500, "error", "Internal server error.");
          }
    }
}

const getPPPK = async (id:ParameterSchema["params"]["id"]) : Promise<RefJabatan[]> => {
    try {
        const getPPPK = await RefJabatan.findAll({
            where : {
                kode_jabatan_atasan : id
            },
            attributes : [
                "kode_jabatan",
                "kode_jabatan_atasan",
                "nama_jabatan"
            ]
        })

        return getPPPK
    } catch (error) {
        debugLogger.debug(error)
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.status, error.message);
          } else {
            throw new CustomError(500, "error", "Internal server error.");
          }
    }
}


export default {
    getJabatanPpk,
    getPPPK
}