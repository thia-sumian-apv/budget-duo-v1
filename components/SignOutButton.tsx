"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

type Props = {
  className?: string;
};

export default function SignOutButton({ className }: Props) {
  return (
    <Button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={className}
    >
      Sign out
    </Button>
  );
}
