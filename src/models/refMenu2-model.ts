import { DataTypes, Model, Optional } from "sequelize";
import db from "@config/database";
import RefMenu1 from "./refMenu1-model";

export enum Status {
    Tampil = "1",
    Tidak_Tampil = "2"
}

interface IRefMenu2Attributes {
	kode_aplikasi  : string | null,
	kode_menu1     : string | null,
	kode_menu2     : string,
	nama_menu2     : string | null,
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

export type RefMenu2Output = Required<IRefMenu2Attributes>
export type RefMenu2Input = Optional<
    IRefMenu2Attributes,
    "kode_aplikasi" |
    "udch"|
    "udcr"|
    "ucr"|
    "uch"
>

class RefMenu2 
    extends Model<IRefMenu2Attributes, RefMenu2Input>
    implements IRefMenu2Attributes
{
    declare kode_aplikasi  : string | null;
    declare kode_menu1     : string | null;
    declare kode_menu2     : string;
    declare nama_menu2     : string | null;
    declare keterangan_menu: string | null;
    declare icon           : string | null;
    declare link           : string | null;
    declare status         : Status;
    declare on_update      : Status;
    declare on_create      : Status;
    declare on_delete: Status;
    declare on_view        : Status;
    declare ucr            : string | null;
    declare uch            : string | null;
    declare udcr           : Date | undefined;
    declare udch           : Date | undefined;
}

RefMenu2.init(
    {
        kode_aplikasi : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        kode_menu1 : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        kode_menu2 : {
            type : DataTypes.STRING(),
            allowNull : false,
            primaryKey : true
        },
        nama_menu2 : {
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
            type : DataTypes.ENUM('0','1'),
            allowNull : true
        },
        on_update : {
            type : DataTypes.ENUM('0','1'),
            allowNull : true
        },
        on_create : {
            type : DataTypes.ENUM('0','1'),
            allowNull : true
        },
        on_delete : {
            type : DataTypes.ENUM('0','1'),
            allowNull : true
        },
        on_view : {
            type : DataTypes.ENUM('0','1'),
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
		tableName : "ref_menu2",
		modelName : "RefMenu2",
		createdAt : "udcr",
		updatedAt : "udch"
    }
)

RefMenu2.belongsTo(RefMenu1, {
    foreignKey : "kode_menu1",
    as : "Menu1",
})

RefMenu1.hasMany(RefMenu2, {
    foreignKey : "kode_menu1",
    as : "Menu2",
})

export default RefMenu2