import express from "express";
import cors from "cors";
import routes from "./routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();

cors({
  origin: process.env.CLIENT_SIDE_URL,
  credentials: true,
});

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(cors());

async function createAdmin() {
  await auth.api.createUser({
    body: {
      name: "Hasan",
      email: "hasan@gmail.com",
      password: "123456",
      role: "admin",
    },
  });
}

// createAdmin();

app.use("/api/v1", routes);

export default app;
