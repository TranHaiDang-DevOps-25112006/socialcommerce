import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { RegisterUserUseCase } from "../../../application/use-cases/RegisterUserUseCase";
import { LoginUserUseCase } from "../../../application/use-cases/LoginUserUseCase";
import { SequelizeUserRepository } from "../../repositories/SequelizeUserRepository";

const router = Router();

const userRepository = new SequelizeUserRepository();
const registerUseCase = new RegisterUserUseCase(userRepository);
const loginUseCase = new LoginUserUseCase(userRepository);

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { email, password, displayName } = req.body;
    const result = await registerUseCase.execute({
      email,
      password,
      displayName,
    });
    res.status(201).json({ success: true, data: result });
  }),
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await loginUseCase.execute({ email, password });
    res.status(200).json({ success: true, data: result });
  }),
);

import {
  authenticate,
  AuthenticatedRequest,
} from "../middlewares/authenticate";

router.get(
  "/me",
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    res.status(200).json({
      success: true,
      data: { userId: req.userId, role: req.userRole },
    });
  }),
);
export default router;
