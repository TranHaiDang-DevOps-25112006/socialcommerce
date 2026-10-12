import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import {
  UnauthorizedError,
  ValidationError,
} from "../../shared/errors/AppError";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginOutput {
  token: string;
  user: { id: string; email: string; displayName: string; role: string };
}

export class LoginUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    if (!input.email || !input.password) {
      throw new ValidationError("Thiếu email hoặc mật khẩu");
    }

    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedError("Sai email hoặc mật khẩu");
    }

    if (!user.canLogin()) {
      throw new UnauthorizedError("Tài khoản đã bị khóa");
    }

    const isPasswordValid = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("Sai email hoặc mật khẩu");
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    };
  }
}
