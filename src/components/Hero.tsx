import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cpu, Server, Zap, Shield, HelpCircle } from 'lucide-react';

interface HeroProps {
  siteName: string;
  themeColor: string;
  onPageChange: (page: 'home' | 'plans' | 'status' | 'reviews' | 'faq' | 'portal') => void;
}

const getAccentColor = (color: string) => {
  switch (color) {
    case 'violet':
      return {
        text: 'text-violet-400',
        textMuted: 'text-violet-500',
        bg: 'bg-violet-400',
        bgHover: 'hover:bg-violet-300',
        bgMuted: 'bg-violet-400/10',
        border: 'border-violet-400',
        borderMuted: 'border-violet-400/20',
        shadow: 'shadow-[0_0_20px_rgba(139,92,246,0.25)]',
        accent: 'violet-400',
        glow: 'bg-violet-400/10',
        glowMini: 'bg-violet-400/5',
        starHex: '#a78bfa'
      };
    case 'emerald':
      return {
        text: 'text-emerald-400',
        textMuted: 'text-emerald-500',
        bg: 'bg-emerald-400',
        bgHover: 'hover:bg-emerald-300',
        bgMuted: 'bg-emerald-400/10',
        border: 'border-emerald-400',
        borderMuted: 'border-emerald-400/20',
        shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
        accent: 'emerald-400',
        glow: 'bg-emerald-400/10',
        glowMini: 'bg-emerald-400/5',
        starHex: '#34d399'
      };
    case 'cyan':
      return {
        text: 'text-cyan-400',
        textMuted: 'text-cyan-500',
        bg: 'bg-cyan-400',
        bgHover: 'hover:bg-cyan-300',
        bgMuted: 'bg-cyan-400/10',
        border: 'border-cyan-400',
        borderMuted: 'border-cyan-400/20',
        shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]',
        accent: 'cyan-400',
        glow: 'bg-cyan-400/10',
        glowMini: 'bg-cyan-400/5',
        starHex: '#22d3ee'
      };
    case 'rose':
      return {
        text: 'text-rose-400',
        textMuted: 'text-rose-500',
        bg: 'bg-rose-400',
        bgHover: 'hover:bg-rose-300',
        bgMuted: 'bg-rose-400/10',
        border: 'border-rose-400',
        borderMuted: 'border-rose-400/20',
        shadow: 'shadow-[0_0_20px_rgba(251,113,133,0.25)]',
        accent: 'rose-400',
        glow: 'bg-rose-400/10',
        glowMini: 'bg-rose-400/5',
        starHex: '#fb7185'
      };
    case 'yellow':
    default:
      return {
        text: 'text-yellow-400',
        textMuted: 'text-yellow-500',
        bg: 'bg-yellow-400',
        bgHover: 'hover:bg-yellow-300',
        bgMuted: 'bg-yellow-400/10',
        border: 'border-yellow-400',
        borderMuted: 'border-yellow-400/20',
        shadow: 'shadow-[0_0_20px_rgba(250,204,21,0.25)]',
        accent: 'yellow-400',
        glow: 'bg-yellow-400/10',
        glowMini: 'bg-yellow-400/5',
        starHex: '#facc15'
      };
  }
}

