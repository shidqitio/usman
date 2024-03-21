import { DataTypes, Model, Optional } from "sequelize";
import db from "@config/database";
import RefUser from "./refUser-model";
import RefGroup from "./refGroup-model";

export enum statusGroupUser {
    Aktif = "1",
    TidakAktif = "0"
}

export interface ITrxGroupUserAttributes {
	id_group_user: number,
	kode_group     : string | null,
	id_user        : number,
	status         : statusGroupUser,
	ucr            : string | null,
	uch            : string | null,
	udcr           : Date | undefined,
	udch           : Date | undefined,
}

export type TrxGroupUserOutput = Required<ITrxGroupUserAttributes>
export type TrxGroupUserInput = Optional <
ITrxGroupUserAttributes, 
"id_group_user" |
"uch" | 
"ucr" | 
"udch" | 
"udcr"
>

class TrxGroupUser
    extends Model <ITrxGroupUserAttributes, TrxGroupUserInput>
    implements ITrxGroupUserAttributes
    {
        declare id_group_user: number;
        declare kode_group     : string | null;
        declare id_user        : number;
        declare status         : statusGroupUser;
        declare ucr            : string | null;
        declare uch            : string | null;
        declare udcr           : Date | undefined;
        declare udch           : Date | undefined;
    }

TrxGroupUser.init (
    {
        id_group_user : {
            type : DataTypes.STRING(),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true, 

        },
        kode_group : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        id_user : {
            type : DataTypes.STRING(),
            allowNull : false, 
            references : {
                model : RefUser, 
                key : 'id'
            },
            onDelete : 'cascade'
        },
        status : {
            type : DataTypes.ENUM("1", "0"),
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
            type : DataTypes.STRING(),
            allowNull : true
        },
        udch : {
            type : DataTypes.STRING(),
            allowNull : true
        },
    }, 
    {
        sequelize : db, 
		schema : "public",
		tableName : "trx_group_user",
		modelName : "TrxGroupUser",
		createdAt : "udcr",
		updatedAt : "udch"
    }
)

TrxGroupUser.belongsTo(RefGroup, {
    foreignKey : "kode_group", 
    as : "Group"
})

RefGroup.hasMany(TrxGroupUser, {
    foreignKey : "kode_group", 
    as : "TrxGroupUser"
})

TrxGroupUser.belongsTo(RefUser, {
    foreignKey : "id_user",
    as : "User"
})

RefUser.hasMany(TrxGroupUser, {
    foreignKey : "id_user",
    as : "TrxGroupUser"
})

export default TrxGroupUser