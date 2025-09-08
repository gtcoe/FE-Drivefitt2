import { NextRequest, NextResponse } from "next/server";
import { otpService } from "@/lib/otpService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, phone, purpose, vendorResponse } = body;

    switch (operation) {
      case "generate_and_store":
        // Generate OTP and store in database
        if (!phone || !purpose) {
          return NextResponse.json(
            { success: false, message: "Phone and purpose are required" },
            { status: 400 }
          );
        }

        const result = await otpService.generateAndStoreOTP(phone, purpose);
        return NextResponse.json(result);

      case "update_vendor_response":
        // Update vendor response in database
        if (!phone || !purpose || !vendorResponse) {
          return NextResponse.json(
            {
              success: false,
              message: "Phone, purpose, and vendor response are required",
            },
            { status: 400 }
          );
        }

        // Get OTP record and update vendor response
        const otpRecord = await otpService.getOTPRecord(phone, purpose);
        if (otpRecord) {
          await otpService.updateVendorResponse(otpRecord.id, vendorResponse);
          return NextResponse.json({ success: true });
        } else {
          return NextResponse.json(
            { success: false, message: "OTP record not found" },
            { status: 404 }
          );
        }

      default:
        return NextResponse.json(
          { success: false, message: "Invalid operation" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in OTP database operations:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
