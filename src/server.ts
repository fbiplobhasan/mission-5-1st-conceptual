import dotenv from "dotenv";
import app from "./app";
import { prisma } from "./lib/prisma";

dotenv.config();
const PORT = process.env.PORT || 3000;

async function server() {
  try {
    await prisma.$connect();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

server();
