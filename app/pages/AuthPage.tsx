"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Github, Sparkles, Mail, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

const AuthPage = () => {
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified") === "1";
  const errorParam = searchParams.get("error");

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isSignUp) {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name: name || undefined }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Registration failed");
        } else {
          setMessage("Check your email for a verification link.");
          setIsSignUp(false);
        }
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    } else {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      setLoading(false);
      if (result?.error === "EMAIL_NOT_VERIFIED") {
        setError("Please verify your email before signing in.");
      } else if (result?.error) {
        setError("Invalid email or password");
      } else if (result?.ok) {
        window.location.href = "/";
      }
    }
  };

  return (
    <div className="min-h-screen bg-base text-navy">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 lg:px-8">
        <motion.div
          className="w-full max-w-md rounded-2xl border border-navy/10 bg-white/50 p-8 shadow-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white/70 px-3 py-1 text-xs text-navy/70">
              <Sparkles className="h-3.5 w-3.5 text-highlight" />
              <span>{isSignUp ? "Get started" : "Welcome back"}</span>
            </div>
            <h1 className="mt-4 text-2xl font-heading font-semibold tracking-tight text-navy">
              {isSignUp ? "Create an account" : "Sign in to Budget Duo"}
            </h1>
            <p className="mt-2 text-sm text-navy/70">
              {isSignUp
                ? "Sign up with your email to get started."
                : "Choose a provider to continue."}
            </p>
          </div>

          {verified && (
            <div className="mb-4 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700 text-center">
              Email verified! You can now sign in.
            </div>
          )}

          {message && (
            <div className="mb-4 rounded-md bg-blue-50 border border-blue-200 p-3 text-sm text-blue-700 text-center">
              {message}
            </div>
          )}

          {(error || errorParam) && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700 text-center">
              {error ?? errorParam}
            </div>
          )}

          <form onSubmit={handleCredentialSubmit} className="space-y-3">
            {isSignUp && (
              <input
                type="text"
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-navy/20 bg-white px-3 py-2 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/30"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-navy/20 bg-white px-3 py-2 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/30"
            />
            <input
              type="password"
              placeholder={isSignUp ? "Password (min 8 chars)" : "Password"}
              required
              minLength={isSignUp ? 8 : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-navy/20 bg-white px-3 py-2 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/30"
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full justify-center rounded-md bg-navy text-white hover:bg-navy/90"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              {isSignUp ? "Sign up" : "Sign in with Email"}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setMessage(null);
            }}
            className="mt-2 w-full text-center text-xs text-navy/60 hover:text-navy/80"
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don\u2019t have an account? Sign up"}
          </button>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-navy/10" />
            <span className="text-xs text-navy/40">or</span>
            <div className="h-px flex-1 bg-navy/10" />
          </div>

          <div className="space-y-3">
            <Button
              className="w-full justify-center rounded-md bg-navy text-white hover:bg-navy/90"
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
              className="w-full justify-center rounded-md bg-navy/10 text-navy hover:bg-navy/20"
              onClick={() => signIn("github", { callbackUrl: "/" })}
            >
              <Github className="mr-2 h-4 w-4" /> Continue with GitHub
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-navy/50">
            By continuing you agree to our Terms and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
