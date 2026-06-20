import app from "./app";
import { initializeDatabase } from "./config/db";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  // Initialize MySQL database connection and create tables if they don't exist
  await initializeDatabase();
  
  // Start listening to the specified port
  app.listen(PORT, () => {
    console.log(`[Server]: Backend Express berjalan di http://localhost:${PORT}`);
  });
}

startServer();
