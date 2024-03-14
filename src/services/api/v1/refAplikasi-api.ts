import CustomError from "@middleware/error-handler";
import RefAplikasi, {Status,RefAplikasiInput, RefAplikasiOutput} from "@models/refAplikasi-model";
import {
    PostRefAplikasiSchema,
    UpdatedRefAplikasiSchema
} from "@schema/api/refAplikasi-schema"
import { httpCode } from "@utils/prefix";
import generateKodePrimary from "@utils/generate_auto_code"
import dotenv from "dotenv"
dotenv.config()


const store = async (
    request:PostRefAplikasiSchema["body"], 
    file : any
    ) : Promise<RefAplikasiOutput> => {
    try {
        const AplikasiMax : string = await RefAplikasi.max("kode_aplikasi")

        const kodeAplikasi : any = await generateKodePrimary.generateKodeAplikasi(AplikasiMax)

        let publicFileImages : string = ""
        if(file && file.filename) {
            publicFileImages = `${process.env.DEV_USMAN_BASE_URL}${process.env.DEV_PUBLIC_FILE_IMAGE}/${file.filename}`
            console.log(publicFileImages)
        }
       
        const aplikasiInput : RefAplikasiInput = {
            kode_aplikasi : kodeAplikasi,
            nama_aplikasi : request.nama_aplikasi,
            status : Status.Tampil, //Default
            url : request.url,
            url_token : request.url_token,
            url_tte : request.url_tte,
            image : publicFileImages,
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
            // console.log(error)
            throw new CustomError(500, "Internal Server Error")
        }
    }
}

export default {
    store
}