import { CreateOptions, DataTypes, Model, Optional } from "sequelize";
import db from "@config/database";

export enum StatusUserActive {
  NonActive = "0",
  Active = "1",
}

interface IUserAttributes {
  id: number;
  name: string;
  email: string;
  status: StatusUserActive;
  address: string;
  created_at: string;
  updated_at: string;
}

export type UserOutput = Required<IUserAttributes>;
export type UserInput = Optional<
  IUserAttributes,
  "id" | "created_at" | "updated_at"
>;

class Users
  extends Model<IUserAttributes, UserInput>
  implements IUserAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public status!: StatusUserActive;
  public address!: string;
  public created_at!: string;
  public updated_at!: string;
}

Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("0", "1"),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE(),
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE(),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "users",
    modelName: "Users",
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Users;
