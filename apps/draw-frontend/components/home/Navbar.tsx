"use client";

import { Pencil, Github, LogOut } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  token: string | null;
  onLogout: () => void;
  onScrollToRoomHub: () => void;
}

export default function Navbar({
  token,
  onLogout,
  onScrollToRoomHub,
}: NavbarProps) {
  return (
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

          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Features
            </a>
            <a
              href="#room-hub"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Rooms
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-gray-600 hover:text-gray-900 transition flex items-center space-x-1.5"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>

            {token ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={onScrollToRoomHub}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-xl transition font-medium cursor-pointer"
                >
                  My Whiteboards
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 px-3 py-2 rounded-xl hover:bg-red-50 transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/signin"
                  className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-100 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition font-medium shadow-md shadow-blue-500/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
