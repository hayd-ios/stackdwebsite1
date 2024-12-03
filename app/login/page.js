"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsFormFilled(email !== "" && password !== "");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err.code === "auth/invalid-credentials"
          ? "Invalid email or password"
          : "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#4c1d95]/10 via-transparent to-[#4c1d95]/10"></div>

      <div className="w-full max-w-md space-y-8 relative">
        {/* Logo/Brand */}
        <div className="text-center space-y-6">
          <div className="relative">
            <h1 className="text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#c4b5fd]">
              <span className="text-white">Stackd</span>.
            </h1>
            <div className="absolute -inset-1 blur-xl bg-[#4c1d95]/20 -z-10"></div>
          </div>
        </div>

        {/* Login Form */}
        <div className="mt-8 space-y-6 backdrop-blur-xl bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-500 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-400"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-900/90 border border-neutral-800 rounded-lg focus:ring-2 focus:ring-[#4c1d95] focus:border-transparent transition-all outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-400"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-900/90 border border-neutral-800 rounded-lg focus:ring-2 focus:ring-[#4c1d95] focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="relative group">
              {isFormFilled && (
                <div className="absolute -inset-1 bg-gradient-to-r from-[#4c1d95] via-[#7c3aed] to-[#4c1d95] rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-gradient"></div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className={`relative w-full py-3 px-4 bg-[#4c1d95] text-white rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#4c1d95] focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    isFormFilled ? "hover:bg-[#5b21b6]" : "hover:bg-[#3b0764]"
                  }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="text-center space-y-4">
            <p className="text-sm text-neutral-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-[#7c3aed] hover:text-[#6d28d9] transition-colors"
              >
                Sign up
              </Link>
            </p>
            <Link
              href="/forgot-password"
              className="block text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
