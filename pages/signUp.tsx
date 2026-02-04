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
      setInfoMessage("Check your email to confirm your account.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-80 space-y-4">
        <h1 className="text-2xl font-bold text-center">
          Create an account
        </h1>
        <p className="text-center">
          Get started in less than a minute
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignUp();
          }}
          className="space-y-3"
        >
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-2 py-1"
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-2 py-1"
              required
            />
          </div>

          {errorMessage && (
            <p className="text-red-600">{errorMessage}</p>
          )}

          {infoMessage && (
            <p className="text-green-600">{infoMessage}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600">
            Log in
          </Link>
        </p>

        <p className="text-center text-sm text-gray-500">
          This is a demo app — no real data yet.
        </p>
      </div>
    </main>
  );
}
