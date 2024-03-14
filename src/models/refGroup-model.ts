import {DataTypes, Model, Optional} from "sequelize"
import db from "@config/database"

// interface IRefGroupAttributes {
//     "kode_group" CHAR(1) NOT NULL,
// 	"kode_level" CHAR(1) NOT NULL,
// 	"nama_group" VARCHAR(255) NULL DEFAULT NULL::character varying,
// 	"kode_aplikasi" CHAR(1) NOT NULL,
// 	"ucr" VARCHAR(100) NULL DEFAULT NULL::character varying,
// 	"uch" VARCHAR(100) NULL DEFAULT NULL::character varying,
// 	"udcr" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
// 	"udch" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
// }