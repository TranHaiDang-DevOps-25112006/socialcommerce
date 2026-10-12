import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";
import { ProductModel } from "../database/models/ProductModel";

export class SequelizeProductRepository implements IProductRepository {
  async findById(id: string): Promise<Product | null> {
    const record = await ProductModel.findByPk(id);
    if (!record) return null;
    return this.toDomain(record);
  }

  async findAll(filters: {
    sellerId?: string;
    limit: number;
    offset: number;
  }): Promise<Product[]> {
    const where = filters.sellerId ? { sellerId: filters.sellerId } : {};
    const records = await ProductModel.findAll({
      where,
      limit: filters.limit,
      offset: filters.offset,
      order: [["createdAt", "DESC"]],
    });
    return records.map((r) => this.toDomain(r));
  }

  async save(product: Product): Promise<void> {
    await ProductModel.create({
      id: product.id,
      sellerId: product.sellerId,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
  }

  async update(product: Product): Promise<void> {
    await ProductModel.update(
      {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
      },
      { where: { id: product.id } },
    );
  }

  async delete(id: string): Promise<void> {
    await ProductModel.destroy({ where: { id } });
  }

  private toDomain(record: ProductModel): Product {
    return new Product(
      record.id,
      record.sellerId,
      record.name,
      record.description,
      Number(record.price),
      record.stock,
      record.createdAt,
    );
  }
}
