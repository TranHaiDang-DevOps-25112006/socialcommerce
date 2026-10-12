import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { ConflictError, ValidationError } from "../../shared/errors/AppError";

interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
}

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: RegisterInput): Promise<{ id: string; email: string }> {
    this.validate(input);

    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError("Email đã được đăng ký");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = new User(
      uuidv4(),
      input.email,
      passwordHash,
      input.displayName,
      "buyer",
      true,
    );

    await this.userRepository.save(user);

    return { id: user.id, email: user.email };
  }

  private validate(input: RegisterInput): void {
    if (!input.email || !input.email.includes("@")) {
      throw new ValidationError("Email không hợp lệ");
    }
    if (!input.password || input.password.length < 6) {
      throw new ValidationError("Mật khẩu phải có ít nhất 6 ký tự");
    }
    if (!input.displayName || input.displayName.trim().length === 0) {
      throw new ValidationError("Tên hiển thị không được để trống");
    }
  }
}
