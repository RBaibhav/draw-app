"use client";

import { useEffect, useState } from "react";
import {
  Navbar,
  HeroSection,
  FeaturesSection,
  Footer,
} from "@/components/home";
import { RoomHub } from "@/components/rooms";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.reload();
  };

  const scrollToRoomHub = () => {
    const el = document.getElementById("room-hub");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar
        token={token}
        onLogout={handleLogout}
        onScrollToRoomHub={scrollToRoomHub}
      />

      <main className="pt-16">
        <HeroSection token={token} onScrollToRoomHub={scrollToRoomHub} />

        <section className="py-8">
          <RoomHub />
        </section>

        <FeaturesSection />
      </main>

      <Footer />
    </div>
  );
}
