import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common-backend/config";

/** Verifies a JWT and returns the userId, or null if invalid. */
export function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    return decoded?.userId ?? null;
  } catch {
    return null;
  }
}

/** Extracts the token from a WebSocket upgrade request URL query string. */
export function extractToken(requestUrl: string | undefined): string | null {
  if (!requestUrl) return null;
  return new URLSearchParams(requestUrl.split("?")[1]).get("token");
}
