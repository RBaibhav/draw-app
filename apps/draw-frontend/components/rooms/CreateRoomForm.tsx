"use client";

import { ArrowRight, Sparkles } from "lucide-react";

interface CreateRoomFormProps {
  createInput: string;
  setCreateInput: (val: string) => void;
  onGenerateName: () => void;
  onSubmit: (e?: React.FormEvent) => void;
  loading: boolean;
  error: string;
}

export default function CreateRoomForm({
  createInput,
  setCreateInput,
  onGenerateName,
  onSubmit,
  loading,
  error,
}: CreateRoomFormProps) {
  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="create-input"
            className="block text-sm font-semibold text-gray-700"
          >
            New Room Name
          </label>
          <button
            type="button"
            onClick={onGenerateName}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Suggest name
          </button>
        </div>
        <div className="relative">
          <input
            id="create-input"
            type="text"
            placeholder="e.g. project-roadmap-v1"
            value={createInput}
            onChange={(e) => setCreateInput(e.target.value)}
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
          You will be the room admin and can share the invite link with teammates.
        </span>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition shadow-lg hover:shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Creating…" : "Create & Start Drawing"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
