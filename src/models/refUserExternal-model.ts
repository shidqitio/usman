import { Model, DataTypes, Optional } from "sequelize";
import db from "@config/database";
import RefUser from "./refUser-model";

export enum statusPengguna {
    Perorangan = "perorangan", 
    Perusahaan = "perusahaan"
}

export interface IRefUserExternalAttributes {
	id_user        : number
	username       : string | null | undefined,
	nama           : string | null | undefined,
	nik            : string | null | undefined,
	siup           : string | null | undefined,
	status_pengguna: statusPengguna,
	udcr           : Date | undefined,
	udch           : Date | undefined,
	id             : number,
}

export type RefUserExternalOutput = Required<IRefUserExternalAttributes>
export type RefUserExternalInput = Optional<
IRefUserExternalAttributes, 
"id" | 
"id_user" | 
"udch" | 
"udcr"
>

class RefUserExternal 
    extends Model<IRefUserExternalAttributes, RefUserExternalInput>
    implements IRefUserExternalAttributes
{
    declare id_user        : number ;
	declare username       : string | null | undefined ;
	declare nama           : string | null | undefined ;
	declare nik            : string | null | undefined ;
	declare siup           : string | null | undefined ;
	declare status_pengguna: statusPengguna ;
	declare udcr           : Date | undefined ;
	declare udch           : Date | undefined ;
	declare id             : number ;
}

RefUserExternal.init(
    {
        id : {
            type : DataTypes.INTEGER(),
            allowNull : false, 
            primaryKey : true,
            autoIncrement : true
        }, 
        id_user : {
            type : DataTypes.STRING(),
            allowNull : false,
            references : {
                model : RefUser, 
                key : "id"
            },
            onDelete : "cascade"
        }, 
        username : {
            type : DataTypes.STRING(),
            allowNull : true
        }, 
        nama : {
            type : DataTypes.STRING(),
            allowNull : true
        }, 
        nik : {
            type : DataTypes.STRING(),
            allowNull : true
        }, 
        siup : {
            type : DataTypes.STRING(),
            allowNull : true
        }, 
        status_pengguna : {
            type : DataTypes.ENUM("perorangan", "perusahaan"),
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
        tableName : "ref_user_external", 
        modelName : "RefUserExternal",
        createdAt : "udcr", 
        updatedAt : "udch"
    }
)

RefUserExternal.belongsTo(RefUser, {
    foreignKey : "id_user", 
    as : "RefUser"
})

RefUser.hasOne(RefUserExternal, {
    foreignKey : "id_user", 
    as : "RefUserExternal"
})

export default RefUserExternal