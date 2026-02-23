import {
  Pencil,
  Users,
  Zap,
  Download,
  Github,
  Layers,
  Lock,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Pencil className="w-8 h-8 text-blue-600" strokeWidth={2.5} />
              <span className="text-2xl font-bold text-gray-900">
                Excalidraw
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                About
              </a>
              <a
                href="https://github.com"
                className="text-gray-600 hover:text-gray-900 transition flex items-center space-x-1"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                Start Drawing
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-block">
                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                    Free & Open Source
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Virtual whiteboard for sketching hand-drawn diagrams
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Collaborative and end-to-end encrypted. Create beautiful
                  hand-drawn like diagrams, wireframes, or whatever you like.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={"/signup"}>
                    <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Sign Up
                    </button>
                  </Link>
                  <Link href={"/signin"}>
                    <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition font-semibold text-lg">
                      Sign In
                    </button>
                  </Link>
                </div>
                <div className="flex items-center space-x-8 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>100% free forever</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-6">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-24 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg border-2 border-blue-300 transform -rotate-1"></div>
                      <div className="h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-300 transform rotate-1"></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg border-2 border-orange-300"></div>
                        <div className="h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg border-2 border-pink-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cyan-200 rounded-full blur-3xl opacity-50"></div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Everything you need to create
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Powerful features that make diagramming effortless and
                collaborative
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group p-6 rounded-xl hover:bg-gray-50 transition">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Pencil className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Hand-drawn Style
                </h3>
                <p className="text-gray-600">
                  Beautiful sketchy, hand-drawn like style that makes your
                  diagrams stand out
                </p>
              </div>

              <div className="group p-6 rounded-xl hover:bg-gray-50 transition">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Real-time Collaboration
                </h3>
                <p className="text-gray-600">
                  Work together with your team in real-time with live cursors
                  and updates
                </p>
              </div>

              <div className="group p-6 rounded-xl hover:bg-gray-50 transition">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Lightning Fast
                </h3>
                <p className="text-gray-600">
                  Optimized performance ensures smooth drawing even with complex
                  diagrams
                </p>
              </div>

              <div className="group p-6 rounded-xl hover:bg-gray-50 transition">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Lock className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  End-to-End Encrypted
                </h3>
                <p className="text-gray-600">
                  Your data is encrypted and private. We can't see what you
                  create
                </p>
              </div>

              <div className="group p-6 rounded-xl hover:bg-gray-50 transition">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Download className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Export Anywhere
                </h3>
                <p className="text-gray-600">
                  Export to PNG, SVG, or clipboard. Integrate with your favorite
                  tools
                </p>
              </div>

              <div className="group p-6 rounded-xl hover:bg-gray-50 transition">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Layers className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Libraries & Templates
                </h3>
                <p className="text-gray-600">
                  Access shape libraries and templates to speed up your workflow
                </p>
              </div>

              <div className="group p-6 rounded-xl hover:bg-gray-50 transition">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Smartphone className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Mobile Ready
                </h3>
                <p className="text-gray-600">
                  Works perfectly on tablets and mobile devices for drawing on
                  the go
                </p>
              </div>

              <div className="group p-6 rounded-xl hover:bg-gray-50 transition">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Github className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Open Source
                </h3>
                <p className="text-gray-600">
                  Fully open source and community-driven. Contribute and
                  customize freely
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Start creating amazing diagrams today
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of users who trust Excalidraw for their visual
              collaboration needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition font-semibold text-lg shadow-xl">
                Get Started Free
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition font-semibold text-lg">
                View Documentation
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Pencil className="w-6 h-6 text-blue-500" />
                <span className="text-xl font-bold text-white">Excalidraw</span>
              </div>
              <p className="text-sm">
                The open source virtual whiteboard for sketching hand-drawn like
                diagrams
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>&copy; 2024 Excalidraw. Open source under MIT License.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
