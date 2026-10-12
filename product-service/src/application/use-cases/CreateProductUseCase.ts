import { v4 as uuidv4 } from "uuid";
import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";
import { ValidationError } from "../../shared/errors/AppError";

interface CreateProductInput {
  sellerId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(input: CreateProductInput): Promise<{ id: string }> {
    if (!input.name || input.name.trim().length === 0) {
      throw new ValidationError("Tên sản phẩm không được để trống");
    }
    if (input.price < 0) {
      throw new ValidationError("Giá sản phẩm không hợp lệ");
    }
    if (input.stock < 0) {
      throw new ValidationError("Số lượng tồn kho không hợp lệ");
    }

    const product = new Product(
      uuidv4(),
      input.sellerId,
      input.name,
      input.description,
      input.price,
      input.stock,
    );

    await this.productRepository.save(product);
    return { id: product.id };
  }
}
