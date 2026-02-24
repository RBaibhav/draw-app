"use client";

import { HTTP_BACKEND } from "@/config";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPage({ isSignIn }: { isSignIn: boolean }) {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const router =  useRouter();

  const handleSignUp = async () => {
    try {
      const res = await axios.post(`${HTTP_BACKEND}/signup`, {
        name,
        username: userName,
        password,
      });
    } catch (err) {
      router.push("/signin");
      console.log(err);
      
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

            <input
              className="shadow-sm shadow-neutral-800 w-sm outline-none rounded-sm px-4 py-3 bg-neutral-100 text-neutral-900 "
              type="text"
              placeholder="Your Name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="shadow-sm shadow-neutral-800 w-sm outline-none rounded-sm px-4 py-3 bg-neutral-100 text-neutral-900 "
              type="text"
              placeholder="email"
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              className="shadow-sm shadow-neutral-800 w-sm outline-none rounded-sm px-4 py-3 bg-neutral-100 text-neutral-900 "
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleSignUp}
              className="bg-neutral-100 px-6 py-3 text-neutral-800 shadow-md shadow-neutral-600 font-semibold tracking-wide rounded-xl hover:bg-neutral-400 hover:text-neutral-100 cursor-pointer"
            >
              {" "}
              {isSignIn ? "Sign in" : "Sign up"}{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
