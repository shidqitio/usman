import CustomError from "@middleware/error-handler";
import RefLevel from "@models/refLevel-model";
import { httpCode } from "@utils/prefix";

const index = async () : Promise<RefLevel[]> => {
    try {
        const getLevel : RefLevel[]= await RefLevel.findAll({
            attributes : {exclude : ["udcr","udch"]}
        })

        return getLevel
    } catch (error : any) {
        if (error instanceof CustomError) {
            throw new CustomError(500,error.status, error.message)
        }
            else {
                throw new CustomError(500, "error", error.message)
            }
    }
}

export default {
    index
}