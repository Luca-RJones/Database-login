import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setErrorMessage("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      setErrorMessage("Invalid email or password");
      setPassword("");
      setEmail("");
      return;
    }

    setLoading(false);
    router.push("/videos");
  }

  return (
    <main className="relative min-h-screen bg-zinc-950 px-4">
   
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),transparent_60%)]" />

      <div className="relative flex min-h-screen items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="relative rounded-2xl bg-zinc-900/90 p-8 shadow-xl ring-1 ring-blue-500/30">
           
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-blue-600" />

            <div className="mb-8 text-center">
              <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
              <p className="mt-2 text-sm text-zinc-400">Log in to continue</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {errorMessage && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                  <p className="text-sm text-red-400">{errorMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-zinc-400">
                New here?{" "}
                <Link
                  href="/signUp"
                  className="font-medium text-blue-500 hover:text-blue-400"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-zinc-500">
            Tip: you can press Enter to log in
          </p>
        </div>
      </div>
    </main>
  );
}
