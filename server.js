import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import reservationRoutes from "./routes/reservations.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// 1. Ruta principal: Enviamos el HTML que tienes en la raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "state-diagram.html"));
});

// 2. Rutas de la API
app.use("/reservations", reservationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;