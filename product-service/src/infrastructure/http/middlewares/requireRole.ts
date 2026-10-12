import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authenticate";
import { ForbiddenError } from "../../../shared/errors/AppError";

export function requireRole(...allowedRoles: string[]) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      throw new ForbiddenError(
        "Vai trò của bạn không được phép thực hiện hành động này",
      );
    }
    next();
  };
}
