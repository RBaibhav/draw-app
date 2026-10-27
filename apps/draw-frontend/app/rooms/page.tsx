import { RoomHub } from "@/components/rooms";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

export default function RoomsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/80 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Pencil className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight">
                Draw App
              </span>
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <RoomHub />
      </main>
    </div>
  );
}
