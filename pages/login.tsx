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
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-80 space-y-4">
        <h1 className="text-4xl font-bold text-center">Login</h1>
        <p className="text-center">Log in to continue</p>
  
         {/*adds the inputs and checks them against handleLogin function. */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-3"
        >
          {/*email text box block*/}
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
  
          {/*password text box block*/}
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
  
          {errorMessage && <p className="text-red-600">{errorMessage}</p>}
  
          <button
            type="submit"
            disabled={loading}

            className="w-full bg-blue-600 text-white py-2"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
  
        <p className="text-center">
          New here?{" "}
          <Link href="/signUp" className="text-blue-600">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
  
  
}
