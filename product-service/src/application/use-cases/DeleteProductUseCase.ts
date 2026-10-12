import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { NotFoundError } from "../../shared/errors/AppError";

export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(productId: string, requesterId: string): Promise<void> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError("Không tìm thấy sản phẩm");
    }

    product.assertOwnership(requesterId);
    await this.productRepository.delete(productId);
  }
}
