import { Router } from "express";
import { auth } from "../middleware";
import { prisma } from "@repo/db";

export const shapesRouter = Router();

// Get all shapes for a room (ordered chronologically)
shapesRouter.get("/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);

  if (isNaN(roomId)) {
    res.status(400).json({ error: "Invalid roomId" });
    return;
  }

  try {
    const rows = await prisma.shape.findMany({
      where: { roomId },
      orderBy: { id: "asc" },
    });

    const shapes = rows.map((row) => {
      try {
        const data = JSON.parse(row.shapeData);
        return { id: row.id, ...data, type: row.type || data.type };
      } catch {
        return { id: row.id, type: row.type };
      }
    });

    res.json({ shapes });
  } catch (err) {
    console.error("Fetch shapes error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Clear all shapes for a room
shapesRouter.delete("/:roomId", auth, async (req, res) => {
  const roomId = Number(req.params.roomId);

  if (isNaN(roomId)) {
    res.status(400).json({ error: "Invalid roomId" });
    return;
  }

  try {
    await prisma.shape.deleteMany({ where: { roomId } });
    res.json({ message: "Canvas cleared successfully" });
  } catch (err) {
    console.error("Clear shapes error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
