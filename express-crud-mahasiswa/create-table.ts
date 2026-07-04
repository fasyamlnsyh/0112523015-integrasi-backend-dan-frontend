import db from "./src/config/db";

const createTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'operator', 'viewer') NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

async function run() {
  try {
    console.log("Creating users table if not exists...");
    await db.query(createTableQuery);
    console.log("Table 'users' ensured to exist.");
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    process.exit();
  }
}

run();
