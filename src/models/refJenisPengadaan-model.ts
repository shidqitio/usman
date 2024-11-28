import { DataTypes, Model, Optional } from "sequelize";
import db from "@config/database";

interface IRefJenisPengadaanAttributes {
    kode_jenis_pengadaan : number, 
    jenis_pengadaan : string | null | undefined
}

export type JenisPengadaanOutput = Required<IRefJenisPengadaanAttributes>

export type JenisPengadaanInput = Optional<
IRefJenisPengadaanAttributes,
"kode_jenis_pengadaan"
>

class JenisPengadaan
    extends Model<IRefJenisPengadaanAttributes, JenisPengadaanInput>
    implements IRefJenisPengadaanAttributes
    {
        declare kode_jenis_pengadaan: number;
        declare jenis_pengadaan: string | null | undefined;
    }

JenisPengadaan.init(
    {
        kode_jenis_pengadaan : {
            type : DataTypes.INTEGER(),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        jenis_pengadaan : {
            type : DataTypes.STRING(),
            allowNull : false
        }
    },
    {
        sequelize : db,
        schema : "public",
        tableName : "ref_jenis_pengadaan",
        modelName : "JenisPengadaan",
        timestamps : false
    }
)

export default JenisPengadaan