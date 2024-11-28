import Threeshold from "@models/refThreeshold-model";
import JenisPengadaan from "@models/refjenisPengadaan-model";
import MetodePengadaan from "@models/refMetodePengadaan-model";
import RefAplikasi from "@models/refAplikasi-model";


import CustomError from "@middleware/error-handler";
import { httpCode } from "@utils/prefix";
import getConfig from "@config/dotenv";
import { debugLogger } from "@config/logger";

import {
 ParameterSchema
} from "@schema/api/threeshold-schema"

const getThreesholdByNominal = async (nominal:number) : Promise<Threeshold[]> => {
    try {
        const exThreeshold = await Threeshold.findAll({
            attributes : [
                "kode_threeshold",
                "nilai_min",
                "nilai_max",
                "kode_jenis_pengadaan",
                "RefJenisPengadaan.jenis_pengadaan",
                "penanggung_jawab"
            ],
            include : [
                {
                    model : JenisPengadaan, 
                    as : "RefJenisPengadaan",
                    attributes : []
                },
                {
                    model : MetodePengadaan, 
                    as : "RefMetodePengadaan",
                    include : [
                        {
                            model : RefAplikasi,
                            as : "RefAplikasi",
                            attributes : [
                                "kode_aplikasi",
                                "nama_aplikasi",
                                "keterangan"
                            ]
                        }
                    ]
                }
            ],
            raw : true,
            nest : true
        })

        const dataRows = exThreeshold.filter(
            (item : any) => nominal >= item.nilai_min && nominal <= item.nilai_max
        )

        return dataRows
    } catch (error) {
        console.log(error)
        debugLogger.debug("TES ERROR : ", error)
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            throw new CustomError(500,"error", "Internal server error.")
        }
    }
}


const getThreesholdByNominalandJenisPengadaan = async (nominal:number, jenis_pengadaan : number) : Promise<Threeshold[]> => {
    try {
        const exThreeshold = await Threeshold.findAll({
            attributes : [
                "kode_threeshold",
                "nilai_min",
                "nilai_max",
                "kode_jenis_pengadaan",
                "RefJenisPengadaan.jenis_pengadaan",
                "penanggung_jawab"
            ],
            include : [
                {
                    model : JenisPengadaan, 
                    as : "RefJenisPengadaan",
                    attributes : []
                },
                {
                    model : MetodePengadaan, 
                    as : "RefMetodePengadaan",
                    include : [
                        {
                            model : RefAplikasi,
                            as : "RefAplikasi",
                            attributes : [
                                "kode_aplikasi",
                                "nama_aplikasi",
                                "keterangan"
                            ]
                        }
                    ]
                }
            ],
            where : {
                kode_jenis_pengadaan : jenis_pengadaan
            },
            raw : true,
            nest : true
        })

        const dataRows = exThreeshold.filter(
            (item : any) => nominal >= item.nilai_min && nominal <= item.nilai_max
        )

        return dataRows
    } catch (error) {
        console.log(error)
        debugLogger.debug("TES ERROR : ", error)
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            throw new CustomError(500,"error", "Internal server error.")
        }
    }
}

export default {
    getThreesholdByNominal,
    getThreesholdByNominalandJenisPengadaan
}