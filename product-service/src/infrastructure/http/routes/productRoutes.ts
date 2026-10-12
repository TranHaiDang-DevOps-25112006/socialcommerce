import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import {
  authenticate,
  AuthenticatedRequest,
} from "../middlewares/authenticate";
import { requireRole } from "../middlewares/requireRole";
import { SequelizeProductRepository } from "../../repositories/SequelizeProductRepository";
import { CreateProductUseCase } from "../../../application/use-cases/CreateProductUseCase";
import { ListProductsUseCase } from "../../../application/use-cases/ListProductsUseCase";
import { GetProductByIdUseCase } from "../../../application/use-cases/GetProductByIdUseCase";
import { UpdateProductUseCase } from "../../../application/use-cases/UpdateProductUseCase";
import { DeleteProductUseCase } from "../../../application/use-cases/DeleteProductUseCase";

const router = Router();

const productRepository = new SequelizeProductRepository();
const createProductUseCase = new CreateProductUseCase(productRepository);
const listProductsUseCase = new ListProductsUseCase(productRepository);
const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository);
const deleteProductUseCase = new DeleteProductUseCase(productRepository);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    const sellerId = req.query.sellerId as string | undefined;
    const products = await listProductsUseCase.execute({
      sellerId,
      page,
      pageSize,
    });
    res.status(200).json({ success: true, data: products });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await getProductByIdUseCase.execute(
      req.params.id as string,
    );
    res.status(200).json({ success: true, data: product });
  }),
);

router.post(
  "/",
  authenticate,
  requireRole("seller", "admin"),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { name, description, price, stock } = req.body;
    const result = await createProductUseCase.execute({
      sellerId: req.userId as string,
      name,
      description,
      price,
      stock,
    });
    res.status(201).json({ success: true, data: result });
  }),
);

router.put(
  "/:id",
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { name, description, price } = req.body;
    await updateProductUseCase.execute({
      productId: req.params.id as string,
      requesterId: req.userId as string,
      name,
      description,
      price,
    });
    res.status(200).json({ success: true, message: "Cập nhật thành công" });
  }),
);

router.delete(
  "/:id",
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    await deleteProductUseCase.execute(
      req.params.id as string,
      req.userId as string,
    );
    res.status(200).json({ success: true, message: "Xóa thành công" });
  }),
);

export default router;
