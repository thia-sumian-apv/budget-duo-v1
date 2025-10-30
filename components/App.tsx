import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AppRoutes from "@/app/routes/AppRoutes";

export default async function App() {
  const session = await getServerSession(authOptions);
  return <AppRoutes isAuthenticated={!!session} />;
}
