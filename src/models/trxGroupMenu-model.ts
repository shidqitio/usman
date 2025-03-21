import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";
import RefGroup from "./refGroup-model";
import RefMenu1 from "./refMenu1-model";
import RefMenu2 from "./refMenu2-model";
import RefMenu3, { IRefMenu3Attributes } from "./refMenu3-model";

export enum Akses {
	Aktif = "1", 
	TidakAktif = "0"
}

export interface ITrxGroupMenuAttributes {
	id_group_menu: number | undefined,
	kode_group   : string | null,
	kode_menu1   : string | null,
	kode_menu2   : string | null,
	kode_menu3   : string | null,
	akses        : Akses,
	urut         : number | null | undefined,
	ucr          : string | null | undefined,
	uch          : string | null | undefined,
	udcr         : Date | undefined,
	udch         : Date | undefined,
}

export type TrxGroupMenuOutput = Required<ITrxGroupMenuAttributes>
export type TrxGroupMenuInput = Optional<
ITrxGroupMenuAttributes, 
"id_group_menu" | 
"urut" | 
"uch" | 
"ucr" |
"udch" | 
"udcr"
>

class TrxGroupMenu 
	extends Model<ITrxGroupMenuAttributes>
	implements ITrxGroupMenuAttributes
{
	declare id_group_menu: number | undefined ;
	declare kode_group   : string | null ;
	declare kode_menu1   : string | null ;
	declare kode_menu2   : string | null ;
	declare kode_menu3   : string | null ;
	declare urut         : number | null | undefined ;
	declare akses        : Akses ;
	declare ucr          : string | null | undefined;
	declare uch          : string | null | undefined;
	declare udcr         : Date | undefined ;
	declare udch         : Date | undefined ;
}

TrxGroupMenu.init (
	{
		id_group_menu : {
			type : DataTypes.INTEGER(),
			allowNull : false,
			primaryKey : true,
			autoIncrement : true
		},
		kode_group : {
			type : DataTypes.STRING(),
			allowNull : true
		},
		kode_menu1 : {
			type : DataTypes.STRING(),
			allowNull : true
		},
		kode_menu2 : {
			type : DataTypes.STRING(),
			allowNull : true
		},
		kode_menu3 : {
			type : DataTypes.STRING(),
			allowNull : true
		},
		akses : {
			type : DataTypes.ENUM("0", "1"),
			allowNull : false
		},
		urut : {
			type : DataTypes.INTEGER(), 
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
		tableName : "trx_group_menu",
		modelName : "TrxGroupMenu",
		createdAt : "udcr",
		updatedAt : "udch"
	}
)

TrxGroupMenu.belongsTo(RefGroup, {
	foreignKey : "kode_group", 
	as : "Group"
})

RefGroup.hasMany(TrxGroupMenu, {
	foreignKey : "kode_group", 
	as : "TrxGroupMenu"
})

TrxGroupMenu.belongsTo(RefMenu1, {
	foreignKey : "kode_menu1", 
	as : "Menu1"
})

RefMenu1.hasMany(TrxGroupMenu, {
	foreignKey : "kode_menu1",
	as : "TrxGroupMenu"
})

TrxGroupMenu.belongsTo(RefMenu2, {
	foreignKey : "kode_menu2", 
	as : "Menu2"
})

RefMenu2.hasMany(TrxGroupMenu, {
	foreignKey : "kode_menu2",
	as  : "TrxGroupMenu"
})

TrxGroupMenu.belongsTo(RefMenu3, {
	foreignKey : "kode_menu3",
	as : "Menu3"
})

RefMenu3.hasMany(TrxGroupMenu, {
	foreignKey : "kode_menu3",
	as : "TrxGroupMenu"
})



export default TrxGroupMenu