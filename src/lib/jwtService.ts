import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

interface JWTPayload {
  user_id: number;
  phone: string;
  type: "user";
}

class JWTService {
  private readonly JWT_SECRET = process.env.JWT_SECRET!;
  private readonly TOKEN_EXPIRY = "7d";

  generateToken(payload: Omit<JWTPayload, "type">): string {
    return jwt.sign({ ...payload, type: "user" as const }, this.JWT_SECRET, {
      expiresIn: this.TOKEN_EXPIRY,
    });
  }

  verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error("JWT verification error:", error);
      return null;
    }
  }

  hashToken(token: string): string {
    return bcrypt.hashSync(token, 10);
  }

  compareToken(token: string, hash: string): boolean {
    return bcrypt.compareSync(token, hash);
  }
}

export const jwtService = new JWTService();
