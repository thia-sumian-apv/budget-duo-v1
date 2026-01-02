import type { Metadata } from "next";
import "./globals.css";
import { ubuntu, openSans } from "./fonts";
import ApolloClientProvider from "@/app/ApolloClientProvider";
import NextAuthProvider from "@/app/NextAuthProvider";

export const metadata: Metadata = {
  title: "Budget Duo",
  description: "Budget Duo is a tool to help you manage your finances.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ubuntu.variable} ${openSans.variable}`}>
      <body>
        <NextAuthProvider>
          <ApolloClientProvider>{children}</ApolloClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
