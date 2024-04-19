import jwt from "jsonwebtoken" 
import RefUser from "@models/refUser-model"
import getConfig from "@config/dotenv"
import {Request, Response, NextFunction } from "express"
import CustomError from "./error-handler"
import { httpCode } from "@utils/prefix"

const auth = async (
    req:Request,
    res:Response, 
    next:NextFunction) => {
    try {
         const authHeader = req.get("Authorization")
        console.log("TES AUTH :", authHeader)
        if(!authHeader) {
            throw new CustomError(httpCode.unauthorized, "[1] Unauthorized")
        }
    
        const token  : any= authHeader?.split(" ")[1];
    
        let decodeToken : any;
        try {
            decodeToken  = jwt.verify(token, getConfig("SECRET_KEY"))
        } catch (error) {
            throw new CustomError(httpCode.unauthorized, "[2] Token Unauthorized")
        }

        console.log(decodeToken)

        const user : RefUser | null = await RefUser.findOne({
            where  : {
                id : decodeToken.id_user
            }
        })
        
        if(!user) {
            throw new CustomError(httpCode.unauthorized, "[3] Unauthorized")
        }


        req.user  = {
            id : user.id,
            email : user.email,
            is_login : user.is_login,
            token : token
        }

        next()
    } catch (error) {
        next(error)
    }
}

export default auth