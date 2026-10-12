import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../shared/errors/AppError";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      errorCode: err.errorCode,
      message: err.message,
    });
    return;
  }

  console.error("Lỗi không xác định:", err);
  res.status(500).json({
    success: false,
    errorCode: "INTERNAL_ERROR",
    message: "Đã có lỗi xảy ra, vui lòng thử lại sau",
  });
}
