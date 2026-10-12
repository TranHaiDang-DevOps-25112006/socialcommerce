export type UserRole = "buyer" | "seller" | "admin";

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly displayName: string,
    public readonly role: UserRole,
    public readonly isActive: boolean,
  ) {}

  public canLogin(): boolean {
    return this.isActive;
  }
}
