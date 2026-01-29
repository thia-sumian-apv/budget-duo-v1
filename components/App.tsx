import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import UnauthenticatedRoutes from "@/app/routes/UnauthenticatedRoutes";

export default async function App() {
  const session = await getServerSession(authOptions);

  // Redirect authenticated users to dashboard
  if (session) {
    redirect("/dashboard");
  }

  // Show landing page for unauthenticated users
  return <UnauthenticatedRoutes />;
}
