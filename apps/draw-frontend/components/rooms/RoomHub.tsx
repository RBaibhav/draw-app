"use client";

import { HTTP_BACKEND } from "@/config";
import axios, { AxiosError } from "axios";
import { LogIn, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CreateRoomForm from "./CreateRoomForm";
import JoinRoomForm from "./JoinRoomForm";
import { RoomItem } from "./RoomCard";
import RoomList from "./RoomList";

export default function RoomHub() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"join" | "create">("join");
  const [joinInput, setJoinInput] = useState("");
  const [createInput, setCreateInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [myRooms, setMyRooms] = useState<RoomItem[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);
    if (savedToken) {
      try {
        const payload = JSON.parse(atob(savedToken.split(".")[1]));
        setCurrentUserId(payload.userId || null);
      } catch {
        // ignore malformed token payload
      }
      fetchMyRooms(savedToken);
    }
  }, []);

  const handleDeleteRoom = (roomId: number) => {
    setMyRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  const handleLeaveRoom = (roomId: number) => {
    setMyRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  const fetchMyRooms = async (authToken: string) => {
    setLoadingRooms(true);
    try {
      const res = await axios.get(`${HTTP_BACKEND}/rooms`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.data?.rooms) {
        setMyRooms(res.data.rooms);
      }
    } catch {
      // Ignored if fail
    } finally {
      setLoadingRooms(false);
    }
  };

  const generateRandomName = () => {
    const adjectives = [
      "quick",
      "creative",
      "swift",
      "epic",
      "bright",
      "cozy",
      "team",
    ];
    const nouns = [
      "sketch",
      "canvas",
      "wireframe",
      "brainstorm",
      "flow",
      "doodle",
    ];
    const randAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(100 + Math.random() * 900);
    setCreateInput(`${randAdj}-${randNoun}-${num}`);
  };

  const handleJoinRoom = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    const trimmed = joinInput.trim();
    if (!trimmed) {
      setError("Please enter a room name or ID.");
      return;
    }

    if (!token) {
      router.push(`/signin?redirect=/canvas/${encodeURIComponent(trimmed)}`);
      return;
    }

    setLoading(true);
    try {
      const isNumeric = !isNaN(Number(trimmed));
      const payload = isNumeric
        ? { roomId: Number(trimmed) }
        : { slug: trimmed };

      const res = await axios.post(`${HTTP_BACKEND}/room/join`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const targetSlug = res.data?.room?.slug || trimmed;
      router.push(`/canvas/${targetSlug}`);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string; error?: string }>;
      setError(
        axiosErr.response?.data?.error ||
          axiosErr.response?.data?.message ||
          "Room not found. Check the room name or create a new room below.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    const trimmed = createInput.trim();
    if (!trimmed) {
      setError("Please provide a name for the room.");
      return;
    }

    if (!token) {
      router.push("/signin");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${HTTP_BACKEND}/room`,
        { name: trimmed },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const slug = res.data?.slug || trimmed;
      router.push(`/canvas/${slug}`);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string; error?: string }>;
      setError(
        axiosErr.response?.data?.message ||
          axiosErr.response?.data?.error ||
          "Failed to create room. It might already exist, try another name.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="room-hub"
      className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6"
    >
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200/80 rounded-3xl shadow-2xl p-6 sm:p-10 transition-all">
        {/* Header Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-gray-100 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Collaborative Whiteboard
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Jump into an existing room or spin up a new space in seconds.
            </p>
          </div>

          <div className="flex bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200/50">
            <button
              onClick={() => {
                setActiveTab("join");
                setError("");
              }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === "join"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Join Room
            </button>
            <button
              onClick={() => {
                setActiveTab("create");
                setError("");
                if (!createInput) generateRandomName();
              }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "create"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Plus className="w-4 h-4" />
              Create Room
            </button>
          </div>
        </div>

        {/* Tab 1: Join Room */}
        {activeTab === "join" && (
          <JoinRoomForm
            joinInput={joinInput}
            setJoinInput={setJoinInput}
            onSubmit={handleJoinRoom}
            loading={loading}
            error={error}
          />
        )}

        {/* Tab 2: Create Room */}
        {activeTab === "create" && (
          <CreateRoomForm
            createInput={createInput}
            setCreateInput={setCreateInput}
            onGenerateName={generateRandomName}
            onSubmit={handleCreateRoom}
            loading={loading}
            error={error}
          />
        )}

        {/* My Rooms List */}
        {token && (
          <RoomList
            rooms={myRooms}
            loadingRooms={loadingRooms}
            onRefresh={() => fetchMyRooms(token)}
            currentUserId={currentUserId}
            onDeleteRoom={handleDeleteRoom}
            onLeaveRoom={handleLeaveRoom}
          />
        )}

        {/* Not Logged In Prompt */}
        {!token && (
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Don&apos;t have an account yet?</span>
            <div className="flex items-center gap-3">
              <a
                href="/signin"
                className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign in
              </a>
              <span>or</span>
              <a
                href="/signup"
                className="text-blue-600 hover:underline font-semibold"
              >
                Sign up
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
