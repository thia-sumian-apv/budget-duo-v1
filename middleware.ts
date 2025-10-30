import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { publicRoutes, protectedRoutes } from "@/app/routes/config";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow Next internals and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;

  // If unauthenticated and accessing a protected route, redirect to /login
  if (!isAuthenticated && protectedRoutes.some((p) => pathname.startsWith(p))) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // If authenticated and visiting the login route, send them to callbackUrl or home
  if (isAuthenticated && pathname === "/login") {
    const url = req.nextUrl.clone();
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
    url.search = "";
    url.pathname = callbackUrl || "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|og.png|api/graphql).*)"],
};
