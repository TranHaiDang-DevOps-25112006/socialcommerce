import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserModel } from "../database/models/UserModel";

export class SequelizeUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const record = await UserModel.findOne({ where: { email } });
    if (!record) return null;

    return new User(
      record.id,
      record.email,
      record.passwordHash,
      record.displayName,
      record.role,
      record.isActive,
    );
  }

  async save(user: User): Promise<void> {
    await UserModel.create({
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      displayName: user.displayName,
      role: user.role,
      isActive: user.isActive,
    });
  }
}
