import "dotenv/config";
import express from "express";
import { sequelize } from "./infrastructure/database/connection";
import "./infrastructure/database/models/ProductModel";
import "./infrastructure/database/models/ProductImageModel";
import productRoutes from "./infrastructure/http/routes/productRoutes";
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

app.use("/api/products", productRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3002;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Product Service: kết nối MySQL thành công.");
    app.listen(PORT, () => {
      console.log(`Product Service đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Không khởi động được Product Service:", error);
    process.exit(1);
  }
}

start();
