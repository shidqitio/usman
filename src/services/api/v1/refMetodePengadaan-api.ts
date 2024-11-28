import { debugLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import RefAplikasi from "@models/refAplikasi-model";
import MetodePengadaan from "@models/refMetodePengadaan-model";
import { httpCode } from "@utils/prefix";

const metodePengadaan = async () : Promise<MetodePengadaan[]> => {
    try {
        const getAll = await MetodePengadaan.findAll()

        return getAll
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.status, error.message);
        } else {
            debugLogger.debug(error)            
            throw new CustomError(500, "error", "Internal server error.");
        }
    }
}

export default {
    metodePengadaan
}