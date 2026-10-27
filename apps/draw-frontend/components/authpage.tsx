"use client";

import { HTTP_BACKEND } from "@/config";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPage({ isSignIn }: { isSignIn: boolean }) {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    setError("");
    setLoading(true);
    try {
      await axios.post(`${HTTP_BACKEND}/signup`, {
        name,
        username: userName,
        password,
      });
      router.push("/signin");
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
      router.push("/");
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string; error?: string }>;
      setError(
        axiosErr.response?.data?.message ||
          axiosErr.response?.data?.error?.toString() ||
          "Invalid credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-neutral-200">
      <div className="w-5xl mx-auto h-full flex items-center justify-center">
        <div className=" w-xl p-20 rounded-lg shadow-lg shadow-neutral-800 bg-neutral-100">
          <div className="flex flex-col gap-6 items-center justify-center">
            <h1 className="text-4xl text-black font-bold">
              {isSignIn ? "Sign In" : "Sign Up"}
            </h1>

            {!isSignIn && (
              <input
                className="shadow-sm shadow-neutral-800 w-sm outline-none rounded-sm px-4 py-3 bg-neutral-100 text-neutral-900 "
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <input
              className="shadow-sm shadow-neutral-800 w-sm outline-none rounded-sm px-4 py-3 bg-neutral-100 text-neutral-900 "
              type="email"
              placeholder="Email"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              className="shadow-sm shadow-neutral-800 w-sm outline-none rounded-sm px-4 py-3 bg-neutral-100 text-neutral-900 "
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (isSignIn ? handleSignIn() : handleSignUp())}
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              onClick={isSignIn ? handleSignIn : handleSignUp}
              disabled={loading}
              className="bg-neutral-100 px-6 py-3 text-neutral-800 shadow-md shadow-neutral-600 font-semibold tracking-wide rounded-xl hover:bg-neutral-400 hover:text-neutral-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait…" : isSignIn ? "Sign in" : "Sign up"}
            </button>

            <p className="text-sm text-neutral-500">
              {isSignIn ? (
                <>
                  Don&apos;t have an account?{" "}
                  <a href="/signup" className="text-blue-600 hover:underline">
                    Sign up
                  </a>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <a href="/signin" className="text-blue-600 hover:underline">
                    Sign in
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
