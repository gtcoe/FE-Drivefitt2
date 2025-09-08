import { NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { RowDataPacket } from "mysql2";

// Define error interface
interface DatabaseError extends Error {
  code?: string;
  errno?: number;
  sqlMessage?: string;
  sqlState?: string;
}

export async function GET() {
  try {
    const connection = await getConnection();

    try {
      // Test the connection
      const [result] = await connection.execute<RowDataPacket[]>(
        "SELECT 1 as test"
      );

      return NextResponse.json({
        success: true,
        message: "Database connection successful",
        config: {
          host: process.env.DB_HOST || "localhost",
          user: process.env.DB_USER || "root",
          database: process.env.DB_NAME || "drivefitt",
          port: parseInt(process.env.DB_PORT || "3306"),
        },
        result,
      });
    } catch (error) {
      const dbError = error as DatabaseError;
      return NextResponse.json(
        {
          success: false,
          message: "Database connection failed",
          error: {
            code: dbError.code,
            message: dbError.message,
            errno: dbError.errno,
          },
          config: {
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "root",
            database: process.env.DB_NAME || "drivefitt",
            port: parseInt(process.env.DB_PORT || "3306"),
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    const dbError = error as DatabaseError;
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create database connection",
        error: {
          code: dbError.code,
          message: dbError.message,
          errno: dbError.errno,
        },
        config: {
          host: process.env.DB_HOST || "localhost",
          user: process.env.DB_USER || "root",
          database: process.env.DB_NAME || "drivefitt",
          port: parseInt(process.env.DB_PORT || "3306"),
        },
      },
      { status: 500 }
    );
  }
}
