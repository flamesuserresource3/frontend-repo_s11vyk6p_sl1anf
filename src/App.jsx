import React from 'react';
import Header from './components/Header.jsx';
import HeroSpline from './components/HeroSpline.jsx';
import GameCanvas from './components/GameCanvas.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white">
      <Header />

      <main className="flex-1">
        <section className="relative h-[70vh] w-full overflow-hidden">
          <HeroSpline />
        </section>

        <section className="py-16 bg-gradient-to-b from-neutral-950 to-neutral-900">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
                Turbo Race — Arcade Car Dodger
              </h2>
              <p className="text-neutral-300 mb-8 max-w-3xl">
                Use the arrow keys or A/D to switch lanes and dodge incoming traffic. Collect boosts, keep your streak, and see how long you can survive. Built for keyboard play — quick, responsive, and all in your browser.
              </p>
              <GameCanvas />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
