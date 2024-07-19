import jwt from "jsonwebtoken" 
import RefUser from "@models/refUser-model"
import getConfig from "@config/dotenv"
import {Request, Response, NextFunction } from "express"
import CustomError from "./error-handler"
import { httpCode } from "@utils/prefix"
import db from "@config/database"
import { Op, QueryTypes } from "sequelize";
import {getPegawaiByEmail} from "@services/hrd/index"

const auth = async (
    req:Request,
    res:Response, 
    next:NextFunction) => {
    try {
         const authHeader = req.get("Authorization")
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


        const user_profile : any = await db.query(`
        SELECT a.id, a.email, a.is_login, COALESCE(b.username, c.username) AS username, a.status_user FROM ref_user a 
        LEFT JOIN ref_user_external b ON a.id = b.id_user 
        LEFT JOIN ref_user_internal c ON a.id = c.id_user
        WHERE a.id = (:id)
        `, {
            type : QueryTypes.SELECT,
            replacements : {
                id : decodeToken.id_user
            }
        })

        let hasil

        let data_hris

        if(user_profile[0].username === null || user_profile[0].username === 'undefined') {
            hasil = "unknown"
        }
       
        

        req.user  = {
            id : user.id,
            email : user.email,
            is_login : user.is_login,
            token : token, 
            username : user_profile[0].username || hasil
        }

        next()
    } catch (error) {
        
        next(error)
    }
}

export default auth