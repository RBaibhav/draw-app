import { Router } from "express";
import jwt from "jsonwebtoken";
import { CreateUserSchema, SignInSchema } from "@repo/common/types";
import { JWT_SECRET } from "@repo/common-backend/config";
import { prisma } from "@repo/db";

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const parsed = CreateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  try {
    const user = await prisma.user.create({
      data: {
        email: parsed.data.username,
        password: parsed.data.password,
        name: parsed.data.name,
      },
    });
    res.status(201).json({ user });
  } catch {
    res.status(411).json({ message: "User already exists" });
  }
});

authRouter.post("/signin", async (req, res) => {
  const parsed = SignInSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: parsed.data.username,
        password: parsed.data.password,
      },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token, userId: user.id, name: user.name, email: user.email });
  } catch (err) {
    console.error("Sign-in error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
