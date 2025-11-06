import React from 'react';
import { Rocket, Trophy } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 bg-neutral-950/80 border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-orange-400 text-white">
            <Rocket size={18} />
          </div>
          <span className="font-semibold tracking-tight">Turbo Race</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
          <a href="#play" className="hover:text-white transition">Play</a>
          <a href="#how" className="hover:text-white transition">How it works</a>
          <a href="#score" className="hover:text-white transition flex items-center gap-1"><Trophy size={16}/>High score</a>
        </nav>

        <a href="#play" className="inline-flex items-center gap-2 rounded-md px-3 py-2 bg-white text-neutral-900 text-sm font-medium hover:opacity-90 transition">
          Play now
        </a>
      </div>
    </header>
  );
}
