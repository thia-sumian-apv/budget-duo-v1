import type { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { Role } from "@/types/users/user";
import { ObjectId } from "mongodb";
import getUserCollections from "@/db/users/getCollections";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { users } = await getUserCollections();
        const user = await users.findOne({ email: credentials.email });
        if (!user || !user.password) return null;

        const valid = await compare(credentials.password, user.password);
        if (!valid) return null;

        if (!user.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        return {
          id: user._id.toHexString(),
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token?.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      try {
        const { users } = await getUserCollections();
        // NextAuth adapter creates/updates the user; ensure role/provider fields exist
        const id = (user as any).id as string | undefined;
        if (!id) return;
        const set: Record<string, unknown> = { updatedAt: new Date() };
        if (account?.provider) set.provider = account.provider;
        if ((account as any)?.providerAccountId)
          set.providerAccountId = (account as any).providerAccountId;
        // Default role to USER if missing
        set.role = (user as any).role ?? Role.USER;
        await users.updateOne(
          { _id: new ObjectId(id) },
          { $set: set },
          { upsert: false }
        );
      } catch (e) {
        // swallow to avoid blocking sign-in
        console.error("signIn event update failed", e);
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
};
