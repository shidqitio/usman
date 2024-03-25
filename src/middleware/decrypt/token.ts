import CryptoJS from "crypto-js";
import { Request, Response, NextFunction } from "express";
import getConfig from "@config/dotenv";
import CustomError from "@middleware/error-handler";

const decryptData = async (
    token : string, 
    level:number ) : Promise<any | null> => {
        let decrypt : any
        //CEK KONDISI LEVEL 
        if(level === 1 ) {
            decrypt = CryptoJS.AES.decrypt(token, getConfig("SECRET_KEY_LVL1"))
        }

        if(level === 2 ) {
            decrypt = CryptoJS.AES.decrypt(token, getConfig("SECRET_KEY_LVL2"))
        }

        if(level === 3 ) {
            decrypt = CryptoJS.AES.decrypt(token, getConfig("SECRET_KEY_LVL3"))
        }

         //#################### GENERATED DECRYPT ########################
        
        // Convert decrypted ciphertext to a WordArray
        let decryptedWordArray = CryptoJS.lib.WordArray.create(decrypt.words, decrypt.sigBytes);

        // Convert WordArray to string
        let decryptedText = CryptoJS.enc.Utf8.stringify(decryptedWordArray);

        if(!decryptedText) {
            throw new CustomError(401, "User Not Authenticate")
        }

        return decryptedText

        //############################################################################

}

export default decryptData