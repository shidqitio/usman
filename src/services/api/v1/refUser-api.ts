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
        const refUser : RefUser | null = await RefUser.findByPk(id)

        if(!refUser) {
            throw new CustomError(httpCode.unprocessableEntity, "Data Tidak Ada")
        }

        const existFile : string | null | undefined = refUser.user_photo

        if(file && file.filename) {
            const PUBLIC_FILE_GIRO = `${getConfig("USMAN_BASE_URL")}${getConfig("PUBLIC_FILE_IMAGE")}${file.filename}`;
      
            refUser.user_photo = PUBLIC_FILE_GIRO;
        }

        console.log("TES FILE PATH : ", file.path)

        const response : RefUserOutput | null | undefined = await refUser.save()
        
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