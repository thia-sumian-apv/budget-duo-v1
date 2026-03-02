import { Suspense } from "react";
import AuthPage from "@/app/pages/AuthPage";

export default function LoginPage() {
  return (
    <Suspense>
      <AuthPage />
    </Suspense>
  );
}
