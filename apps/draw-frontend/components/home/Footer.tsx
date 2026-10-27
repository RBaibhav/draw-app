import { Pencil } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Pencil className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white">Draw App</span>
          </div>
          <p className="text-xs text-gray-500">
            Collaborative whiteboard application. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
