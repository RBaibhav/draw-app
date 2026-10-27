"use client";

import { Check, Copy, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface RoomItem {
  id: number;
  slug: string;
  createdAt: string;
  adminId: string;
  admin?: { name: string; email: string };
  _count?: { members: number; shapes: number };
}

interface RoomCardProps {
  room: RoomItem;
}

export default function RoomCard({ room }: RoomCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const copyRoomInvite = async () => {
    const url = `${window.location.origin}/canvas/${room.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard fallback
    }
  };

  return (
    <div className="group bg-gray-50/70 hover:bg-blue-50/50 border border-gray-200/80 hover:border-blue-300 rounded-2xl p-4 transition-all flex items-center justify-between">
      <div className="min-w-0 pr-3">
        <h4 className="font-semibold text-gray-900 text-sm truncate">
          {room.slug}
        </h4>
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            {room._count?.members ?? 1}
          </span>
          <span>•</span>
          <span>{new Date(room.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={copyRoomInvite}
          className="p-2 text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 rounded-xl border border-gray-200 transition cursor-pointer"
          title="Copy invite link"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={() => router.push(`/canvas/${room.slug}`)}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-sm transition cursor-pointer"
        >
          Enter
        </button>
      </div>
    </div>
  );
}
