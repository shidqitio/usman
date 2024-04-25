import { DataTypes, Model, Optional } from "sequelize";
import db from "@config/database";

export enum StatusUser  {
    internal = "internal",
    eksternal = "eksternal"
}

export interface IRefUserAttributes {
	id       : number ,
	email    : string ,
	password : string | null | undefined,
	api_token: any | null,
	is_login : string | null,
    forget_token_pass : string | null, 
    user_photo : string | null | undefined,
    status_user : StatusUser,
	ucr      : string | null | undefined,
	uch      : string | null | undefined,
	udcr     : Date | undefined,
	udch     : Date | undefined,
}

export type RefUserOutput = Required<IRefUserAttributes>
export type RefUserInput = Optional<
IRefUserAttributes, 
"id" |
"forget_token_pass" |
"status_user" |
"uch" | 
"ucr" | 
"udch"|
"udcr"
>

class RefUser
    extends Model <IRefUserAttributes, RefUserInput>
    implements IRefUserAttributes
{
    declare id       : number ;
    declare email    : string ;
    declare password : string | null | undefined;
    declare api_token: any | null;
    declare is_login : string | null;
    declare forget_token_pass : string | null ;
    declare user_photo: string | null | undefined;
    declare status_user: StatusUser; 
    declare ucr      : string | null | undefined;
    declare uch      : string | null | undefined;
    declare udcr     : Date | undefined;
    declare udch     : Date | undefined;
}

RefUser.init(
    {
        id : {
            type : DataTypes.INTEGER(), 
            allowNull : false, 
            primaryKey : true, 
            autoIncrement : true
        },
        email : {
            type : DataTypes.STRING(), 
            allowNull : true
        },
        password : {
            type : DataTypes.STRING(), 
            allowNull : true
        },
        api_token : {
            type : DataTypes.STRING(), 
            allowNull : true
        },
        is_login : {
            type : DataTypes.STRING(), 
            allowNull : true
        },
        user_photo : {
            type : DataTypes.STRING(), 
            allowNull : true
        },
        forget_token_pass : {
            type : DataTypes.STRING(), 
            allowNull : true
        },
        status_user : {
            type : DataTypes.ENUM("internal","eksternal")
        },
        ucr : {
            type : DataTypes.STRING(), 
            allowNull : true
        },
        uch : {
            type : DataTypes.STRING(), 
            allowNull : true
        },
        udcr : {
            type : DataTypes.DATE(), 
            allowNull : true
        },
        udch : {
            type : DataTypes.DATE(), 
            allowNull : true
        },
    }, 
    {
        sequelize : db, 
		schema : "public",
		tableName : "ref_user",
		modelName : "RefUser",
		createdAt : "udcr",
		updatedAt : "udch"
    }
)

export default RefUser