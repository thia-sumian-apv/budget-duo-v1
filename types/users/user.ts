import type { ObjectId } from "mongodb";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface UserDocument {
  _id: ObjectId;
  email: string;
  name?: string | null;
  image?: string | null;
  role: Role;
  provider?: string | null;
  providerAccountId?: string | null;
  password?: string | null;
  emailVerified?: Date | null;
  emailVerifyToken?: string | null;
  emailVerifyExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  displayName?: string | null;
}
