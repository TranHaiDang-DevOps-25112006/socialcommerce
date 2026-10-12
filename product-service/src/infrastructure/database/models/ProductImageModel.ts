import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../connection";
import { ProductModel } from "./ProductModel";

interface ProductImageAttributes {
  id: string;
  productId: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductImageCreationAttributes extends Optional<
  ProductImageAttributes,
  "id"
> {}

export class ProductImageModel
  extends Model<ProductImageAttributes, ProductImageCreationAttributes>
  implements ProductImageAttributes
{
  public id!: string;
  public productId!: string;
  public imageUrl!: string;
  public isPrimary!: boolean;
  public sortOrder!: number;
}

ProductImageModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: { type: DataTypes.UUID, allowNull: false, field: "product_id" },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: "image_url",
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_primary",
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "sort_order",
    },
  },
  { sequelize, tableName: "product_images", timestamps: false },
);

ProductModel.hasMany(ProductImageModel, {
  foreignKey: "productId",
  as: "images",
});
ProductImageModel.belongsTo(ProductModel, { foreignKey: "productId" });
