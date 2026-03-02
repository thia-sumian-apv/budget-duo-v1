import { NextResponse } from "next/server";
import getUserCollections from "@/db/users/getCollections";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    const { users } = await getUserCollections();
    const user = await users.findOne({
      emailVerifyToken: token,
      emailVerifyExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    await users.updateOne(
      { _id: user._id },
      {
        $set: { emailVerified: new Date(), updatedAt: new Date() },
        $unset: { emailVerifyToken: "", emailVerifyExpires: "" },
      }
    );

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:4001";
    return NextResponse.redirect(`${baseUrl}/login?verified=1`);
  } catch (err) {
    console.error("verify-email error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
