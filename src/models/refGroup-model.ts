import {DataTypes, Model, Optional} from "sequelize"
import db from "@config/database"
import RefAplikasi from "@models/refAplikasi-model"
import RefLevel from "./refLevel-model"

interface IRefGroupAttributes {
    kode_group : string 
	nama_group : string | null 
	kode_aplikasi : string | null 
    kode_level : number
	ucr : string | null | undefined
	uch : string | null | undefined
	udcr : Date | undefined 
	udch : Date | undefined 
}

export type RefGroupOutput = Required<IRefGroupAttributes>
export type RefGroupInput = Optional<
    IRefGroupAttributes,
    "kode_aplikasi" | 
    "kode_group" |
    "kode_level" |
    "ucr" | 
    "uch" | 
    "udcr" | 
    "udch"
>; 

class RefGroup 
    extends Model<IRefGroupAttributes, RefGroupInput>
    implements IRefGroupAttributes
{
    declare kode_aplikasi: string | null ;
    declare nama_group: string | null;
    declare kode_group: string ;
    declare kode_level: number
    declare ucr: string | null | undefined;
    declare uch: string | null | undefined;
    declare udcr: Date | undefined ;
    declare udch: Date | undefined;
}

RefGroup.init (
    {
        kode_aplikasi : {
            type : DataTypes.STRING(), 
            allowNull : false,
        },
        nama_group : {
            type : DataTypes.STRING(), 
            allowNull : true,
        },
        kode_group : {
            type : DataTypes.STRING(), 
            allowNull : false,
            primaryKey : true
        },
        kode_level : {
            type : DataTypes.INTEGER(), 
            allowNull : false
        },
        ucr : {
            type : DataTypes.STRING(), 
            allowNull : true,
        },
        uch : {
            type : DataTypes.STRING(), 
            allowNull : true,
        },
        udcr : {
            type : DataTypes.DATE(), 
            allowNull : true,
        },
        udch : {
            type : DataTypes.DATE(), 
            allowNull : true,
        },
    }, 
    {
        sequelize : db, 
		schema : "public",
		tableName : "ref_group",
		modelName : "RefGroup",
		createdAt : "udcr",
		updatedAt : "udch"
    }
)

RefGroup.belongsTo(RefAplikasi, {
    foreignKey : "kode_aplikasi", 
    as : "Aplikasi"
})

RefAplikasi.hasMany(RefGroup, { 
    foreignKey : "kode_aplikasi", 
    as : "Group"
})

RefGroup.belongsTo(RefLevel, {
    foreignKey : "kode_level",
    as : "Level"
})

RefLevel.hasMany(RefGroup, {
    foreignKey : "kode_level",
    as : "Group"
})


export default RefGroup