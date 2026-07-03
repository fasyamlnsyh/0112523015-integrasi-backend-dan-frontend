import express from "express";
import cors from "cors";
import path from "path";
import mahasiswaRoutes from "./routes/mahasiswa.route.v2";
import produkRoutes from "./routes/produk.route";
import prodiRoutes from "./routes/prodi.route";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Serve uploaded files secara statis
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Backend Express Modul 3 berjalan" });
});

app.use("/api/mahasiswa", mahasiswaRoutes);
app.use("/api/produk", produkRoutes);
app.use("/api/prodi", prodiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;
