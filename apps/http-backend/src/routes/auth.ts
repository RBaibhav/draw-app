import { Router } from "express";
import jwt from "jsonwebtoken";
import { CreateUserSchema, SignInSchema } from "@repo/common/types";
import { JWT_SECRET } from "@repo/common-backend/config";
import { prisma } from "@repo/db";

export const authRouter: Router = Router();

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

// ── Guest access ──────────────────────────────────────────────────────────────
// Issues a short-lived JWT for unauthenticated visitors arriving via an invite
// link. Automatically creates a guest user record in the DB so foreign keys for
// shapes, canvas persistence, and room memberships work without errors.
authRouter.post("/auth/guest", async (_req, res) => {
  const guestId = `guest_${crypto.randomUUID()}`;
  try {
    await prisma.user.create({
      data: {
        id: guestId,
        email: `${guestId}@guest.local`,
        name: "Guest",
        password: "",
      },
    });
  } catch (err) {
    console.warn("Could not persist guest user to DB (falling back to ephemeral token):", err);
  }

  const token = jwt.sign({ userId: guestId, guest: true }, JWT_SECRET, {
    expiresIn: "8h",
  });
  res.json({ token, userId: guestId, guest: true });
});

