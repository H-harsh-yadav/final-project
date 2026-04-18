"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: pseudoRandom(i * 1.1) * 100,
  y: pseudoRandom(i * 2.2) * 100,
  size: pseudoRandom(i * 3.3) * 3 + 1,
  delay: pseudoRandom(i * 4.4) * 8,
  duration: pseudoRandom(i * 5.5) * 10 + 10,
}));

export function BackgroundEffects() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50 bg-background">
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
        }}
      />

      {/* Primary Aurora Orb — top right */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1.1, 1.25, 1],
          opacity: [0.15, 0.25, 0.18, 0.22, 0.15],
          x: [0, 30, -20, 15, 0],
          y: [0, -20, 10, -15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] rounded-full blur-[150px]"
        style={{
          background: `radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, hsl(var(--neon-cyan) / 0.15) 50%, transparent 70%)`,
        }}
      />

      {/* Secondary Aurora Orb — bottom left */}
      <motion.div
        animate={{
          scale: [1, 1.2, 0.9, 1.15, 1],
          opacity: [0.12, 0.2, 0.14, 0.18, 0.12],
          x: [0, -25, 15, -10, 0],
          y: [0, 15, -20, 10, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute bottom-[-15%] left-[-15%] w-[800px] h-[800px] rounded-full blur-[160px]"
        style={{
          background: `radial-gradient(circle, hsl(var(--neon-magenta) / 0.2) 0%, hsl(var(--primary) / 0.1) 50%, transparent 70%)`,
        }}
      />

      {/* Accent Orb — center */}
      <motion.div
        animate={{
          scale: [1, 1.15, 0.95, 1.1, 1],
          opacity: [0.06, 0.12, 0.08, 0.1, 0.06],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6,
        }}
        className="absolute top-[35%] left-[25%] w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{
          background: `radial-gradient(circle, hsl(var(--neon-cyan) / 0.15) 0%, hsl(var(--neon-blue) / 0.08) 60%, transparent 80%)`,
        }}
      />

      {/* Gold accent — right side */}
      <motion.div
        animate={{
          opacity: [0.04, 0.08, 0.04],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full blur-[100px]"
        style={{
          background: `radial-gradient(circle, hsl(var(--neon-gold) / 0.15) 0%, transparent 70%)`,
        }}
      />

      {/* Floating Micro Particles */}
      {mounted && particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: `${p.x}vw`,
            y: `${p.y}vh`,
            opacity: 0,
          }}
          animate={{
            y: [`${p.y}vh`, `${p.y - 15}vh`, `${p.y}vh`],
            opacity: [0, 0.4, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
          className="absolute rounded-full"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `hsl(var(--primary) / 0.6)`,
            boxShadow: `0 0 ${p.size * 3}px hsl(var(--primary) / 0.3)`,
          }}
        />
      ))}

      {/* Top edge glow line */}
      <div 
        className="absolute top-0 left-0 right-0 h-[1px] opacity-30"
        style={{
          background: `linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.5) 20%, hsl(var(--neon-cyan) / 0.5) 50%, hsl(var(--neon-magenta) / 0.5) 80%, transparent 100%)`,
        }}
      />
    </div>
  );
}
