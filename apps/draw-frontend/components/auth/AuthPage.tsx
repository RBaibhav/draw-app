"use client";

import { HTTP_BACKEND } from "@/config";
import axios, { AxiosError } from "axios";
import { AlertCircle, ArrowLeft, Eye, EyeOff, Loader2, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface AuthPageProps {
  isSignIn: boolean;
}

export default function AuthPage({ isSignIn }: AuthPageProps) {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const handleSignUp = async () => {
    setError("");
    setLoading(true);
    try {
      await axios.post(`${HTTP_BACKEND}/signup`, {
        name,
        username: userName,
        password,
      });
      router.push(
        `/signin${redirectUrl !== "/" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`,
      );
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string; error?: string }>;
      setError(
        axiosErr.response?.data?.message ||
          axiosErr.response?.data?.error?.toString() ||
          "Sign up failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${HTTP_BACKEND}/signin`, {
        username: userName,
        password,
      });
      const token = res.data.token;
      localStorage.setItem("token", token);
      router.push(redirectUrl);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string; error?: string }>;
      setError(
        axiosErr.response?.data?.message ||
          axiosErr.response?.data?.error?.toString() ||
          "Invalid credentials. Please check your username and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSignIn) {
      handleSignIn();
    } else {
      handleSignUp();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar adhering to the exact app theme */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/80 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Pencil className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight">
                Draw App
              </span>
            </Link>

            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main card */}
      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-md">
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200/80 rounded-3xl shadow-2xl p-8 sm:p-10 transition-all">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-2xl mb-4 text-blue-600">
                <Pencil className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {isSignIn ? "Welcome back" : "Create an account"}
              </h1>
              <p className="text-gray-500 text-sm mt-1.5">
                {isSignIn
                  ? "Sign in to jump straight into your whiteboards"
                  : "Join to create rooms and collaborate live"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isSignIn && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-5 py-3.5 bg-gray-50/70 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email or Username
                </label>
                <input
                  id="email"
                  type="text"
                  placeholder="name@example.com"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="w-full px-5 py-3.5 bg-gray-50/70 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-5 py-3.5 pr-12 bg-gray-50/70 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition shadow-lg hover:shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer text-base mt-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading
                  ? "Please wait…"
                  : isSignIn
                    ? "Sign In"
                    : "Create Account"}
              </button>
            </form>

            {/* Footer toggle */}
            <p className="mt-8 text-center text-sm text-gray-500">
              {isSignIn ? (
                <>
                  Don&apos;t have an account?{" "}
                  <Link
                    href={`/signup${redirectUrl !== "/" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link
                    href={`/signin${redirectUrl !== "/" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
