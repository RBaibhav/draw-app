"use client";

import { deleteRoom, leaveRoom } from "@/draw/http";
import { Check, Copy, LogOut, ShieldAlert, Trash2, Users } from "lucide-react";
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
  currentUserId?: string | null;
  onDelete?: (roomId: number) => void;
  onLeave?: (roomId: number) => void;
}

export default function RoomCard({
  room,
  currentUserId,
  onDelete,
  onLeave,
}: RoomCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isConfirmingLeave, setIsConfirmingLeave] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionError, setActionError] = useState("");

  const isAdmin = Boolean(currentUserId && currentUserId === room.adminId);

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

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingAction(true);
    setActionError("");
    try {
      const res = await deleteRoom(room.id, token);
      if (res.success) {
        onDelete?.(room.id);
      } else {
        setActionError(res.message || "Failed to delete");
        setIsConfirmingDelete(false);
      }
    } catch (err) {
      console.error("Error deleting room:", err);
      setActionError("Failed to delete room");
      setIsConfirmingDelete(false);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleLeave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingAction(true);
    setActionError("");
    try {
      const res = await leaveRoom(room.id, token);
      if (res.success) {
        onLeave?.(room.id);
      } else {
        setActionError(res.message || "Failed to leave");
        setIsConfirmingLeave(false);
      }
    } catch (err) {
      console.error("Error leaving room:", err);
      setActionError("Failed to leave room");
      setIsConfirmingLeave(false);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="group bg-gray-50/70 hover:bg-blue-50/50 border border-gray-200/80 hover:border-blue-300 rounded-2xl p-4 transition-all flex flex-col justify-between gap-3">
      <div className="flex items-center justify-between">
        <div className="min-w-0 pr-3">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900 text-sm truncate">
              {room.slug}
            </h4>
            {isAdmin && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-blue-100 text-blue-700 border border-blue-200/60">
                Admin
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              {room._count?.members ?? 1}
            </span>
            <span>•</span>
            <span>{new Date(room.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isConfirmingDelete ? (
            <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
              <button
                onClick={handleDelete}
                disabled={loadingAction}
                className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
                title="Confirm permanent deletion"
              >
                {loadingAction ? "Deleting…" : "Delete"}
              </button>
              <button
                onClick={() => setIsConfirmingDelete(false)}
                disabled={loadingAction}
                className="px-2.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : isConfirmingLeave ? (
            <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
              <button
                onClick={handleLeave}
                disabled={loadingAction}
                className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
                title="Confirm leaving room"
              >
                {loadingAction ? "Leaving…" : "Leave"}
              </button>
              <button
                onClick={() => setIsConfirmingLeave(false)}
                disabled={loadingAction}
                className="px-2.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              {/* Copy invite link */}
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

              {/* Delete button (for admin) or Leave button (for members) */}
              {isAdmin ? (
                <button
                  onClick={() => setIsConfirmingDelete(true)}
                  className="p-2 text-gray-400 hover:text-red-600 bg-white hover:bg-red-50 rounded-xl border border-gray-200 hover:border-red-200 transition cursor-pointer"
                  title="Delete Room permanently"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setIsConfirmingLeave(true)}
                  className="p-2 text-gray-400 hover:text-amber-600 bg-white hover:bg-amber-50 rounded-xl border border-gray-200 hover:border-amber-200 transition cursor-pointer"
                  title="Leave Room"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}

              {/* Enter room button */}
              <button
                onClick={() => router.push(`/canvas/${room.slug}`)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-sm transition cursor-pointer"
              >
                Enter
              </button>
            </>
          )}
        </div>
      </div>

      {actionError && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded-xl border border-red-100">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}
    </div>
  );
}
