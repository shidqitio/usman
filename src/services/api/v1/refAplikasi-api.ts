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
import { removeFile, removeFileName, removeByLastNameAplikasi } from "@utils/remove-file";
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
            throw new CustomError(httpCode.unprocessableEntity, "Data Tidak Ada")
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
    file : any, 
    ucr : string
    ) : Promise<RefAplikasiOutput> => {
    try {
        const AplikasiMax : string = await RefAplikasi.max("kode_aplikasi")

        const kodeAplikasi : any = await generateKodePrimary.generateKodeAplikasi(AplikasiMax)

        let publicFileImages : string = ""
        if(file && file.filename) {
            publicFileImages = `${file.filename}`
            console.log(publicFileImages)
        }

        console.log(publicFileImages)
       
        const aplikasiInput : RefAplikasiInput = {
            kode_aplikasi : kodeAplikasi,
            nama_aplikasi : request.nama_aplikasi,
            keterangan : request.keterangan,
            status : Status.Tampil, //Default
            url : request.url,
            url_token : request.url_token,
            images : publicFileImages,
            ucr : ucr 
        }

        const insertAplikasi : RefAplikasiOutput = await RefAplikasi.create(aplikasiInput);

        if(!insertAplikasi) throw new CustomError(httpCode.unprocessableEntity, "Gagal Membuat Aplikasi")

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
            throw new CustomError(httpCode.unprocessableEntity, "Aplikasi Tidak Ada")
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
    request : UpdatedRefAplikasiSchema["body"], 
    file : any, 
    uch : string) :
    Promise<RefAplikasiOutput> => {
    try {
        const refAplikasi : RefAplikasi | null = await RefAplikasi.findByPk(id)

        if(!refAplikasi) throw new CustomError(httpCode.unprocessableEntity, "Data Tidak Ada")

        refAplikasi.nama_aplikasi = request.nama_aplikasi,
        refAplikasi.keterangan = request.keterangan
        refAplikasi.status = request.status
        refAplikasi.url = request.url
        refAplikasi.url_token = request.url_token
        refAplikasi.uch = uch

        const existFile : string | null = refAplikasi.images

        console.log(file)
        if (file && file.filename) {
            const PUBLIC_FILE_GIRO = `${file.filename}`;
      
            refAplikasi.images = PUBLIC_FILE_GIRO;
          }

          const response : RefAplikasiOutput = await refAplikasi.save()


          if(!response) {
            throw new CustomError(httpCode.unprocessableEntity, "Gagal Mengubah Data")
          }

          if(existFile) {

            if(file && file.path) {
                let unlink = await fs.unlink(path.join(__dirname, `../../../../public/aplikasi/${existFile}`))
                console.log(unlink)
            }
            return response
          }
          else {
            return response
          }

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

const deleteAplikasi = async (id:GetRefAplikasiSchema["params"]["id"]) : Promise<any | null> => {
    try {
        const exRefAplikasi : RefAplikasi |  null = await RefAplikasi.findOne({
            where : {
                kode_aplikasi : id
            }
        })

        if(!exRefAplikasi) throw new CustomError(httpCode.unprocessableEntity, "Data Tidak Ada")

      

        const removeAplikasi = await RefAplikasi.destroy({
            where : {
                kode_aplikasi : id
            }
        })
        console.log("TES REMOVE : ", removeAplikasi)

        if(removeAplikasi === 0) throw new CustomError(httpCode.unprocessableEntity, "Data Gagal Hapus")

        if(exRefAplikasi.images !== null || exRefAplikasi.images === "") {
           const lastData = await removeByLastNameAplikasi(exRefAplikasi.images)
           await fs.unlink(path.join(__dirname, `../../../../public/aplikasi/${lastData}`))
        }
    
        return exRefAplikasi
    } catch (error : any) {
        if (error instanceof CustomError) {
        throw new CustomError(500, error.message)
    }
        else {
            throw new CustomError(500, error.message)
        }
    }
}

const countRefAplikasi = async () : Promise<any> => {
    try {
        const count : number = await RefAplikasi.count()

        return count

    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}




export default {
    index,
    store,
    getByKodeAPlikasi, 
    updateAplikasi,
    deleteAplikasi,
    countRefAplikasi
}