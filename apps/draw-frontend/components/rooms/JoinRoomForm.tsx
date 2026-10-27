"use client";

import { ArrowRight } from "lucide-react";

interface JoinRoomFormProps {
  joinInput: string;
  setJoinInput: (val: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  loading: boolean;
  error: string;
}

export default function JoinRoomForm({
  joinInput,
  setJoinInput,
  onSubmit,
  loading,
  error,
}: JoinRoomFormProps) {
  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6">
      <div>
        <label
          htmlFor="join-input"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Room Code or Name
        </label>
        <div className="relative">
          <input
            id="join-input"
            type="text"
            placeholder="e.g. design-brainstorm, team-wireframe, or room ID"
            value={joinInput}
            onChange={(e) => setJoinInput(e.target.value)}
            className="w-full px-5 py-4 bg-gray-50/70 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-base"
          />
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <span className="text-xs text-gray-400">
          Anyone in the room can draw, erase, and sketch live.
        </span>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition shadow-lg hover:shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Joining…" : "Join Canvas"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
