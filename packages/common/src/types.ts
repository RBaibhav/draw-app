import { z } from "zod";

export const CreateUserSchema = z.object({
  username: z.string().min(3).max(40),
  password: z.string().min(6).max(100),
  name: z.string().min(1).max(100),
});

export const SignInSchema = z.object({
  username: z.string().min(3).max(40),
  password: z.string().min(6).max(100),
});

export const CreateRoomSchema = z.object({
  name: z.string().min(3).max(50),
});

export const JoinRoomSchema = z.object({
  slug: z.string().min(1).max(100).optional(),
  roomId: z.union([z.number(), z.string()]).optional(),
});

export const PointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const ShapeSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("rect"),
    startX: z.number(),
    startY: z.number(),
    width: z.number(),
    height: z.number(),
  }),
  z.object({
    type: z.literal("circle"),
    startX: z.number(),
    startY: z.number(),
    x: z.number(),
    y: z.number(),
    radius: z.number(),
  }),
  z.object({
    type: z.literal("line"),
    startX: z.number(),
    startY: z.number(),
    x: z.number(),
    y: z.number(),
    thickness: z.number().optional(),
  }),
  z.object({
    type: z.literal("pencil"),
    stroke: z.array(PointSchema),
    thickness: z.number().optional(),
  }),
  z.object({
    type: z.literal("eraser"),
    stroke: z.array(PointSchema),
    size: z.number().optional(),
  }),
]);

export type ShapeType = z.infer<typeof ShapeSchema>;
export type PointType = z.infer<typeof PointSchema>;