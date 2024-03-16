import RefAplikasi from "@models/refAplikasi-model";
import RefGroup, {RefGroupInput, RefGroupOutput} from "@models/refGroup-model";
import RefLevel from "@models/refLevel-model";
import generateAutoCode from "@utils/generate_auto_code"
import db from "@config/database";
import CustomError from "@middleware/error-handler";
import { httpCode } from "@utils/prefix";
import {
    PayloadRefGroupSchema
} from "@schema/api/refGroup-schema"


const index = async () : Promise<RefGroupOutput[]> => {
    try {
        const refGroup : RefGroup[] = await RefGroup.findAll({
            attributes : {exclude : ["ucr","uch", "udcr", "udch"]},
            include : [
                {
                    model : RefLevel, 
                    as : "Level", 
                    attributes : {exclude : ["udcr", "udch"]}
                }
            ]
        })

        if (refGroup.length === 0 ) throw new CustomError(httpCode.found, "Data Tidak Ada")

        return refGroup
    } catch (error : any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
          } else {
            throw new CustomError(500, "Internal server error.");
          }
    }
}

const store = async (
    request:PayloadRefGroupSchema["body"])
    : Promise<RefGroupOutput> => {
    try {
        const cekAplikasi : RefAplikasi | null = await RefAplikasi.findOne({
            where : {
                kode_aplikasi : request.kode_aplikasi
            }
        })

        if(cekAplikasi) throw new CustomError(httpCode.found, "Aplikasi Tidak Ada")

        const cekGroup : RefGroup[] = await RefGroup.findAll({
            attributes : ["kode_group"],
            where : {
                kode_aplikasi : request.kode_aplikasi
            }
        })

        const kodeGroup : any = generateAutoCode.generateKodeGroup(cekGroup, request.kode_aplikasi)

        const dataGroup : RefGroupInput = {
            kode_group : kodeGroup,
            nama_group : request.nama_group,
            kode_level : request.kode_level,
            kode_aplikasi : request.kode_aplikasi,
            ucr : request.ucr
        }

        const createGroup : RefGroupOutput = await RefGroup.create(dataGroup)

        return createGroup

    } catch (error : any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
          } else {
            throw new CustomError(500, "Internal server error.");
          }
    }
}

export default {
    index,
    store
}