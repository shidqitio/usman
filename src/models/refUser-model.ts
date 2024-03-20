import { DataTypes, Model, Optional } from "sequelize";
import db from "@config/database";

export interface IRefUserAttributes {
	id       : number ,
	email    : string | null,
	password : string | null,
	api_token: string | null,
	is_login : string | null,
	ucr      : string | null,
	uch      : string | null,
	udcr     : Date | undefined,
	udch     : Date | undefined,
}

export type RefUserOutput = Required<IRefUserAttributes>
export type RefUserInput = Optional<
IRefUserAttributes, 
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
    declare email    : string | null;
    declare password : string | null;
    declare api_token: string | null;
    declare is_login : string | null;
    declare ucr      : string | null;
    declare uch      : string | null;
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