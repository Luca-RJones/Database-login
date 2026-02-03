import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignUp() {
    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setErrorMessage(error.message);
      return;
    }

    setLoading(false);

    if (data.session) {
      router.push("/videos");
    } else {
      setInfoMessage("Check your email to confirm your account, then log in.");
    }
  }

  return (
    <main className="relative min-h-screen bg-zinc-950 px-4">
      {/* Blue glow background (SIGNUP TOO) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_65%)]" />

      <div className="relative flex min-h-screen items-center justify-center">
        {/* Signup is intentionally larger */}
        <div className="w-full max-w-lg">
          <div className="relative rounded-2xl bg-zinc-900/90 p-10 shadow-xl ring-1 ring-blue-500/25">
            
            {/* Top blue accent bar */}
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-blue-600" />

            {/* Header (left-aligned = onboarding) */}
            <div className="mb-8 text-left">
              <h1 className="text-3xl font-semibold text-white">
                Create an account
              </h1>
              <p className="mt-2 text-sm text-zinc-400">
                Get started in less than a minute
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSignUp();
              }}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-zinc-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-zinc-300"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-2 text-xs text-zinc-500">
                  Use something you’ll remember.
                </p>
              </div>

              {errorMessage && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                  <p className="text-sm text-red-400">{errorMessage}</p>
                </div>
              )}

              {infoMessage && (
                <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                  <p className="text-sm text-green-400">{infoMessage}</p>
                </div>
              )}

              {/* Signup button slightly softer but still blue */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-500 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className="mt-6 text-left">
              <p className="text-sm text-zinc-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-500 hover:text-blue-400"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-6 text-left text-xs text-zinc-500">
            This is a demo app — no real data yet.
          </p>
        </div>
      </div>
    </main>
  );
}
