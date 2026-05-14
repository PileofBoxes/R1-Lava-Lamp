import React from 'react';
import { LavaLamp } from './components/LavaLamp';
import { InstallPrompt } from './components/InstallPrompt';

export default function App() {
  return (
    <div className="relative w-full h-[100dvh] bg-[#0c0c0c] text-white flex flex-col items-center justify-center overflow-hidden">
      {/* Hardware Frame Simulation */}
      <div className="relative z-10 flex flex-col items-center scale-50">
        {/* The "Eye" Viewport */}
        <div className="relative w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full p-4 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] shadow-[0_0_100px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(255,255,255,0.1)]">
          <div className="absolute inset-0 rounded-full border-[12px] border-black/40 z-20 pointer-events-none" />
          <div className="w-full h-full rounded-full overflow-hidden relative">
            <LavaLamp />
          </div>
          {/* Internal Reflection / Glass Effect */}
          <div className="absolute inset-x-8 top-8 h-32 bg-gradient-to-b from-white/10 to-transparent rounded-full blur-2xl pointer-events-none z-30" />
        </div>

        {/* Technical Branding */}
        <div className="mt-12 text-center">
          <header className="mb-6 space-y-1">
            <h1 className="text-3xl font-bold tracking-[0.2em] text-white/90">
              LAVA <span className="text-[#ff4e00]">LAMP</span>
            </h1>
            <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.3em] font-mono text-[#ff4e00]/60 italic font-medium">
              <span>Model.R1</span>
              <span className="w-1 h-1 rounded-full bg-[#ff4e00]/40" />
              <span>OS.CREATION</span>
            </div>
          </header>

          <div className="flex items-center justify-center gap-8 opacity-20 hover:opacity-40 transition-opacity duration-700">
            <div className="text-left font-mono">
              <p className="text-[9px]">TEMP / 42.1</p>
              <div className="w-16 h-1 bg-white/20 mt-1"><div className="w-3/4 h-full bg-[#ff4e00]" /></div>
            </div>
            <div className="text-left font-mono">
              <p className="text-[9px]">DEN / 0.88</p>
              <div className="w-16 h-1 bg-white/20 mt-1"><div className="w-1/2 h-full bg-[#ff4e00]" /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <InstallPrompt />

      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
    </div>
  );
}
