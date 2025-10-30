import type { Metadata } from "next";
import "./globals.css";
import { inter } from "./fonts";
import ApolloClientProvider from "@/app/ApolloClientProvider";
import NextAuthProvider from "@/app/NextAuthProvider";

export const metadata: Metadata = {
  title: "Next.js + MongoDB",
  description: "Use MongoDB with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body>
        <NextAuthProvider>
          <ApolloClientProvider>{children}</ApolloClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
