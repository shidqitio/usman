import { DataTypes, Model, Optional } from "sequelize";
import db from "@config/database";

interface IRefLevelAttributes {
    kode_level : number  ,
	nama_level : string | null ,
	udcr : Date | undefined ,
	udch : Date | undefined ,
}

export type RefLevelInput = Optional<
IRefLevelAttributes,
"kode_level"|
"udch" | 
"udcr"
>

class RefLevel 
    extends Model<IRefLevelAttributes, RefLevelInput>
    implements IRefLevelAttributes
{
    declare kode_level: number;
    declare nama_level: string | null;
    declare udcr: Date | undefined; 
    declare udch: Date | undefined;
}

RefLevel.init ( 
    {
        kode_level : {
            type : DataTypes.NUMBER(), 
            allowNull : false, 
            primaryKey : true,
            autoIncrement : true
        },
        nama_level : {
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
		tableName : "ref_level",
		modelName : "RefLevel",
		createdAt : "udcr",
		updatedAt : "udch"
    }
)

export default RefLevel