export class ProductImage {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly imageUrl: string,
    public isPrimary: boolean,
    public sortOrder: number,
  ) {}
}
