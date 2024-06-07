import RefUser from "./refUser-model";
import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";

export interface IRefUserInternalAttributes {
	id           : number
	id_user      : number | null | undefined,
	nip          : string | null | undefined,
	username     : string | null | undefined,
	udcr         : Date | undefined,
	udch         : Date | undefined,
}

export type RefUserInternalOutput = Required<IRefUserInternalAttributes>
export type RefUserInternalInput = Optional<
IRefUserInternalAttributes, 
"id" |
"id_user" | 
"udch" | 
"udcr"
>

class RefUserInternal 
    extends Model<IRefUserInternalAttributes, RefUserInternalInput>
    implements IRefUserInternalAttributes
{
	declare id           : number;
	declare id_user      : number | null | undefined ;
	declare nip          : string | null | undefined ;
	declare username     : string | null | undefined ;
	declare udcr         : Date | undefined ;
	declare udch         : Date | undefined ;
}

RefUserInternal.init(
    {
        id : {
            type : DataTypes.INTEGER(),
            allowNull : false, 
            primaryKey : true,
            autoIncrement : true
        },
        id_user : {
            type : DataTypes.STRING(),
            allowNull : true,
            references : {
                model : RefUser, 
                key : 'id'
            }, 
            onDelete : "cascade"
        },
        nip : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        username : {
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
        tableName : "ref_user_internal",
        modelName : "RefUserInternal", 
        createdAt : "udcr", 
        updatedAt : "udch"
    }
)

RefUserInternal.belongsTo(RefUser, {
    foreignKey : "id_user", 
    as : "RefUser"
})

RefUser.hasOne(RefUserInternal, {
    foreignKey : "id_user", 
    as : "RefUserInternal"
})

export default RefUserInternal
