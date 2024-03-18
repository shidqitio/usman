import { DataTypes, Model, Optional } from "sequelize";
import db from "@config/database";
import RefAplikasi from "./refAplikasi-model";
import RefLevel from "./refLevel-model";

export enum statusOn {
    Tampil = "1",
    Tidak_Tampil = "0",
}

interface IRefMenu1Attributes {
	kode_aplikasi  : string | null,
	kode_menu1     : string | any ,
    kode_level  : number,
	nama_menu1     : string | null,
	keterangan_menu: string | null,
	icon           : string | null,
	link           : string | null,
	status         : statusOn,
	on_update      : statusOn,
	on_create      : statusOn,
	on_delete      : statusOn,
	on_view        : statusOn,
	ucr            : string | null,
	uch            : string | null,
	udcr           : Date | undefined,
	udch           : Date | undefined,
}

export type RefMenu1Output = Required<IRefMenu1Attributes>;
export type RefMenu1Input = Optional<
    IRefMenu1Attributes, 
    "kode_aplikasi" |
    "kode_menu1" |
    "udch" | 
    "udcr"|
    "ucr" |
    "uch"
>


class RefMenu1 
    extends Model<IRefMenu1Attributes, RefMenu1Input>
    implements IRefMenu1Attributes
{
    declare kode_aplikasi  : string | null;
    declare kode_menu1     : string | any ;
    declare kode_level  : number;
    declare nama_menu1     : string | null;
    declare keterangan_menu: string | null;
    declare icon           : string | null;
    declare link           : string | null;
    declare status         : statusOn;
    declare on_update      : statusOn;
    declare on_create      : statusOn;
    declare on_delete      : statusOn;
    declare on_view        : statusOn;
    declare ucr            : string | null;
    declare uch            : string | null;
    declare udcr           : Date | undefined;
    declare udch           : Date | undefined;
}

RefMenu1.init(
    {
        kode_aplikasi : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        kode_menu1 : {
            type : DataTypes.STRING(),
            allowNull : false, 
            primaryKey : true
        },
        kode_level : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
        nama_menu1 : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        keterangan_menu : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        icon : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        link : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        status : {
            type : DataTypes.ENUM("0","1"),
            allowNull : true
        },
        on_update : {
            type : DataTypes.ENUM("0","1"),
            allowNull : true
        },
        on_create : {
            type : DataTypes.ENUM("0","1"),
            allowNull : true
        },
        on_delete : {
            type : DataTypes.ENUM("0","1"),
            allowNull : true
        },
        on_view : {
            type : DataTypes.ENUM("0","1"),
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
		tableName : "ref_menu1",
		modelName : "RefMenu1",
		createdAt : "udcr",
		updatedAt : "udch"
    }
)

RefMenu1.belongsTo(RefAplikasi, {
    foreignKey : "kode_aplikasi",
    as : "Aplikasi",
})

RefAplikasi.hasMany(RefMenu1, {
    foreignKey : "kode_aplikasi",
    as : "Menu1",
})

RefMenu1.hasMany(RefLevel, {
    foreignKey : "kode_level",
    as : "Level",
})

RefLevel.hasMany(RefMenu1, {
    foreignKey : "kode_level",
    as : "Menu1",
})

export default RefMenu1