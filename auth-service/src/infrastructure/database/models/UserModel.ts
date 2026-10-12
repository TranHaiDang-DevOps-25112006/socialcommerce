import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../connection";

interface UserAttributes {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  role: "buyer" | "seller" | "admin";
  isActive: boolean;
}

interface UserCreationAttributes extends Optional<
  UserAttributes,
  "id" | "isActive"
> {}

export class UserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public email!: string;
  public passwordHash!: string;
  public displayName!: string;
  public role!: "buyer" | "seller" | "admin";
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash",
    },
    displayName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "display_name",
    },
    role: {
      type: DataTypes.ENUM("buyer", "seller", "admin"),
      allowNull: false,
      defaultValue: "buyer",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
  },
  {
    sequelize,
    tableName: "users",
    indexes: [{ unique: true, fields: ["email"] }],
  },
);
