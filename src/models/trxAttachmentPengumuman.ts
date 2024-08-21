import { DataTypes, Model, Optional } from "sequelize";
import db from "@config/database";
import Pengumuman from "./refPengumuman-model";

export interface ITrxAttachmentPengumuman {
    kode_pengumuman : number, 
    kode_attachment : number, 
    attachment : string | null | undefined, 
    ucr : string | null | undefined,
    uch : string | null | undefined,
    udcr : Date | undefined, 
    udch : Date | undefined 
}

export type TrxAttachmentPengumumanOutput = Required<TrxAttachmentPengumuman>

export type TrxAttachmentPengumumanInput = Optional<
ITrxAttachmentPengumuman, 
"uch" |
"ucr" | 
"udch" | 
"udcr" | 
"kode_attachment">

class TrxAttachmentPengumuman
    extends Model<ITrxAttachmentPengumuman, TrxAttachmentPengumumanInput>
    implements ITrxAttachmentPengumuman

{
    declare kode_pengumuman : number ;
    declare kode_attachment : number ;
    declare attachment : string | null | undefined ;
    declare ucr : string | null | undefined;
    declare uch : string | null | undefined;
    declare udcr : Date | undefined ;
    declare udch : Date | undefined;
}

TrxAttachmentPengumuman.init(
    {
        kode_pengumuman : {
            type : DataTypes.INTEGER(),
            allowNull : true,
        },
        kode_attachment : {
            type : DataTypes.INTEGER(),
            allowNull : false,
            primaryKey : true
        },
        attachment : {
            type : DataTypes.STRING(),
            allowNull : true,
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
        tableName : "trx_attachment_pengumuman",
        modelName : "TrxAttachmentPengumuman",
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

TrxAttachmentPengumuman.belongsTo(Pengumuman, {
    foreignKey : "kode_pengumuman",
    as : "Pengumuman"
})

Pengumuman.hasMany(TrxAttachmentPengumuman, {
    foreignKey : "kode_pengumuman",
    as : "TrxAttachPengumuman"
})

export default TrxAttachmentPengumuman