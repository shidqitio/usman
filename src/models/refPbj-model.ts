import { DataTypes, Model, Optional } from "sequelize";
import db from "@config/database";

interface IRefPbjAttributes {
    kode_pbj : string, 
    pbj : string | null | undefined
}

export type PbjOutput = Required<IRefPbjAttributes>

export type PbjInput = Optional<
IRefPbjAttributes,
"kode_pbj"
>

class PBJ
    extends Model<IRefPbjAttributes, PbjInput>
    implements IRefPbjAttributes
    {
        declare kode_pbj: string;
        declare pbj : string | null | undefined;
    }

PBJ.init(
    {
        kode_pbj : {
            type : DataTypes.STRING(),
            allowNull : false,
            primaryKey : true,
        },
        pbj : {
            type : DataTypes.STRING(),
            allowNull : true
        }
    },
    {
        sequelize : db,
        schema : "public",
        tableName : "ref_pbj",
        modelName : "PBJ",
        timestamps : false
    }
)

export default PBJ