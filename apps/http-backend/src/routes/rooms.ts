import { Router } from "express";
import { CreateRoomSchema, JoinRoomSchema } from "@repo/common/types";
import { auth } from "../middleware";
import { prisma } from "@repo/db";

export const roomsRouter = Router();

// Create a room
roomsRouter.post("/", auth, async (req, res) => {
  const parsed = CreateRoomSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  const userId = req.userId!;

  try {
    const room = await prisma.room.create({
      data: { slug: parsed.data.name, adminId: userId },
    });

    await prisma.roomMember.create({
      data: { roomId: room.id, userId, role: "admin" },
    });

    res.status(201).json({ room: room.id, slug: room.slug, admin: room.adminId });
  } catch (err) {
    console.error("Create room error:", err);
    res.status(500).json({ message: "Room already exists" });
  }
});

// Join a room by slug or numeric ID
roomsRouter.post("/join", auth, async (req, res) => {
  const parsed = JoinRoomSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  const userId = req.userId!;
  const { slug, roomId } = parsed.data;

  if (!slug && roomId === undefined) {
    res.status(400).json({ error: "Either slug or roomId is required" });
    return;
  }

  try {
    const conditions = [
      slug ? { slug } : null,
      roomId !== undefined && !isNaN(Number(roomId)) ? { id: Number(roomId) } : null,
    ].filter(Boolean) as object[];

    const room = await prisma.room.findFirst({
      where: { OR: conditions },
      include: { admin: { select: { id: true, name: true, email: true } } },
    });

    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    await prisma.roomMember.upsert({
      where: { roomId_userId: { roomId: room.id, userId } },
      update: {},
      create: { roomId: room.id, userId, role: room.adminId === userId ? "admin" : "member" },
    });

    res.json({
      message: "Successfully joined room",
      room: { id: room.id, slug: room.slug, adminId: room.adminId, admin: room.admin },
    });
  } catch (err) {
    console.error("Join room error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// List rooms the user belongs to
roomsRouter.get("/", auth, async (req, res) => {
  const userId = req.userId!;

  try {
    const rooms = await prisma.room.findMany({
      where: { OR: [{ adminId: userId }, { members: { some: { userId } } }] },
      include: {
        admin: { select: { id: true, name: true, email: true } },
        _count: { select: { members: true, shapes: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ rooms });
  } catch (err) {
    console.error("Fetch rooms error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get room details by slug
roomsRouter.get("/:slug", auth, async (req, res) => {
  const { slug } = req.params;

  try {
    const room = await prisma.room.findFirst({
      where: { slug },
      include: {
        admin: { select: { id: true, name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    });

    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    res.json({ room });
  } catch (err) {
    console.error("Fetch room by slug error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get room details by numeric ID
roomsRouter.get("/id/:roomId", auth, async (req, res) => {
  const roomId = Number(req.params.roomId);

  if (isNaN(roomId)) {
    res.status(400).json({ error: "Invalid roomId" });
    return;
  }

  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        admin: { select: { id: true, name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    });

    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    res.json({ room });
  } catch (err) {
    console.error("Fetch room by id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
