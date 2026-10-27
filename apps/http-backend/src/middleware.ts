import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common-backend/config";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    res.status(401).json({ error: "Authorization header missing" });
    return;
  }

  // Support both "Bearer <token>" and raw "<token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
