import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { r1, initializeR1 } from 'r1-create';

const COLORS = [
  '#ff4e00', // Orange
  '#ff0095', // Pink
  '#8a2be2', // Purple
  '#00d4ff', // Cyan
  '#00ff88', // Green
  '#ffea00', // Yellow
  '#ff3333', // Red
];

const Blob = ({ colorOverride }: { colorOverride?: string }) => {
  const baseColor = useMemo(() => COLORS[Math.floor(Math.random() * COLORS.length)], []);
  const color = colorOverride || baseColor;
  const duration = useMemo(() => 10 + Math.random() * 14, []); 
  const size = useMemo(() => 50 + Math.random() * 80, []);
  const delay = useMemo(() => Math.random() * -duration, []); 
  const xCenter = useMemo(() => Math.random() * 60 + 20, []); 
  const xRadius = useMemo(() => 8 + Math.random() * 15, []); 

  return (
    <motion.div
      className="absolute rounded-full mix-blend-screen cursor-pointer pointer-events-auto"
      initial={{ x: `${xCenter - xRadius}%`, y: '120%', scale: 0.8, opacity: 0.5 }}
      animate={{
        y: ['120%', '-30%', '120%'],
        x: [
          `${xCenter - xRadius}%`, 
          `${xCenter}%`, 
          `${xCenter + xRadius}%`, 
          `${xCenter}%`, 
          `${xCenter - xRadius}%`
        ],
        scale: [0.7, 1.1, 1.3, 1.1, 0.7],
        opacity: [0.3, 0.6, 0.8, 0.5, 0.3],
      }}
      whileTap={{ 
        scale: 1.6,
        y: "-=15%",
        transition: { type: "spring", stiffness: 300, damping: 12 }
      }}
      whileHover={{
        scale: 1.15,
        opacity: 0.9,
      }}
      transition={{
        y: {
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          delay: delay,
        },
        x: {
          duration: duration * 0.9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay,
        },
        scale: {
          duration: duration * 0.9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay,
        },
        opacity: {
          duration: duration * 0.9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay,
        }
      }}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        filter: 'blur(10px)',
        boxShadow: `0 0 25px ${color}44`,
      }}
    />
  );
};

export const LavaLamp = () => {
  const [blobCount] = useState(14);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [colorIndex, setColorIndex] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const startR1 = async () => {
      try {
        await initializeR1();
        
        // Listen for scroll to cycle colors
        r1.deviceControls.on('scrollWheel', (data) => {
          if (typeof data === 'object' && data.direction === 'down') {
            setColorIndex(prev => (prev + 1) % COLORS.length);
          } else {
            setColorIndex(prev => (prev - 1 + COLORS.length) % COLORS.length);
          }
          try { r1.speaker.playTone(440, 30, 0.1); } catch(e) {}
        });

        // Listen for side button to reset
        r1.deviceControls.on('sideButton', () => {
          setResetKey(prev => prev + 1);
          try { r1.speaker.playTone(220, 100, 0.1); } catch(e) {}
        });

      } catch (err) {
        console.warn('R1 SDK not initialized - typical for non-R1 environments');
      }
    };

    startR1();
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const id = Date.now();
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 1000);

    try { r1.speaker.playTone(660, 50, 0.05); } catch(e) {}
  };

  return (
    <div 
      className="relative w-full h-full bg-[#120805] overflow-visible cursor-crosshair touch-none"
      onPointerDown={handlePointerDown}
    >
      {/* Background glow gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#2d120a_0%,#120805_70%)]" />

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full border border-[#ff4e00]/30 pointer-events-none z-10"
          initial={{ width: 0, height: 0, x: ripple.x, y: ripple.y, opacity: 0.8, scale: 0 }}
          animate={{ width: 400, height: 400, x: ripple.x - 200, y: ripple.y - 200, opacity: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}

      {/* SVG filter for the gooey effect */}
      <svg className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div 
        key={resetKey}
        className="w-full h-full relative"
        style={{ filter: 'url(#goo)' }}
      >
        {/* Base pools */}
        <motion.div 
          className="absolute bottom-[-30px] left-[-15%] w-[130%] h-28 bg-[#ff4e00] blur-2xl opacity-35"
          animate={{ scaleY: [1, 1.08, 0.97, 1], backgroundColor: COLORS[colorIndex] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* The blobs */}
        {Array.from({ length: blobCount }).map((_, i) => (
          <Blob key={`${resetKey}-${i}`} colorOverride={i % 2 === 0 ? COLORS[colorIndex] : undefined} />
        ))}
      </div>

      {/* Atmospheric highlights */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#ff4e00]/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,100,50,0.08),transparent_80%)] pointer-events-none" />
      
      {/* R1 Controls Help */}
      <div className="absolute bottom-4 right-4 opacity-30 pointer-events-none text-[8px] uppercase tracking-widest text-[#ff4e00] flex flex-col items-end font-mono">
        <span>Scroll: Cycle Colors</span>
        <span>Side: Reset Blobs</span>
      </div>
    </div>
  );
};
