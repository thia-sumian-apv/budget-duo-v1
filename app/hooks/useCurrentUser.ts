"use client";

import { useSession } from "next-auth/react";

export function useCurrentUser() {
  const { data, status } = useSession();
  const user = data?.user;
  const userId = user?.id;
  return { user, userId, status } as const;
}
