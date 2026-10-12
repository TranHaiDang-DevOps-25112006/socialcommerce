import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";

interface ListProductsInput {
  sellerId?: string;
  page: number;
  pageSize: number;
}

export class ListProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(input: ListProductsInput): Promise<Product[]> {
    const offset = (input.page - 1) * input.pageSize;
    return this.productRepository.findAll({
      sellerId: input.sellerId,
      limit: input.pageSize,
      offset,
    });
  }
}
