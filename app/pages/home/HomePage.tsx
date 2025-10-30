import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import HomeDashboard from "./HomeDashboard";
import SignOutButton from "@/components/signOut/SignOutButton";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 md:px-0">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold leading-none tracking-tighter md:text-4xl lg:text-5xl">
            Welcome, {session?.user?.name ?? ""}
          </h1>
          <SignOutButton />
        </header>
        <HomeDashboard />
      </div>
    </div>
  );
}
