import { DataTypes, Model, Optional  } from "sequelize";
import db from "@config/database";

export enum StatusPengumuman {
    aktif = "aktif",
    tidak_aktif = "tidak_aktif"
}

interface IRefPengumumanAttributes {
    kode_pengumuman : number, 
    judul_pengumuman : string | null, 
    isian_pengumuman : Text | null,
    status_pengumuman : StatusPengumuman,
    ucr            : string | null | undefined,
	uch            : string | null | undefined,
    udcr           : Date | undefined,
	udch           : Date | undefined,
}

export type PengumumanOutput = Required<IRefPengumumanAttributes>

export type PengumumanInput = Optional<
IRefPengumumanAttributes,
"uch" |
"ucr" |
"kode_pengumuman" |
"status_pengumuman"
>

class Pengumuman
    extends Model<IRefPengumumanAttributes, PengumumanInput>
    implements IRefPengumumanAttributes
    {
        declare kode_pengumuman : number;
        declare judul_pengumuman : string | null;
        declare isian_pengumuman : Text | null;
        declare status_pengumuman : StatusPengumuman;
        declare ucr            : string | null | undefined;
        declare uch            : string | null | undefined;
        declare udcr           : Date | undefined;
        declare udch           : Date | undefined;
    }

Pengumuman.init(
    {
        kode_pengumuman : {
            type : DataTypes.INTEGER(),
            allowNull : false,
            autoIncrement : true,
            primaryKey : true
        },
        judul_pengumuman : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        isian_pengumuman : {
            type : DataTypes.TEXT(),
            allowNull : true
        },
        status_pengumuman : {
            type : DataTypes.ENUM("aktif", "tidak_aktif"),
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
        tableName : "ref_pengumuman",
        modelName : "Pengumuman",
        createdAt: "udcr",
        updatedAt : "udch"
    }
)

export default Pengumuman