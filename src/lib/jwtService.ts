import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

interface JWTPayload {
  user_id: number;
  phone: string;
  type: "user";
}

interface AdminJWTPayload {
  admin_id: number;
  username: string;
  email: string;
  name: string;
  type: "admin";
}

type TokenPayload = JWTPayload | AdminJWTPayload;

class JWTService {
  private readonly JWT_SECRET = process.env.JWT_SECRET!;
  private readonly TOKEN_EXPIRY = "7d";
  private readonly ADMIN_TOKEN_EXPIRY = "24h";

  generateToken(payload: Omit<JWTPayload, "type">): string {
    return jwt.sign({ ...payload, type: "user" as const }, this.JWT_SECRET, {
      expiresIn: this.TOKEN_EXPIRY,
    });
  }

  generateAdminToken(payload: Omit<AdminJWTPayload, "type">): string {
    return jwt.sign({ ...payload, type: "admin" as const }, this.JWT_SECRET, {
      expiresIn: this.ADMIN_TOKEN_EXPIRY,
    });
  }

  verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload;
      if (decoded.type !== "user") return null;
      return decoded;
    } catch (error) {
      console.error("JWT verification error:", error);
      return null;
    }
  }

  verifyAdminToken(token: string): AdminJWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as AdminJWTPayload;
      if (decoded.type !== "admin") return null;
      return decoded;
    } catch (error) {
      console.error("Admin JWT verification error:", error);
      return null;
    }
  }

  verifyAnyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      console.error("Token verification error:", error);
      return null;
    }
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  hashToken(token: string): string {
    return bcrypt.hashSync(token, 10);
  }

  compareToken(token: string, hash: string): boolean {
    return bcrypt.compareSync(token, hash);
  }
}

export const jwtService = new JWTService();
