import { DataTypes, Model } from "sequelize";
import db from "@config/database";

export enum StatusUserActive {
  NonActive = "0",
  Active = "1",
}

interface IUserAksesAttributes {
  nip: string;
  ip: string;
  nama: string;
  status: StatusUserActive;
}

export type UserOutput = Required<IUserAksesAttributes>;

class UserAkses
  extends Model<IUserAksesAttributes>
  implements IUserAksesAttributes
{
  public nip!: string;
  public ip!: string;
  public nama!: string;
  public status!: StatusUserActive;
}

UserAkses.init(
  {
    nip: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("0", "1"),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "ref_user_akses",
    modelName: "UserAkses",
    underscored: true,
    timestamps: false,
  }
);

export default UserAkses;
