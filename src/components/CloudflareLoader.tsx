import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CloudflareLoaderProps {
  onComplete?: () => void;
  siteName?: string;
  themeColor?: string;
}

const STAGES = [
  { text: 'Analyzing browser handshake connection...', duration: 550 },
  { text: 'Verifying network path integrity & routing...', duration: 500 },
  { text: 'Applying VxShield global DDoS protection filters...', duration: 600 },
  { text: 'Security check passed. Establishing live web socket...', duration: 450 }
];

export default function CloudflareLoader({ onComplete, siteName = 'VxHost', themeColor = 'yellow' }: CloudflareLoaderProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [ipAddress, setIpAddress] = useState('157.48.204.19');
  const [rayId, setRayId] = useState('');

  // Generate randomized Ray ID and mock browser IP on load
  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdef';
    const randRay = Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setRayId(`${randRay.substring(0, 8)}-${randRay.substring(8, 12)}-${randRay.substring(12, 16)}`);

    // Fetch random public-looking IP or randomize slightly for realism
    const ipParts = [
      Math.floor(Math.random() * 80) + 100,
      Math.floor(Math.random() * 200) + 20,
      Math.floor(Math.random() * 250),
      Math.floor(Math.random() * 250)
    ];
    setIpAddress(ipParts.join('.'));
  }, []);

  // Handle stage transitions and progress updates
  useEffect(() => {
    let active = true;
    let stageIndex = 0;
    
    const runStages = async () => {
      for (const stage of STAGES) {
        if (!active) break;
        setCurrentStage(stageIndex);
        
        // Dynamic increments of progress bar
        const incrementSteps = 5;
        const stepDuration = stage.duration / incrementSteps;
        for (let i = 0; i < incrementSteps; i++) {
          await new Promise(resolve => setTimeout(resolve, stepDuration));
          if (!active) return;
          setProgress(prev => Math.min(99, prev + Math.floor(100 / (STAGES.length * incrementSteps))));
        }
        
        stageIndex++;
      }
      
      if (active) {
        setProgress(100);
        // Let it rest at 100% for brief moments
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 400);
      }
    };

    runStages();

    return () => {
      active = false;
    };
  }, [onComplete]);

  const getAccentHex = () => {
    switch (themeColor) {
      case 'violet': return '#a78bfa';
      case 'emerald': return '#34d399';
      case 'cyan': return '#22d3ee';
      case 'rose': return '#fb7185';
      case 'yellow':
      default:
        return '#facc15';
    }
  };

  const activeColorStr = getAccentHex();

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#07070a] text-zinc-100 flex flex-col items-center justify-center p-6 select-none font-sans"
      id="cloudflare-preloader"
    >
      {/* Background grids and blurs */}
      <div className="absolute inset-0 bg-[#07070a]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f15_1px,transparent_1px),linear-gradient(to_bottom,#0f0f15_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full filter blur-[120px] opacity-[0.06] pointer-events-none" 
           style={{ backgroundColor: activeColorStr }} />

      <div className="relative z-10 w-full max-w-lg space-y-8 text-center">
        {/* Animated Radar Scanning Loop */}
        <div className="flex justify-center relative">
          <div className="relative h-24 w-24 flex items-center justify-center">
            {/* Pulsing rings */}
            <span className="absolute inset-0 rounded-full border border-white/5 opacity-40 animate-ping duration-1000 scale-[1.3]" />
            <span className="absolute inset-2 rounded-full border border-white/10 opacity-60 animate-pulse" />
            
            {/* Spinning background radar ring */}
            <div 
              className="absolute inset-1 rounded-full border border-dashed opacity-40 animate-spin"
              style={{ borderColor: activeColorStr }}
            />
            
            <div className="h-16 w-16 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-center shadow-2xl relative">
              <ShieldCheck className="h-8 w-8 text-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Brand & Main Check Content */}
        <div className="space-y-3">
          <h2 className="font-display text-2xl sm:text-3xl font-black italic uppercase leading-none tracking-tighter text-white">
            Security Clearance check
          </h2>
          <p className="text-zinc-400 text-xs sm:text-xs font-mono max-w-sm mx-auto leading-relaxed">
            Please wait while we verify your secure route gateway connection to <span className="text-white font-bold">{siteName}</span> nodes.
          </p>
        </div>

        {/* Dynamic checking message block */}
        <div className="bg-[#0b0b0e] border border-white/5 rounded-2xl p-5 mx-auto max-w-md shadow-xl text-left font-mono space-y-4">
          <div className="flex items-start gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mt-1.5 shrink-0" />
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Connection status</span>
              <span className="text-xs text-zinc-200">
                {STAGES[currentStage]?.text}
              </span>
            </div>
          </div>

          {/* Progress bar container */}
          <div className="space-y-1 bg-black/40 p-1.5 rounded-lg border border-white/5">
            <div className="flex justify-between text-[9px] text-zinc-500">
              <span className="uppercase">VxShield Integrity</span>
              <span>{progress}%</span>
            </div>
            
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full rounded-full transition-all duration-300"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: activeColorStr
                }}
              />
            </div>
          </div>

          {/* Device metadata display block */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] border-t border-white/5 text-zinc-500">
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-zinc-600">Client IP Address</span>
              <span className="text-zinc-300 font-bold">{ipAddress}</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-zinc-600">Secure Ray ID</span>
              <span className="text-zinc-300 font-bold">{rayId}</span>
            </div>
          </div>
        </div>

        {/* Footer info lockup */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-center gap-2">
            <Network className="h-3.5 w-3.5" />
            <span>DDoS Protection & Transit Guard by VxHost Global Network LLC.</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono font-bold">Made by TheRynzo</span>
        </div>
      </div>
    </div>
  );
}
