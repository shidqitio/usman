import { DataTypes, Model, Optional } from "sequelize";
import db from "@config/database";
import RefUser from "./refUser-model";
import RefJabatan from "./refJabatan-model";


export enum status_aktif {
    aktif = "aktif",
    non_aktif = "non_aktif"
}

interface ITrxJabatanUserAttributes {
    kode_jabatan_user : number,
	kode_jabatan : string | undefined | null,
	id_user : number | undefined | null,
	sk_jabatan : string | undefined | null,
	status_aktif : status_aktif,
	ucr : string | undefined | null,
	uch : string | undefined | null,
	udcr : Date | undefined,
	udch : Date | undefined,
}

export type TrxJabatanUserOutput = Required<ITrxJabatanUserAttributes>
export type TrxJabatanUserInput = Optional <
    ITrxJabatanUserAttributes,
    "kode_jabatan" |
    "id_user" |
    "kode_jabatan_user" |
    "status_aktif" |
    "uch" |
    "ucr" | 
    "udch" |
    "udcr"
>;



class TrxJabatanUser 
	extends Model<ITrxJabatanUserAttributes, TrxJabatanUserInput>
	implements ITrxJabatanUserAttributes
{
    declare kode_jabatan_user : number;
    declare kode_jabatan : string | undefined | null;
    declare id_user : number | undefined | null;
    declare sk_jabatan : string | undefined | null;
    declare status_aktif : status_aktif;
    declare ucr : string | undefined | null;
    declare uch : string | undefined | null;
    declare udcr : Date | undefined;
    declare udch : Date | undefined;
}

TrxJabatanUser.init(
	{
        kode_jabatan_user : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kode_jabatan : {
            type : DataTypes.STRING,
            allowNull : true
        },
        id_user : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references : {
                model : RefUser,
                key : "id"
            },
            onUpdate : "cascade",
            onDelete : "cascade"
        },
        sk_jabatan : {
            type : DataTypes.STRING,
            allowNull : true
        },
        status_aktif : {
            type : DataTypes.ENUM("aktif", "non_aktif"),
            allowNull : true
        },
        ucr : {
            type : DataTypes.STRING,
            allowNull : true
        },
        uch : {
            type : DataTypes.STRING,
            allowNull : true
        },
        udcr : {
            type : DataTypes.DATE,
            allowNull : true
        },
        udch : {
            type : DataTypes.DATE,
            allowNull : true
        },
	}, 
	{
		sequelize : db, 
		schema : "public",
		tableName : "trx_jabatan_user",
		modelName : "TrxJabatanUser",
		createdAt : "udcr",
		updatedAt : "udch"
	}
)

TrxJabatanUser.belongsTo(RefJabatan, {
    foreignKey : "kode_jabatan",
    as : "RefJabatan"
})

RefJabatan.hasMany(TrxJabatanUser, {
    foreignKey : "kode_jabatan",
    as : "TrxJabatanUser"
})

TrxJabatanUser.belongsTo(RefUser, {
    foreignKey : "id_user",
    as : "RefUser"
})

RefUser.hasMany(TrxJabatanUser, {
    foreignKey : "id_user",
    as : "TrxJabatanUser"
})



export default TrxJabatanUser