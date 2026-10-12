import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { NotFoundError } from "../../shared/errors/AppError";

interface UpdateProductInput {
  productId: string;
  requesterId: string;
  name: string;
  description: string;
  price: number;
}

export class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(input: UpdateProductInput): Promise<void> {
    const product = await this.productRepository.findById(input.productId);
    if (!product) {
      throw new NotFoundError("Không tìm thấy sản phẩm");
    }

    product.assertOwnership(input.requesterId);
    product.updateInfo(input.name, input.description, input.price);

    await this.productRepository.update(product);
  }
}
