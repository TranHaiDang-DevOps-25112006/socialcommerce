import "dotenv/config";
import express from "express";
import { sequelize } from "./infrastructure/database/connection";
import authRoutes from "./infrastructure/http/routes/authRoutes";
import { errorHandler } from "./infrastructure/http/middlewares/errorHandler";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.get("/ready", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: "ready", database: "connected" });
  } catch (error) {
    res.status(503).json({ status: "not ready", database: "disconnected" });
  }
});

app.use("/api/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Kết nối MySQL thành công.");

    app.listen(PORT, () => {
      console.log(`Auth Service đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Không khởi động được service:", error);
    process.exit(1);
  }
}

start();
