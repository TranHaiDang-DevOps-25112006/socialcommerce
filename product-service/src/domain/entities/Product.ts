import { ForbiddenError, ValidationError } from "../../shared/errors/AppError";

export class Product {
  constructor(
    public readonly id: string,
    public readonly sellerId: string,
    public name: string,
    public description: string,
    public price: number,
    public stock: number,
    public readonly createdAt: Date = new Date(),
  ) {}
  public assertOwnership(requesterId: string): void {
    if (this.sellerId !== requesterId) {
      throw new ForbiddenError("Bạn không có quyền chỉnh sửa sản phẩm này");
    }
  }

  public updateInfo(name: string, description: string, price: number): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationError("Tên sản phẩm không được để trống");
    }
    if (price < 0) {
      throw new ValidationError("Giá sản phẩm không hợp lệ");
    }
    this.name = name;
    this.description = description;
    this.price = price;
  }

  public decreaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new ValidationError("Số lượng phải lớn hơn 0");
    }
    if (quantity > this.stock) {
      throw new ValidationError("Số lượng tồn kho không đủ");
    }
    this.stock -= quantity;
  }
}
