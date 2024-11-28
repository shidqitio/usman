import { DataTypes, Model, Optional } from "sequelize";
import db from "@config/database";
import PBJ from "./refPbj-model";


export enum jabatan {
    PPk = "PPK",
    PP = "PP",
    PK = "PK"
}

interface IRefJabatanAttributes {
    kode_jabatan : string,
    kode_jabatan_atasan : string | undefined | null,
    nama_jabatan : string | undefined | null,
    jabatan : jabatan,
    kode_pbj : string | undefined | null
    ucr : string | undefined | null,
    uch : string | undefined | null,
    udcr : Date | undefined,
    udch : Date | undefined
}

export type RefJabatanOutput = Required<IRefJabatanAttributes>
export type RefJabatanInput = Optional <
    IRefJabatanAttributes,
    "kode_jabatan" | 
    "kode_jabatan_atasan" |
    "jabatan" |
    "kode_pbj" |
    "ucr" | 
    "uch" |
    "udch" | 
    "udcr"
>;


// export type RefAplikasiInsert = {
// 	kode_aplikasi : any,
// 	nama_aplikasi : string
// }

class RefJabatan 
	extends Model<IRefJabatanAttributes, RefJabatanInput>
	implements IRefJabatanAttributes
{
    declare kode_jabatan : string;
    declare kode_jabatan_atasan : string | undefined | null;
    declare nama_jabatan : string | undefined | null;
    declare jabatan: jabatan;
    declare kode_pbj: string | null | undefined;
    declare ucr : string | undefined | null;
    declare uch : string | undefined | null;
    declare udcr : Date | undefined;
    declare udch : Date | undefined;
}

RefJabatan.init(
	{
        kode_jabatan : {
            type : DataTypes.STRING,
            allowNull : false,
            primaryKey : true
        },
        kode_jabatan_atasan : {
            type : DataTypes.STRING,
            allowNull : true
        },
        nama_jabatan : {
            type : DataTypes.STRING,
            allowNull : true
        },
        jabatan : {
            type : DataTypes.STRING,
            allowNull : true
        },
        kode_pbj : {
            type : DataTypes.STRING,
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
		tableName : "ref_jabatan",
		modelName : "RefJabatan",
		createdAt : "udcr",
		updatedAt : "udch"
	}
)

RefJabatan.belongsTo(PBJ,{
    foreignKey : "kode_pbj",
    as : "PBJ"
})

PBJ.hasMany(RefJabatan, {
    foreignKey : "kode_pbj",
    as : "RefJabatan"
})

export default RefJabatan