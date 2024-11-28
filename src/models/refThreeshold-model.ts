import { DataTypes, Model, Optional } from "sequelize";
import db from "@config/database";
import JenisPengadaan from "./refjenisPengadaan-model";
import MetodePengadaan from "./refMetodePengadaan-model";

interface IRefThreesholdAttributes {
    kode_threeshold : number
	nilai_min : number | undefined
	nilai_max : number | undefined
	kode_jenis_pengadaan : number | undefined
	kode_metode_pengadaan : number | undefined
	penanggung_jawab : string | null | undefined
}

export type ThreesholdOutput = Required<IRefThreesholdAttributes>

export type ThreesholdInput = Optional<
IRefThreesholdAttributes,
"kode_threeshold" |
"kode_metode_pengadaan"|
"kode_jenis_pengadaan"
>

class Threeshold
    extends Model<IRefThreesholdAttributes, ThreesholdInput>
    implements IRefThreesholdAttributes
    {
        declare kode_threeshold : number;
        declare nilai_min : number | undefined;
        declare nilai_max : number | undefined;
        declare kode_jenis_pengadaan : number | undefined;
        declare kode_metode_pengadaan : number | undefined;
        declare penanggung_jawab : string | null | undefined;
    }

Threeshold.init(
    {
        kode_threeshold : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        nilai_min : {
            type : DataTypes.BIGINT,
            allowNull : true
        },
        nilai_max : {
            type : DataTypes.BIGINT,
            allowNull : true
        },
        kode_jenis_pengadaan : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
        kode_metode_pengadaan : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
        penanggung_jawab : {
            type : DataTypes.STRING,
            allowNull : true
        },
    },
    {
        sequelize : db,
        schema : "public",
        tableName : "ref_threeshold",
        modelName : "Threeshold",
        timestamps : false
    }
)

Threeshold.belongsTo(JenisPengadaan, {
    foreignKey : "kode_metode_pengadaan",
    as : "RefJenisPengadaan"
})

JenisPengadaan.hasMany(Threeshold, {
    foreignKey : "kode_metode_pengadaan",
    as : "Threeshold"
})

Threeshold.belongsTo(MetodePengadaan, {
    foreignKey : "kode_metode_pengadaan",
    as : "RefMetodePengadaan"
})

MetodePengadaan.hasMany(Threeshold, {
    foreignKey : "kode_metode_pengadaan",
    as : "Threeshold"
})

export default Threeshold