import db from "@config/database";
import RefGroup from "./refGroup-model";
import RefUser from "./refUser-model";
import { Optional, DataTypes, Model } from "sequelize";

export interface IRefTokenAppAttributes {
    id : string
    id_user : number | null
	kode_group : string | null
	token : string | null
	created_at : Date | undefined
	updated_at : Date | undefined
}

export type RefTokenAppOutput = Required<IRefTokenAppAttributes>
export type RefTokenAppInput = Optional <
IRefTokenAppAttributes, 
"created_at" | 
"updated_at" | 
"token"
>

class RefTokenApp 
    extends Model<IRefTokenAppAttributes, RefTokenAppInput>
    implements IRefTokenAppAttributes
    {
        declare id : string
        declare id_user : number | null
        declare kode_group : string | null
        declare token : string | null
        declare created_at : Date | undefined
        declare updated_at : Date | undefined
    }

RefTokenApp.init (
    {
        id : {
            type : DataTypes.STRING(),
            primaryKey : true
        },
        id_user : {
            type : DataTypes.STRING(),
            allowNull : false
        },
        kode_group : {
            type : DataTypes.STRING(),
            allowNull : false
        },
        token : {
            type : DataTypes.STRING(),
            allowNull : false
        },
        created_at : {
            type : DataTypes.DATE(),
            allowNull : true
        },
        updated_at : {
            type : DataTypes.DATE(),
            allowNull : true
        },
    }, 
    {
        sequelize : db, 
		schema : "public",
		tableName : "ref_token_app",
		modelName : "RefTokenApp",
		createdAt : "created_at",
		updatedAt : "updated_at"
    }
)

RefTokenApp.belongsTo(RefUser, {
    foreignKey : "id_user", 
    as : "User"
})

RefUser.hasMany(RefTokenApp,{
    foreignKey : "id_user", 
    as : "TokenApp"
})

RefTokenApp.belongsTo(RefGroup, {
    foreignKey : "kode_group",
    as : "Group"
})

RefGroup.hasMany(RefTokenApp, {
    foreignKey : "kode_group",
    as : "TokenApp"
})

export default RefTokenApp