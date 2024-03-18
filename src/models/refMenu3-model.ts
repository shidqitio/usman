import db from "@config/database";
import { DataTypes, Model, Optional  } from "sequelize";
import RefMenu2 from "./refMenu2-model";

export enum Status {
    Tampil = "0",
    Tidak_Tampil = "1"
}

export interface IRefMenu3Attributes {
	kode_aplikasi  : string | null,
	kode_menu2     : string | null,
	kode_menu3     : string,
	nama_menu3     : string | null,
	keterangan_menu: string | null,
	icon           : string | null,
	link           : string | null,
	status         : Status,
	on_update      : Status,
	on_create      : Status,
	on_delete      : Status,
	on_view        : Status,
	ucr            : string | null,
	uch            : string | null,
	udcr           : Date | undefined,
	udch           : Date | undefined,
}

export type RefMenu3Output = Required<IRefMenu3Attributes>;
export type RefMenu3Input = Optional<
    IRefMenu3Attributes, 
    "uch"|
    "ucr"|
    "udch"|
    "udcr"
>

class RefMenu3 
    extends Model<IRefMenu3Attributes, RefMenu3Input>
    implements IRefMenu3Attributes
{
    declare kode_aplikasi  : string | null;
    declare kode_menu2     : string | null;
    declare kode_menu3     : string;
    declare nama_menu3     : string | null;
    declare keterangan_menu: string | null;
    declare icon           : string | null;
    declare link           : string | null;
    declare status         : Status;
    declare on_update      : Status;
    declare on_create      : Status;
    declare on_delete      : Status;
    declare on_view        : Status;
    declare ucr            : string | null;
    declare uch            : string | null;
    declare udcr           : Date | undefined;
    declare udch           : Date | undefined;
}

RefMenu3.init(
    {
        kode_aplikasi : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        kode_menu2 : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        kode_menu3 : {
            type : DataTypes.STRING(),
            allowNull : false,
            primaryKey : true
        },
        nama_menu3 : {
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
		tableName : "ref_menu3",
		modelName : "RefMenu3",
		createdAt : "udcr",
		updatedAt : "udch"
    }
)

RefMenu3.belongsTo(RefMenu2, {
    foreignKey : "kode_menu2",
    as : "Menu2",
})

RefMenu2.hasMany(RefMenu3, {
    foreignKey : "kode_menu2",
    as : "Menu3",
})


export default RefMenu3;