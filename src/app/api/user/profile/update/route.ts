import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { jwtService } from "@/lib/jwtService";
import { ProfileUpdateRequest, ProfileUpdateResponse } from "@/types/auth";

export async function PUT(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json<ProfileUpdateResponse>(
        {
          success: false,
          message: "Authorization token required.",
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwtService.verifyToken(token);

    if (!decoded) {
      return NextResponse.json<ProfileUpdateResponse>(
        {
          success: false,
          message: "Invalid or expired token.",
        },
        { status: 401 }
      );
    }

    const body: ProfileUpdateRequest = await request.json();
    const { field, value } = body;

    // Validate input
    if (!field || !value) {
      return NextResponse.json<ProfileUpdateResponse>(
        {
          success: false,
          message: "Field and value are required.",
        },
        { status: 400 }
      );
    }

    // Validate field type
    if (!["name", "email", "dateOfBirth"].includes(field)) {
      return NextResponse.json<ProfileUpdateResponse>(
        {
          success: false,
          message: "Invalid field type.",
        },
        { status: 400 }
      );
    }

    // Validate field values
    const validation = validateField(field, value);
    if (!validation.isValid) {
      return NextResponse.json<ProfileUpdateResponse>(
        {
          success: false,
          message: validation.message,
        },
        { status: 400 }
      );
    }

    // Check if email is already taken (for email updates)
    if (field === "email") {
      const emailCheckQuery =
        "SELECT id FROM users WHERE email = ? AND id != ?";
      const emailResult = await executeQuery<Array<{ id: number }>>(
        emailCheckQuery,
        [value, decoded.user_id]
      );
      if (emailResult && emailResult.length > 0) {
        return NextResponse.json<ProfileUpdateResponse>(
          {
            success: false,
            message: "Email address is already in use.",
          },
          { status: 400 }
        );
      }
    }

    // Update the field in database
    let updateQuery: string;
    let updateValue: (string | number)[];

    switch (field) {
      case "name":
        const [firstName, ...lastNameParts] = value.split(" ");
        const lastName = lastNameParts.join(" ") || "";
        updateQuery =
          "UPDATE users SET first_name = ?, last_name = ? WHERE id = ?";
        updateValue = [firstName, lastName, decoded.user_id];
        break;
      case "email":
        updateQuery = "UPDATE users SET email = ? WHERE id = ?";
        updateValue = [value, decoded.user_id];
        break;
      case "dateOfBirth":
        updateQuery = "UPDATE users SET date_of_birth = ? WHERE id = ?";
        updateValue = [value, decoded.user_id];
        break;
      default:
        return NextResponse.json<ProfileUpdateResponse>(
          {
            success: false,
            message: "Invalid field type.",
          },
          { status: 400 }
        );
    }

    await executeQuery(updateQuery, updateValue);

    // Get updated user data
    const userQuery =
      "SELECT id, first_name, last_name, email, phone, date_of_birth FROM users WHERE id = ?";
    const userResult = await executeQuery<
      Array<{
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        date_of_birth: string;
      }>
    >(userQuery, [decoded.user_id]);
    const user = userResult?.[0];

    if (!user) {
      return NextResponse.json<ProfileUpdateResponse>(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    const fullName =
      `${user.first_name || ""} ${user.last_name || ""}`.trim() || "User";

    return NextResponse.json<ProfileUpdateResponse>(
      {
        success: true,
        message: "Profile updated successfully.",
        data: {
          user: {
            id: user.id,
            name: fullName,
            email: user.email,
            phone: user.phone,
            dateOfBirth: user.date_of_birth,
            hasMembership: false, // Will be updated separately
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in profile update:", error);
    return NextResponse.json<ProfileUpdateResponse>(
      {
        success: false,
        message: "Internal server error. Please try again.",
      },
      { status: 500 }
    );
  }
}

function validateField(
  field: string,
  value: string
): { isValid: boolean; message: string } {
  switch (field) {
    case "name":
      if (!value.trim()) {
        return { isValid: false, message: "Name is required." };
      }
      if (value.trim().length < 2) {
        return {
          isValid: false,
          message: "Name must be at least 2 characters long.",
        };
      }
      if (value.trim().length > 50) {
        return {
          isValid: false,
          message: "Name must be less than 50 characters.",
        };
      }
      return { isValid: true, message: "" };

    case "email":
      if (!value.trim()) {
        return { isValid: false, message: "Email is required." };
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return {
          isValid: false,
          message: "Please enter a valid email address.",
        };
      }
      return { isValid: true, message: "" };

    case "dateOfBirth":
      if (!value.trim()) {
        return { isValid: false, message: "Date of birth is required." };
      }
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return { isValid: false, message: "Please enter a valid date." };
      }
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      if (age < 13 || age > 120) {
        return {
          isValid: false,
          message: "Age must be between 13 and 120 years.",
        };
      }
      return { isValid: true, message: "" };

    default:
      return { isValid: false, message: "Invalid field type." };
  }
}
