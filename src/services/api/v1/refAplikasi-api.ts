import CustomError from "@middleware/error-handler";
import RefAplikasi, {Status,RefAplikasiInput, RefAplikasiOutput, RefAplikasiInputUpdate} from "@models/refAplikasi-model";
import RefGroup from "@models/refGroup-model";
import {
    PostRefAplikasiSchema,
    UpdatedRefAplikasiSchema,
    GetRefAplikasiSchema
} from "@schema/api/refAplikasi-schema"
import { httpCode } from "@utils/prefix";
import generateKodePrimary from "@utils/generate_auto_code"
import dotenv from "dotenv"
dotenv.config()
import fs from "fs/promises"

import getConfig from "@config/dotenv";
import { removeFile, removeFileName } from "@utils/remove-file";
import path from "path";

const index = async () : Promise<RefAplikasiOutput[]> => {
    try {
        const refAplikasi : RefAplikasi[] = await RefAplikasi.findAll({
            include : [
                {
                    model : RefGroup, 
                    as : "Group", 
                    attributes : {exclude : ["kode_aplikasi", "ucr", "uch", "udcr", "udch"]}
                }
            ],
            attributes : {exclude : ["ucr", "uch", "udcr", "udch"]}
        })

        if (refAplikasi.length === 0) {
            throw new CustomError(httpCode.found, "Data Tidak Ada")
        }

        return refAplikasi
    } catch (error : any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
          } else {
            throw new CustomError(500, "Internal server error.");
          }
    }
}

const store = async (
    request:PostRefAplikasiSchema["body"], 
    file : any
    ) : Promise<RefAplikasiOutput> => {
    try {
        const AplikasiMax : string = await RefAplikasi.max("kode_aplikasi")

        const kodeAplikasi : any = await generateKodePrimary.generateKodeAplikasi(AplikasiMax)

        let publicFileImages : string = ""
        if(file && file.filename) {
            publicFileImages = `${getConfig("USMAN_BASE_URL")}${getConfig("PUBLIC_FILE_IMAGE")}/${file.filename}`
            console.log(publicFileImages)
        }
       
        const aplikasiInput : RefAplikasiInput = {
            kode_aplikasi : kodeAplikasi,
            nama_aplikasi : request.nama_aplikasi,
            keterangan : request.keterangan,
            status : Status.Tampil, //Default
            url : request.url,
            url_token : request.url_token,
            url_tte : request.url_tte,
            images : publicFileImages,
            ucr : request.ucr,
        }

        const insertAplikasi : RefAplikasiOutput = await RefAplikasi.create(aplikasiInput);

        if(!insertAplikasi) throw new CustomError(httpCode.found, "Gagal Membuat Aplikasi")

        return insertAplikasi

    } catch (error) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        }
        else {
            console.log(error)
            throw new CustomError(500, "Internal Server Error")
        }
    }
}

const getByKodeAPlikasi = async (
    id:GetRefAplikasiSchema["params"]["id"]) : 
    Promise<RefAplikasiOutput> => {
    try {
        const refAplikasi : RefAplikasi | null = await RefAplikasi.findOne({
            where : {
                kode_aplikasi : id
            }
        })

        if(!refAplikasi) {
            throw new CustomError(httpCode.found, "Aplikasi Tidak Ada")
        }

        return refAplikasi

    } catch (error : any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
          } else {
            throw new CustomError(500, "Internal server error.");
          }
    }
}

const updateAplikasi = async (
    id:UpdatedRefAplikasiSchema["params"]["id"],
    request : RefAplikasiInputUpdate, 
    file : any) :
    Promise<RefAplikasiOutput> => {
    try {
        const refAplikasi : RefAplikasi | null = await RefAplikasi.findByPk(id)

        if(!refAplikasi) throw new CustomError(httpCode.found, "Data Tidak Ada")

        refAplikasi.nama_aplikasi = request.nama_aplikasi,
        refAplikasi.keterangan = request.keterangan
        refAplikasi.status = request.status
        refAplikasi.url = request.url
        refAplikasi.url_token = request.url_token
        refAplikasi.url_tte = request.url_tte
        refAplikasi.uch = request.uch

        const existFile : string | null = refAplikasi.images

        if (file && file.filename) {
            const PUBLIC_FILE_GIRO = `${getConfig("PUBLIC_FILE_IMAGE")}/${
              file.filename
            }`;
      
            refAplikasi.images = PUBLIC_FILE_GIRO;
          }

          const response : RefAplikasiOutput = await refAplikasi.save()


          if(!response) {
            throw new CustomError(httpCode.found, "Gagal Menambah Data")
          }
          let part 
          let lastPart
          if(existFile) {
            part = existFile.split("/")
            lastPart = part[part.length - 1]

            if(file && file.path) {
                let unlink = await fs.unlink(path.join(__dirname, `../../../public/image/${lastPart}`))
                console.log(unlink)
            }
          }

          return response

    } catch (error : any) {
        if (error instanceof CustomError) {
            if (file && file.path) {
              await removeFile(file.path);
            }
        throw new CustomError(500, error.message)
    }
        else {
            throw new CustomError(500, error.message)
        }
    }
}



export default {
    index,
    store,
    getByKodeAPlikasi, 
    updateAplikasi
}