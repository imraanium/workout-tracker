"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, signUp } from "../actions";

export function AuthControl({ email }: { email: string | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(!email);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  if (email && !open)
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl border border-hairline bg-panel p-1 pr-2 text-xs font-bold text-slate-300"
      >
        {email}
      </button>
    );
  return (
    <div className="relative">
      {email && (
        <button
          onClick={() => setOpen(false)}
          className="rounded-xl border border-hairline bg-panel px-3 py-2 text-xs font-bold text-slate-300"
        >
          {email.slice(0, 2).toUpperCase()}
        </button>
      )}
      {open && !email && (
        <form
          action={async (formData) => {
            setError("");
            try {
              const emailValue = String(formData.get("email"));
              const password = String(formData.get("password"));
              if (mode === "login") await signIn(emailValue, password);
              else await signUp(emailValue, password);
              setOpen(false);
              router.refresh();
            } catch (cause) {
              setError(
                cause instanceof Error
                  ? cause.message
                  : "Authentication failed",
              );
            }
          }}
          className="absolute right-0 top-12 z-50 w-64 space-y-2 rounded-xl border border-hairline bg-panel p-4 shadow-panel"
        >
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full rounded-lg bg-zinc850 p-2 text-sm text-white"
          />
          <input
            name="password"
            type="password"
            minLength={6}
            required
            placeholder="Password"
            className="w-full rounded-lg bg-zinc850 p-2 text-sm text-white"
          />
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <button className="w-full rounded-lg bg-accent p-2 text-sm font-bold text-black">
            {mode === "login" ? "Login" : "Sign up"}
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="w-full text-xs text-slate-400"
          >
            {mode === "login" ? "Create an account" : "Already registered?"}
          </button>
        </form>
      )}
      {open && email && (
        <div className="absolute right-0 top-12 z-50 w-48 space-y-2 rounded-xl border border-hairline bg-panel p-4 shadow-panel">
          <p className="truncate text-xs text-slate-400">{email}</p>
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <button
            type="button"
            onClick={async () => {
              setError("");
              try {
                await signOut();
                setOpen(true);
                router.refresh();
              } catch (cause) {
                setError(
                  cause instanceof Error ? cause.message : "Could not log out",
                );
              }
            }}
            className="w-full rounded-lg border border-hairline p-2 text-xs font-bold text-slate-300"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