export default function Hero({ siteName, themeColor, onPageChange }: HeroProps) {
  const [latencyResult, setLatencyResult] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [activeServerCount, setActiveServerCount] = useState(8412);

  const colors = getAccentColor(themeColor);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveServerCount(prev => prev + Math.floor(Math.random() * 2) + 1);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const runPingTest = () => {
    setIsPinging(true);
    setLatencyResult(null);
    setTimeout(() => {
      const realisticFastPing = Math.floor(Math.random() * 8) + 9;
      setLatencyResult(realisticFastPing);
      setIsPinging(false);
    }, 1200);
  };

  const halfBrandedHeadline = () => {
    return (
      <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black italic uppercase leading-none tracking-tighter mb-4 text-white">
        Unleash <br />
        <span style={{ color: colors.starHex }}>Performance</span>
      </h1>
    );
  };

  return (
    <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28 bg-[#0A0A0A]">
      {/* Background radial theme glows */}
      <div className={`absolute top-1/4 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full ${colors.glow} blur-[120px]`} />
      <div className={`absolute top-10 right-10 -z-10 h-[300px] w-[300px] rounded-full ${colors.glowMini} blur-[80px]`} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Hero Left Content - Main Messaging & Badges */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Promo banner with a high-contrast dynamic theme badge */}
            <div 
              className="inline-block px-3 py-1 mb-4 border rounded text-xs font-bold uppercase tracking-widest animate-pulse-glow"
              style={{ 
                color: colors.starHex, 
                borderColor: colors.starHex + '33', 
                backgroundColor: colors.starHex + '11' 
              }}
            >
              Premium Hosting Solutions
            </div>

            {halfBrandedHeadline()}

            {/* Subtext description */}
            <p className="font-sans text-base sm:text-lg text-gray-400 max-w-xl leading-relaxed">
              Deploy enterprise-grade servers in seconds. Optimized for low-latency gaming and high-performance cloud applications. Underpinned by physical 12+ Tbps anti-DDoS scrubbers and lightning-fast DDR5 RAM.
            </p>

            {/* Single button changing to only "View Plans" and showing the dynamic plans inside the portal */}
            <div className="flex flex-wrap gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange('plans')}
                className="w-full sm:w-auto text-center rounded-full px-10 py-4 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer outline-none"
                style={{ backgroundColor: colors.starHex, boxShadow: `0 0 25px ${colors.starHex}55` }}
              >
                <span>View Plans</span>
                <Server className="h-4 w-4 text-black transition-transform group-hover:scale-110" />
              </motion.button>
            </div>

            {/* Highly polished 3 metrics inline section */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div 
                className="bg-white/[0.03] border border-white/5 rounded-xl p-4 transition-all hover:bg-white/[0.05] text-left"
                style={{ contentVisibility: 'auto' }}
              >
                <p className="font-display text-2xl sm:text-3xl font-black font-mono tracking-tight leading-none" style={{ color: colors.starHex }}>
                  {activeServerCount.toLocaleString()}
                </p>
                <p className="text-[9px] text-gray-500 font-mono mt-2 uppercase tracking-wider font-bold">Active Nodes</p>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 transition-all hover:bg-white/[0.05] text-left">
                <p className="font-display text-2xl sm:text-3xl font-black text-white font-mono tracking-tight leading-none">
                  99.9%
                </p>
                <p className="text-[9px] text-gray-500 font-mono mt-2 uppercase tracking-wider font-bold">Uptime SLA</p>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 transition-all hover:bg-white/[0.05] text-left">
                <p className="font-display text-2xl sm:text-3xl font-black text-white font-mono tracking-tight leading-none">
                  &lt;60s
                </p>
                <p className="text-[9px] text-gray-500 font-mono mt-2 uppercase tracking-wider font-bold">Setup Speed</p>
              </div>
            </div>

          </div>

          {/* Hero Right Content - Interactive Latency Checker */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            
            <div className="absolute inset-x-0 -top-4 -bottom-4 bg-gradient-to-tr from-white/5 to-transparent rounded-3xl blur-2xl pointer-events-none" />
            
            {/* Main Interactive Panel card */}
            <div className={`relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl overflow-hidden group transition-all`}>
              
              <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-white/10 to-transparent pointer-events-none" />
              
              {/* Card Title bar resembling developer interface */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <span className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="font-mono text-xs text-gray-400 ml-2">speedtest.sh</span>
                </div>
                <div 
                  className="rounded px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest border"
                  style={{ color: colors.starHex, borderColor: colors.starHex + '33', backgroundColor: colors.starHex + '11' }}
                >
                  LIVE TELEMETRY
                </div>
              </div>

              {/* Server visual mock details */}
              <div className="space-y-4">
                <div className="rounded-lg bg-[#0A0A0A]/60 p-4 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5" style={{ color: colors.starHex }}>
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono uppercase tracking-widest">Core Frequency</h4>
                      <p className="text-[10px] text-zinc-400 font-mono">Ryzen 9 7950X Performance boost</p>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '42%' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: colors.starHex }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1 text-[9px] text-zinc-500 font-mono">
                    <span>Node Core Load: 42%</span>
                    <span>1.2 Million IOPS</span>
                  </div>
                </div>

                {/* Simulated test latency component */}
                <div className="rounded-lg bg-black/40 p-4 border border-white/5 text-center space-y-3">
                  <p className="text-xs font-mono text-zinc-300">
                    Curious about transit latency? Ping our active edge:
                  </p>
                  
                  <div className="flex items-center justify-center min-h-[50px] bg-[#0A0A0A]/80 rounded border border-white/5 font-mono">
                    {isPinging ? (
                      <div className="flex items-center gap-2 text-xs" style={{ color: colors.starHex }}>
                        <span className="h-4 w-4 animate-spin rounded-full border border-t-transparent" style={{ borderColor: colors.starHex }} />
                        Analyzing hop routing protocols...
                      </div>
                    ) : latencyResult !== null ? (
                      <div className="text-center">
                        <p className="text-2xl font-black font-mono italic" style={{ color: colors.starHex }}>
                          {latencyResult} ms
                        </p>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mt-1">
                          Blazing Ultra Low-Latency Edge
                        </p>
                      </div>
                    ) : (
                      <span className="text-zinc-500 text-xs font-mono uppercase tracking-wider">Awaiting network probe</span>
                    )}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={runPingTest}
                    disabled={isPinging}
                    className="w-full rounded-xl bg-white/5 border border-white/10 text-white py-2 text-xs font-bold font-mono tracking-widest uppercase cursor-pointer outline-none hover:bg-white/10"
                  >
                    {isPinging ? 'ANALYZING...' : 'RUN SPEEDTEST'}
                  </motion.button>
                </div>
              </div>

              {/* Technical disclaimer below card */}
              <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  DDoS Status: Active Filter
                </span>
                <span>Port 3000 secure</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
