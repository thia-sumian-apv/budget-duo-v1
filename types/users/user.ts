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
  createdAt: Date;
  updatedAt: Date;
}
