import React, { useEffect, useRef, useState } from 'react';

// Simple 3-lane endless runner car game rendered to a canvas
// Controls: Left/Right arrows or A/D to change lanes.

const LANES = [0.2, 0.5, 0.8]; // normalized x positions
const ROAD_COLOR = '#1a1a1a';
const LINE_COLOR = '#3a3a3a';
const PLAYER_COLOR = '#ff4d4d';
const ENEMY_COLOR = '#3dd9eb';
const BOOST_COLOR = '#ffd166';

function drawRoundedRect(ctx, x, y, w, h, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

export default function GameCanvas() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem('bestScore') || 0));
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState('Press Space to start');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animation;

    // Game state
    let laneIndex = 1;
    let speed = 5; // px per frame baseline
    let roadOffset = 0;
    let entities = []; // enemies and boosts

    const spawnEntity = () => {
      const isBoost = Math.random() < 0.2; // 20% chance boost
      const lane = Math.floor(Math.random() * 3);
      entities.push({
        type: isBoost ? 'boost' : 'enemy',
        lane,
        y: -60,
        h: 60,
        w: 36,
      });
    };

    let spawnTimer = 0;

    const onKey = (e) => {
      if (e.type === 'keydown') {
        if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') laneIndex = Math.max(0, laneIndex - 1);
        if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') laneIndex = Math.min(2, laneIndex + 1);
        if (e.code === 'Space') {
          if (!playing) {
            setScore(0);
            setPlaying(true);
            setMessage('');
            entities = [];
            spawnTimer = 0;
            speed = 5;
          }
        }
      }
    };

    window.addEventListener('keydown', onKey);

    const loop = () => {
      const W = (canvas.width = canvas.clientWidth);
      const H = (canvas.height = 520);
      ctx.clearRect(0, 0, W, H);

      // Draw road background
      ctx.fillStyle = ROAD_COLOR;
      const roadW = Math.min(W * 0.9, 560);
      const roadX = (W - roadW) / 2;
      drawRoundedRect(ctx, roadX, 0, roadW, H, 16, ROAD_COLOR);

      // Lane dividers
      ctx.strokeStyle = LINE_COLOR;
      ctx.lineWidth = 4;
      ctx.setLineDash([16, 18]);
      roadOffset = (roadOffset + speed) % 34;
      ctx.lineDashOffset = -roadOffset;
      for (let i = 1; i <= 2; i++) {
        const x = roadX + (roadW * i) / 3;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Player car
      const playerW = 38;
      const playerH = 64;
      const px = roadX + roadW * LANES[laneIndex] - playerW / 2;
      const py = H - playerH - 24;
      drawRoundedRect(ctx, px, py, playerW, playerH, 10, PLAYER_COLOR);

      if (playing) {
        // Spawn logic
        spawnTimer -= 1;
        if (spawnTimer <= 0) {
          spawnEntity();
          spawnTimer = Math.max(18, 48 - Math.floor(score / 50));
        }

        // Update entities
        entities.forEach((en) => {
          en.y += speed + (en.type === 'boost' ? 0.5 : 1.5);
        });

        // Collision and cleanup
        const remaining = [];
        entities.forEach((en) => {
          const ex = roadX + roadW * LANES[en.lane] - en.w / 2;
          const ey = en.y;
          const collided = !(
            px > ex + en.w ||
            px + playerW < ex ||
            py > ey + en.h ||
            py + playerH < ey
          );

          if (collided) {
            if (en.type === 'enemy') {
              // game over
              setPlaying(false);
              setMessage('Crashed! Press Space to try again');
              setBest((prev) => {
                const newBest = Math.max(prev, score);
                localStorage.setItem('bestScore', String(newBest));
                return newBest;
              });
            } else {
              // boost
              speed = Math.min(12, speed + 0.8);
              setScore((s) => s + 25);
            }
          } else if (ey < H + 80) {
            remaining.push(en);
          }
        });
        entities = remaining;

        // Score and difficulty
        setScore((s) => s + 1);
        if (score % 120 === 0) speed = Math.min(12, speed + 0.3);
      }

      // HUD
      ctx.fillStyle = 'white';
      ctx.font = '600 18px Inter, system-ui, -apple-system, Segoe UI, Roboto';
      ctx.fillText(`Score: ${score}`, roadX + 12, 28);
      ctx.fillStyle = '#bdbdbd';
      ctx.fillText(`Best: ${best}`, roadX + 12, 52);

      if (message) {
        ctx.fillStyle = 'white';
        ctx.font = '700 22px Inter, system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(message, W / 2, 80);
        ctx.textAlign = 'start';
      }

      animation = requestAnimationFrame(loop);
    };

    animation = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', onKey);
      cancelAnimationFrame(animation);
    };
  }, [playing, best, score]);

  return (
    <div id="play" className="w-full">
      <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-4">
        <canvas ref={canvasRef} className="w-full h-[520px] rounded-md bg-neutral-900" />
        <div className="mt-4 flex items-center justify-between text-sm text-neutral-300">
          <p>Controls: Arrow keys or A/D to change lanes. Space to start.</p>
          <button
            onClick={() => {
              // toggle start
              if (!playing) setScore(0);
              setPlaying((p) => !p);
              if (playing) {
                // stopping mid-run
                localStorage.setItem('bestScore', String(Math.max(best, score)));
                setBest(Math.max(best, score));
              } else {
                // starting
                // message cleared by game loop
              }
            }}
            className="rounded-md bg-white text-neutral-900 px-3 py-1.5 font-medium hover:opacity-90"
          >
            {playing ? 'Pause' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
}
