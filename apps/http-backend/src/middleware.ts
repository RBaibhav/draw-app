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
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).send("Authorization header missing");
  }

  const decoded = jwt.verify(token as string, JWT_SECRET) as jwt.JwtPayload;
  req.userId = decoded.userId;
  next();
}
