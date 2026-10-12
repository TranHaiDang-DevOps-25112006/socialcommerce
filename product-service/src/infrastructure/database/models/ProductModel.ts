import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../connection";

interface ProductAttributes {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> {}

export class ProductModel
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: string;
  public sellerId!: string;
  public name!: string;
  public description!: string;
  public price!: number;
  public stock!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProductModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sellerId: { type: DataTypes.UUID, allowNull: false, field: "seller_id" },
    name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    sequelize,
    tableName: "products",
    indexes: [{ fields: ["seller_id"] }],
  },
);
