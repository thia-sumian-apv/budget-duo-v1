"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Github, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 lg:px-8">
        <motion.div
          className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-[#3B82F6]" />
              <span>Welcome back</span>
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">
              Sign in to Budget Duo
            </h1>
            <p className="mt-2 text-sm text-white/70">
              Choose a provider to continue.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full justify-center rounded-md bg-white text-black hover:bg-white/90"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="mr-2 h-4 w-4"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10 0 19-7.3 19-20 0-1.3-.1-2.7-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.4 16.2 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.2 4 9.4 8.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 10-2 13.6-5.4l-6.3-5.2C29.1 34.7 26.7 36 24 36c-5.1 0-9.5-3.3-11.1-7.8l-6.6 5.1C9.4 39.7 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.6-5.1 6-9.3 6-5.1 0-9.5-3.3-11.1-7.8l-6.6 5.1C9.4 39.7 16.2 44 24 44c10 0 19-7.3 19-20 0-1.3-.1-2.7-.4-3.5z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              className="w-full justify-center rounded-md bg-white/[0.06] text-white hover:bg-white/[0.12]"
              onClick={() => signIn("github", { callbackUrl: "/" })}
            >
              <Github className="mr-2 h-4 w-4" /> Continue with GitHub
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-white/50">
            By continuing you agree to our Terms and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
