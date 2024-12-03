"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validations, setValidations] = useState({
    password: {
      minLength: false,
      hasNumber: false,
      hasSpecial: false,
    },
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setValidations({
        password: {
          minLength: value.length >= 8,
          hasNumber: /\d/.test(value),
          hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullname: formData.name,
        username: formData.username.toLowerCase(),
        email: formData.email.toLowerCase(),
        uid: user.uid,
        createdAt: new Date(),
        profileImageUrl:
          "https://firebasestorage.googleapis.com/v0/b/stackd-e6d96.appspot.com/o/assets%2Favatar.jpg?alt=media&token=e37b9e17-8752-40ba-8ef7-4e5d603dd3e4",
        stackScore: 0,
      });

      router.push("/dashboard");
    } catch (err) {
      setError(
        err.code === "auth/email-already-in-use"
          ? "This email is already registered"
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
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-purple-500/10"></div>

      <div className="w-full max-w-md space-y-8 relative">
        {/* Logo/Brand */}
        <div className="text-center space-y-6">
          <div className="relative">
            <h1 className="text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-200">
              Stackd.
            </h1>
            <div className="absolute -inset-1 blur-xl bg-purple-500/20 -z-10"></div>
          </div>
          <h2 className="text-xl text-neutral-400">Create your account</h2>
        </div>

        <div className="mt-8 space-y-6 backdrop-blur-xl bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800/50">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-400">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-neutral-900/90 border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-400">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-neutral-900/90 border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                  placeholder="johndoe"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-400">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-neutral-900/90 border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-400">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-900/90 border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  {validations.password.minLength ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-neutral-500" />
                  )}
                  <span
                    className={
                      validations.password.minLength
                        ? "text-green-500"
                        : "text-neutral-500"
                    }
                  >
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  {validations.password.hasNumber ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-neutral-500" />
                  )}
                  <span
                    className={
                      validations.password.hasNumber
                        ? "text-green-500"
                        : "text-neutral-500"
                    }
                  >
                    Contains a number
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  {validations.password.hasSpecial ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-neutral-500" />
                  )}
                  <span
                    className={
                      validations.password.hasSpecial
                        ? "text-green-500"
                        : "text-neutral-500"
                    }
                  >
                    Contains a special character
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center space-y-4">
            <p className="text-sm text-neutral-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-purple-400 hover:text-purple-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
