import { DataTypes, Model, Optional } from "sequelize";
import db from "@config/database";
import RefAplikasi from "./refAplikasi-model";

interface IRefMetodePengadaanAttributes {
    kode_metode_pengadaan : number,
	metode_pengadaan : string | null | undefined,
}

export type MetodePengadaanOutput = Required<IRefMetodePengadaanAttributes>

export type MetodePengadaanInput = Optional<
IRefMetodePengadaanAttributes, 
"kode_metode_pengadaan"
>

class MetodePengadaan 
    extends Model<IRefMetodePengadaanAttributes, MetodePengadaan>
    implements IRefMetodePengadaanAttributes
    {
        declare kode_metode_pengadaan: number;
        declare metode_pengadaan: string | null | undefined;
    }

MetodePengadaan.init (
    {
        kode_metode_pengadaan : {
            type : DataTypes.INTEGER(),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        metode_pengadaan : {
            type : DataTypes.STRING(),
            allowNull : false,
        }
    },
    {
        sequelize : db,
        schema : "public",
        tableName : "ref_metode_pengadaan",
        modelName : "MetodePengadaan",
        timestamps : false
    }
)



export default MetodePengadaan