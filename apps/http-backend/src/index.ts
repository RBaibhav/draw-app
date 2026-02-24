import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import { auth } from "./middleware";
import { JWT_SECRET } from "@repo/common-backend/config";
import cors from "cors";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SignInSchema,
} from "@repo/common/types";
import { prisma } from "@repo/db";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors())

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
        // hash the password
        password: parsedData.data.password,
        name: parsedData.data.name,
      },
    });
    res.status(201).json({ user });
  } catch (error) {
    res.status(411).json({ message: "User already exist" });
  }
});

app.post("/signin", async (req, res) => {
  const parsedData = SignInSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error });
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: parsedData.data.username,
        password: parsedData.data.password, // compare hashed password
      },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials or user not found" });
      return;
    }

    const userId = user.id;
    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET,
    );

    res.send({ token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

app.post("/room", auth, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error });
    return;
  }

  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const room = await prisma.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });

    res.send({
      room: room.id,
      admin: room.adminId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "room already exists" });
    return;
  }
});

app.get("/chats/:roomId", async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);

    const messages = await prisma.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });

    res.send({
      messages: messages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});

app.get("/room/:slug", auth, async (req, res) => {
  const slug = req.params.slug;

  if (!slug) {
    res.status(400).json({ error: "Slug parameter is required" });
    return;
  }

  if (typeof slug !== "string") {
    res.status(400).json({ error: "Slug must be a string" });
    return;
  }

  const room = await prisma.room.findFirst({
    where: {
      slug: slug,
    },
  });

  res.send({
    room: room,
  });
});

app.listen(PORT, () => {
  console.log(`listeing to port ${PORT}`);
});
