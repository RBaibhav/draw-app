import { Pencil, Users, Zap, Lock } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white border-t border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Built for effortless teamwork
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Everything you need to sketch, collaborate, and share with your
            teammates in seconds.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-gray-50 hover:bg-blue-50/50 border border-gray-200/60 transition group">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Pencil className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Vector & Freehand Tools
            </h3>
            <p className="text-sm text-gray-600">
              Draw rectangles, circles, straight lines, or freely sketch with
              pencil and eraser tools.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 border border-gray-200/60 transition group">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Rooms & Multiplayer
            </h3>
            <p className="text-sm text-gray-600">
              Create dedicated rooms or join by room code. Real-time updates
              push instantly across all screens.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 hover:bg-purple-50/50 border border-gray-200/60 transition group">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Lightning Fast WebSockets
            </h3>
            <p className="text-sm text-gray-600">
              Low-latency WebSocket sync guarantees zero lag during drawing
              sessions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 hover:bg-amber-50/50 border border-gray-200/60 transition group">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Lock className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Persistent Database
            </h3>
            <p className="text-sm text-gray-600">
              All strokes and shapes are stored safely in PostgreSQL. Rejoin
              anytime and your work is preserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
