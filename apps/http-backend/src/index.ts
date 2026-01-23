import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import { auth } from "./middleware";
import { JWT_SECRET } from "@repo/common-backend/config";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SignInSchema,
} from "@repo/common/types";
import { prisma } from "@repo/db";


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error });
    return;
  }

  try {
    const user = await prisma.user.create({
      data: {
        email: parsedData.data.username,
        password: parsedData.data.password,
        name: parsedData.data.name,
      },
    });

    res.status(201).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/signin", (req, res) => {
  const data = SignInSchema.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({ error: data.error });
    return;
  }
  const userId = "sfudg";
  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({ token });
});

app.post("/room", auth, (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({ error: data.error });
    return;
  }
  res.send("create room route");
});

app.listen(PORT, () => {
  console.log(`listeing to port ${PORT}`);
});
