import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeroSpline() {
  return (
    <div className="relative w-full h-full" id="hero">
      <Spline scene="https://prod.spline.design/8fw9Z-c-rqW3nWBN/scene.splinecode" style={{ width: '100%', height: '100%' }} />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      <div className="absolute inset-x-0 bottom-8 flex justify-center px-4">
        <div className="pointer-events-none max-w-3xl text-center">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-4">
            Two Cars. One Track. Pure Speed.
          </h1>
          <p className="text-neutral-300">
            Interactive 3D hero powered by Spline — drag to explore the scene, then jump into the arcade mode below.
          </p>
        </div>
      </div>
    </div>
  );
}
