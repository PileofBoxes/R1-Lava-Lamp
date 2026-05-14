import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, X, Info, Download } from 'lucide-react';

export const InstallPrompt = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const origin = (typeof window !== 'undefined' ? window.location.origin : '') || process.env.APP_URL || '';
  const isDevUrl = origin.includes('ais-dev-');
  const url = origin.endsWith('/') ? origin : `${origin}/`;
  
  // Rabbit R1 creation installation format (JSON in QR code)
  const qrData = JSON.stringify({
    title: "Lava Lamp",
    url: url,
    description: "An organic lava lamp simulation.",
    iconUrl: "https://img.icons8.com/color/96/000000/fire-element.png",
    themeColor: "#FF4E00"
  });

  return (
    <>
      <button
        id="install-btn"
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-50 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full text-white transition-all border border-white/20 shadow-[0_0_20px_rgba(255,78,0,0.2)] group pointer-events-auto"
        title="Install on Rabbit R1"
      >
        <QrCode className="w-6 h-6 group-hover:scale-110 transition-transform text-[#ff4e00]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0f0f0f] p-10 rounded-[2.5rem] border border-white/10 w-full max-w-sm shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#ff4e00]/10 blur-[80px] rounded-full" />
              
              <div className="relative z-10 flex flex-col items-center gap-8">
                <div className="flex justify-between items-center w-full">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                       Install
                    </h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-mono mt-1">Rabbit R1 Creation</p>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {isDevUrl && (
                  <div className="w-full p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-400 font-mono">
                    ⚠️ WARNING: You are on a DEV URL. Use the SHARED URL for the QR code to work properly on R1.
                  </div>
                )}

                <div className="bg-white p-5 rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.1)] group transition-all hover:scale-[1.02]">
                    <QRCodeSVG 
                      value={qrData} 
                      size={220}
                      level="H"
                      includeMargin={false}
                    />
                </div>

                <div className="space-y-6 text-center">
                  <div className="space-y-2">
                    <p className="text-white/80 text-sm leading-relaxed">
                      Scan with your <span className="text-[#ff4e00] font-semibold">Rabbit R1</span> Camera
                    </p>
                    <div className="flex justify-center gap-2">
                      <span className="px-2 py-0.5 bg-white/5 rounded text-[8px] font-mono text-white/40">GATEWAY.TR</span>
                      <span className="px-2 py-0.5 bg-white/5 rounded text-[8px] font-mono text-[#ff4e00]/60">VERIFIED</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-left flex flex-col gap-3">
                    <div className="flex gap-3 items-start">
                      <Info className="w-4 h-4 text-[#ff4e00] shrink-0 mt-0.5" />
                      <p className="text-[10px] text-white/50 leading-tight">
                        Point your Rabbit R1 camera at this code. Swipe left and tap the "Scan" icon to install.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start border-t border-white/5 pt-3">
                      <Download className="w-3 h-3 text-white/30 shrink-0 mt-0.5" />
                      <p className="text-[9px] text-white/30 leading-tight">
                        If you see "Authenticate in new window" on your R1, it means the Google AI Studio security gate is active. Use a <b>Public Shared URL</b> or click "Enter App" if possible.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-white/5 font-mono text-[8px] text-white/20 break-all">
                      HOST: {origin}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
