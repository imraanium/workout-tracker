"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "../actions";

export function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-hairline bg-panel p-6 shadow-panel sm:p-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-xl font-black text-[color:var(--accent-ink)]">
            I
          </span>
          <div>
            <p className="text-lg font-extrabold uppercase tracking-tight text-white">
              Iron<span className="text-accent">log</span>
            </p>
            <p className="text-sm text-slate-400">Train with intention.</p>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-white">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {mode === "login"
            ? "Sign in to continue tracking your training."
            : "Start tracking workouts, progress, and plans in one place."}
        </p>

        <form
          className="mt-6 space-y-3"
          action={async (formData) => {
            setError("");
            setMessage("");
            const email = String(formData.get("email") ?? "");
            const password = String(formData.get("password") ?? "");

            try {
              if (mode === "login") {
                await signIn(email, password);
                router.replace("/");
                router.refresh();
              } else {
                await signUp(email, password);
                setMessage(
                  "Account created. Check your email to confirm your account, then sign in.",
                );
                setMode("login");
              }
            } catch (cause) {
              setError(
                cause instanceof Error
                  ? cause.message
                  : "Authentication failed. Please try again.",
              );
            }
          }}
        >
          <label className="block text-sm font-semibold text-slate-300">
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1.5 w-full rounded-xl border border-hairline bg-zinc850 p-3 text-white outline-none transition-colors focus:border-accent"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-300">
            Password
            <input
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="mt-1.5 w-full rounded-xl border border-hairline bg-zinc850 p-3 text-white outline-none transition-colors focus:border-accent"
            />
          </label>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          {message && <p className="text-sm text-accent">{message}</p>}
          <button className="w-full rounded-xl bg-accent p-3 font-bold text-black transition-transform active:scale-[0.98]">
            {mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setError("");
            setMessage("");
            setMode(mode === "login" ? "signup" : "login");
          }}
          className="mt-5 w-full text-sm text-slate-400 transition-colors hover:text-white"
        >
          {mode === "login"
            ? "Need an account? Sign up"
            : "Already have an account? Log in"}
        </button>
      </section>
    </main>
  );
}
