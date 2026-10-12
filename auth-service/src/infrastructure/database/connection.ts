import { Sequelize } from "sequelize";

// Biến bắt buộc: thiếu thì báo lỗi rõ ràng ngay lúc khởi động,
// thay vì lặng lẽ dùng giá trị mặc định rồi lỗi khó hiểu về sau.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Thiếu biến môi trường bắt buộc: ${name}`);
  }
  return value;
}

export const sequelize = new Sequelize(
  requireEnv("DB_NAME"),
  requireEnv("DB_USER"),
  requireEnv("DB_PASSWORD"),
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    logging: false,
  },
);
