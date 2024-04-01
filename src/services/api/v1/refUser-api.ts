import RefUser, { RefUserOutput } from "@models/refUser-model";
import {
    PayloadUpdateSchema
} from "@schema/api/refUser-schema"
import CustomError from "@middleware/error-handler";
import { httpCode } from "@utils/prefix";
import getConfig from "@config/dotenv";
import { removeFile } from "@utils/remove-file";

const updateUserPhoto = async (
    id:PayloadUpdateSchema["parameter"]["id"],
    file : any
    ) => {
    try {
        const refUser : RefUser | null = await RefUser.findByPk(id, {
            attributes : ["id","email","user_photo"]
        })

        if(!refUser) {
            throw new CustomError(httpCode.unprocessableEntity, "Data Tidak Ada")
        }

        let data_photo

        if(file && file.filename) {
            const PUBLIC_FILE_GIRO = `${getConfig("USMAN_BASE_URL")}${getConfig("PUBLIC_FILE_IMAGE_PROFIL")}${file.filename}`;
      
            data_photo = PUBLIC_FILE_GIRO;
        }

        console.log("TES FILE PATH : ", file.path)

        const [update, [updateUser]] = await RefUser.update({
            user_photo : data_photo
        }, {
            
            where : {
                id : id
            },
            returning : true
        })

        const updatedRefUser : RefUser | null = await RefUser.findByPk(id, {
            attributes : ["id","email","user_photo"]
        })
        
        if(update === 0) throw new CustomError(httpCode.unprocessableEntity, "Data Gagal Update")


        return updatedRefUser
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
    updateUserPhoto
}