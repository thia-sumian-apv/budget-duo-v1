import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { ObjectId } from "mongodb";
import getUserCollections from "@/db/users/getCollections";
import { Role } from "@/types/users/user";
import { sendMail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const { users } = await getUserCollections();
    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashed = await hash(password, 12);
    const token = randomBytes(32).toString("hex");
    const now = new Date();

    await users.insertOne({
      _id: new ObjectId(),
      email,
      name: name ?? null,
      image: null,
      password: hashed,
      role: Role.USER,
      provider: "credentials",
      providerAccountId: null,
      emailVerified: null,
      emailVerifyToken: token,
      emailVerifyExpires: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24h
      createdAt: now,
      updatedAt: now,
    });

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:4001";
    const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;

    await sendMail({
      to: email,
      subject: "Verify your Budget Duo email",
      html: `
        <h2>Welcome to Budget Duo!</h2>
        <p>Click the link below to verify your email address:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>This link expires in 24 hours.</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("register error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
