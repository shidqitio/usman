import { DataTypes, Model, Optional } from "sequelize";
import db from "@config/database";

export enum Status {
    Tampil = "1",
    Tidak_Tampil = "2"
}

interface IRefAplikasiAttributes {
    kode_aplikasi : string | any; 
    nama_aplikasi : string | null;
    keterangan : string | null | undefined; 
	status : string | null;
	images : string | null; 
	url : string | null; 
	url_token : string | null | undefined; 
	ucr : string | null | undefined; 
	uch : string | null | undefined; 
	udcr : Date | null; 
	udch : Date | null; 
}

export type RefAplikasiOutput = Required<IRefAplikasiAttributes>
export type RefAplikasiInput = Optional <
    IRefAplikasiAttributes,
    "kode_aplikasi" | 
	// "keterangan" |
	"udcr" | 
	"udch" | 
	"ucr" | 
	"uch" 
>;
export type RefAplikasiInputUpdate = Optional <
	IRefAplikasiAttributes, 
	"ucr" | 
	"kode_aplikasi"
>;

// export type RefAplikasiInsert = {
// 	kode_aplikasi : any,
// 	nama_aplikasi : string
// }

class RefAplikasi 
	extends Model<IRefAplikasiAttributes, RefAplikasiInput>
	implements IRefAplikasiAttributes
{
	declare kode_aplikasi : string | any; 
    declare nama_aplikasi : string | null;
    declare keterangan :  string | null | undefined; 
	declare status : string | null;
	declare images : string | null; 
	declare url : string | null; 
	declare url_token :  string | null | undefined; 
	declare ucr : string | null | undefined; 
	declare uch : string | null | undefined; 
	declare udcr : Date | null; 
	declare udch : Date | null; 
}

RefAplikasi.init(
	{
		kode_aplikasi : {
			type : DataTypes.STRING(),
			allowNull : false, 
			primaryKey : true
		},
		nama_aplikasi : {
			type : DataTypes.STRING(), 
			allowNull : true
		},
		keterangan : {
			type : DataTypes.STRING(), 
			allowNull : true
		},
		status : {
			type : DataTypes.STRING(), 
			allowNull : true
		},
		images : {
			type : DataTypes.STRING(), 
			allowNull : true
		},
		url : {
			type : DataTypes.STRING(), 
			allowNull : true
		},
		url_token : {
			type : DataTypes.STRING(), 
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
			type : DataTypes.DATE, 
			allowNull : true
		},
		udch : {
			type : DataTypes.DATE, 
			allowNull : true
		},
	}, 
	{
		sequelize : db, 
		schema : "public",
		tableName : "ref_aplikasi",
		modelName : "RefAplikasi",
		createdAt : "udcr",
		updatedAt : "udch"
	}
)

export default RefAplikasi