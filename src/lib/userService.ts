import { executeQuery } from "./database";
import { User } from "@/types/auth";

class UserService {
  async getUserByPhone(phone: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE phone = ?";
    const result = await executeQuery<
      Array<{
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        date_of_birth: string;
      }>
    >(query, [phone]);
    const user = result?.[0];

    if (!user) return null;

    // Combine first_name and last_name into name field
    const fullName = [user.first_name, user.last_name]
      .filter(Boolean)
      .join(" ");

    return {
      id: user.id,
      name: fullName || "User",
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.date_of_birth,
      hasMembership: false, // This will be updated by other functions
    } as User;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE email = ?";
    const result = await executeQuery<
      Array<{
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        date_of_birth: string;
      }>
    >(query, [email]);
    const user = result?.[0];

    if (!user) return null;

    // Combine first_name and last_name into name field
    const fullName = [user.first_name, user.last_name]
      .filter(Boolean)
      .join(" ");

    return {
      id: user.id,
      name: fullName || "User",
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.date_of_birth,
      hasMembership: false, // This will be updated by other functions
    } as User;
  }

  async createUser(
    phone: string,
    email?: string,
    firstName?: string,
    lastName?: string
  ): Promise<User> {
    const query = `
      INSERT INTO users (phone, email, first_name, last_name) 
      VALUES (?, ?, ?, ?)
    `;

    const result = await executeQuery(query, [
      phone,
      email,
      firstName,
      lastName,
    ]);
    const userId = (result as { insertId: number }).insertId;

    return this.getUserById(userId) as Promise<User>;
  }

  async createUserWithDetails(userData: {
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
  }): Promise<User> {
    const [firstName, ...lastNameParts] = userData.name.split(" ");
    const lastName = lastNameParts.join(" ") || "";

    const query = `
      INSERT INTO users (phone, email, first_name, last_name, date_of_birth, gender) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await executeQuery(query, [
      userData.phone,
      userData.email,
      firstName,
      lastName,
      userData.dateOfBirth,
      userData.gender,
    ]);
    const userId = (result as { insertId: number }).insertId;

    return this.getUserById(userId) as Promise<User>;
  }

  async getUserById(id: number): Promise<User | null> {
    const query = "SELECT * FROM users WHERE id = ?";
    const result = await executeQuery<
      Array<{
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        date_of_birth: string;
      }>
    >(query, [id]);
    const user = result?.[0];

    if (!user) return null;

    // Combine first_name and last_name into name field
    const fullName = [user.first_name, user.last_name]
      .filter(Boolean)
      .join(" ");

    return {
      id: user.id,
      name: fullName || "User",
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.date_of_birth,
      hasMembership: false, // This will be updated by other functions
    } as User;
  }

  async updatePhoneVerification(userId: number): Promise<void> {
    const query = `
      UPDATE users 
      SET phone_verified = TRUE, phone_verified_at = NOW() 
      WHERE id = ?
    `;

    await executeQuery(query, [userId]);
  }

  async updateLastLogin(userId: number): Promise<void> {
    const query = `
      UPDATE users 
      SET last_login_at = NOW() 
      WHERE id = ?
    `;

    await executeQuery(query, [userId]);
  }

  async storeUserSession(
    userId: number,
    tokenHash: string,
    expiresAt: Date
  ): Promise<void> {
    const query = `
      INSERT INTO user_sessions (user_id, token_hash, expires_at) 
      VALUES (?, ?, ?)
    `;

    await executeQuery(query, [userId, tokenHash, expiresAt]);
  }

  async validateUserSession(
    userId: number,
    tokenHash: string
  ): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count 
      FROM user_sessions 
      WHERE user_id = ? AND token_hash = ? AND expires_at > NOW()
    `;

    const result = await executeQuery<{ count: number }[]>(query, [
      userId,
      tokenHash,
    ]);
    return (result?.[0]?.count || 0) > 0;
  }

  async logoutUser(userId: number, tokenHash: string): Promise<void> {
    const query = `
      DELETE FROM user_sessions 
      WHERE user_id = ? AND token_hash = ?
    `;

    await executeQuery(query, [userId, tokenHash]);
  }

  async updateUserStatus(userId: number, status: number): Promise<void> {
    const query = `
      UPDATE users 
      SET status = ? 
      WHERE id = ?
    `;

    await executeQuery(query, [status, userId]);
  }
}

export const userService = new UserService();
