import express from "express";
import jwt from "jsonwebtoken";
import { auth } from "./middleware";
import { JWT_SECRET } from "@repo/common-backend/config";
import { CreateRoomSchema, CreateUserSchema, SignInSchema } from "@repo/common/types";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.post("/signup", (req, res) => {
  const data = CreateUserSchema.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({ error: data.error});
    return;
  }

  res.send("signup route");
});

app.post("/signin", (req, res) => {
  const data = SignInSchema.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({ error: data.error});
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
    res.status(400).json({ error: data.error});
    return;
  }
  res.send("create room route");
});

app.listen(PORT, () => {
  console.log(`listeing to port ${PORT}`);
});
