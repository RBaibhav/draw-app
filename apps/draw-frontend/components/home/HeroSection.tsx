"use client";

import { Pencil, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
  token: string | null;
  onScrollToRoomHub: () => void;
}

export default function HeroSection({
  token,
  onScrollToRoomHub,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-slate-50 pt-16 pb-12 md:pt-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-100/80 border border-blue-200/80 text-blue-700 px-4 py-1.5 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Real-time Collaborative Whiteboard
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
              Sketch, brainstorm & build diagrams{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                together in real time
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
              Fast, intuitive, and synchronized collaborative whiteboard. Create
              rooms, invite team members, sketch wireframes, and draw ideas with
              zero friction.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onScrollToRoomHub}
                className="bg-blue-600 text-white px-7 py-3.5 rounded-2xl hover:bg-blue-700 transition font-semibold text-base shadow-xl shadow-blue-600/20 transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
                Start Drawing Now
              </button>
              {!token && (
                <Link href="/signin">
                  <button className="border-2 border-gray-300 text-gray-700 px-7 py-3.5 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition font-semibold text-base cursor-pointer">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Graphic Visual */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-gray-200/80">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-semibold text-gray-400">
                  whiteboard-canvas.preview
                </span>
              </div>
              <div className="space-y-3">
                <div className="h-28 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl border-2 border-dashed border-blue-300 p-4 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-700">
                    Live Team Collaboration
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-20 bg-emerald-50 rounded-2xl border border-emerald-200 p-3 flex flex-col justify-between">
                    <span className="text-xs font-semibold text-emerald-700">
                      Multiplayer Cursor
                    </span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="h-20 bg-purple-50 rounded-2xl border border-purple-200 p-3 flex flex-col justify-between">
                    <span className="text-xs font-semibold text-purple-700">
                      Instant Sync
                    </span>
                    <Zap className="w-4 h-4 text-purple-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
