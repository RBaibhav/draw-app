"use client";

import { Layers, RotateCw } from "lucide-react";
import RoomCard, { RoomItem } from "./RoomCard";

interface RoomListProps {
  rooms: RoomItem[];
  loadingRooms: boolean;
  onRefresh: () => void;
}

export default function RoomList({
  rooms,
  loadingRooms,
  onRefresh,
}: RoomListProps) {
  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          Your Whiteboards
        </h3>
        <button
          onClick={onRefresh}
          disabled={loadingRooms}
          className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 transition cursor-pointer"
          title="Refresh list"
        >
          <RotateCw
            className={`w-3.5 h-3.5 ${loadingRooms ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {loadingRooms ? (
        <div className="py-6 text-center text-sm text-gray-400">
          Loading your rooms…
        </div>
      ) : rooms.length === 0 ? (
        <div className="py-6 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-sm text-gray-500">
          No rooms yet. Create or join one above to get started!
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}
