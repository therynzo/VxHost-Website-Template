import React, { useState, useEffect } from 'react';
import { Server, Activity, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

interface NodeStatus {
  name: string;
  flag: string;
  location: string;
  status: 'ONLINE' | 'MAINTENANCE' | 'DEGRADED';
  cpu: number;
  ram: number;
  networkIn: number; // Gbps
  networkOut: number; // Gbps
}

interface NodeStatsProps {
  themeColor: string;
  onPageChange?: (page: 'home' | 'plans' | 'status' | 'reviews' | 'faq' | 'portal') => void;
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
        borderMuted: 'border-white/10 hover:border-violet-400/40',
        starHex: '#a78bfa',
      };
    case 'emerald':
      return {
        text: 'text-emerald-400',
        textMuted: 'text-emerald-500',
        bg: 'bg-emerald-400',
        bgHover: 'hover:bg-emerald-300',
        bgMuted: 'bg-emerald-400/10',
        border: 'border-emerald-400',
        borderMuted: 'border-white/10 hover:border-emerald-400/40',
        starHex: '#34d399',
      };
    case 'cyan':
      return {
        text: 'text-cyan-400',
        textMuted: 'text-cyan-500',
        bg: 'bg-cyan-400',
        bgHover: 'hover:bg-cyan-300',
        bgMuted: 'bg-cyan-400/10',
        border: 'border-cyan-400',
        borderMuted: 'border-white/10 hover:border-cyan-400/40',
        starHex: '#22d3ee',
      };
    case 'rose':
      return {
        text: 'text-rose-400',
        textMuted: 'text-rose-500',
        bg: 'bg-rose-400',
        bgHover: 'hover:bg-rose-300',
        bgMuted: 'bg-rose-400/10',
        border: 'border-rose-400',
        borderMuted: 'border-white/10 hover:border-rose-400/40',
        starHex: '#fb7185',
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
        borderMuted: 'border-white/10 hover:border-yellow-400/40',
        starHex: '#facc15',
      };
  }
};

export default function NodeStats({ themeColor, onPageChange }: NodeStatsProps) {
  const colors = getAccentColor(themeColor);

  const [nodes, setNodes] = useState<NodeStatus[]>([
    { name: 'NS-Minecraft-01', flag: '🇺🇸', location: 'Ashburn, USA', status: 'ONLINE', cpu: 34, ram: 58, networkIn: 4.2, networkOut: 8.9 },
    { name: 'NS-Minecraft-02', flag: '🇩🇪', location: 'Frankfurt, DE', status: 'ONLINE', cpu: 18, ram: 44, networkIn: 2.1, networkOut: 3.4 },
    { name: 'NS-VPS-Core-01', flag: '🇸🇬', location: 'Singapore, APAC', status: 'ONLINE', cpu: 52, ram: 79, networkIn: 8.4, networkOut: 11.2 },
    { name: 'NS-MUM-Intel-09', flag: '🇮🇳', location: 'Mumbai, India', status: 'ONLINE', cpu: 41, ram: 62, networkIn: 1.8, networkOut: 4.5 },
    { name: 'NS-DESK-Docker-01', flag: '🇧🇩', location: 'Dhaka, Bangladesh', status: 'ONLINE', cpu: 22, ram: 31, networkIn: 1.1, networkOut: 1.9 }
  ]);

  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastRefreshed(now.toLocaleTimeString());
    };
    updateTime();

    const timer = setInterval(() => {
      setNodes(prevNodes => 
        prevNodes.map(node => {
          const cpuDelta = Math.floor(Math.random() * 7) - 3;
          const ramDelta = Math.floor(Math.random() * 5) - 2;
          const netInDelta = parseFloat((Math.random() * 0.6 - 0.3).toFixed(1));
          const netOutDelta = parseFloat((Math.random() * 0.8 - 0.4).toFixed(1));

          return {
            ...node,
            cpu: Math.max(10, Math.min(95, node.cpu + cpuDelta)),
            ram: Math.max(20, Math.min(98, node.ram + ramDelta)),
            networkIn: Math.max(0.5, parseFloat((node.networkIn + netInDelta).toFixed(1))),
            networkOut: Math.max(0.8, parseFloat((node.networkOut + netOutDelta).toFixed(1)))
          };
        })
      );
      updateTime();
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="status" className="py-20 lg:py-24 bg-[#0A0A0A] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Border box detailing server status */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${colors.starHex}, transparent)` }} />
          
          {/* Header element */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/5 gap-4 mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                  ALL NODES OPERATIONAL
                </span>
              </div>
              <h3 className="font-display text-4xl sm:text-5xl font-black italic uppercase leading-none tracking-tighter text-white">
                Diagnostics Core
              </h3>
            </div>
            
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Activity className="h-4 w-4" style={{ color: colors.starHex }} />
              <span className="font-mono text-xs text-zinc-400">
                Last Gate Sweep: <span className="text-white font-bold">{lastRefreshed}</span>
              </span>
            </div>
          </div>

          {/* Infrastructure status lines */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Server Lists */}
            <div className="lg:col-span-8 space-y-4">
              {nodes.map((node) => (
                <div 
                  key={node.name}
                  className="rounded-xl border border-white/5 bg-[#0A0A0A]/40 p-4 hover:bg-[#0A0A0A]/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  style={{
                    borderColor: 'rgba(255,255,255,0.05)'
                  }}
                >
                  {/* Left part: location & name */}
                  <div className="flex items-center gap-3">
                    <span className="text-2xl select-none" title={node.location}>{node.flag}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white font-mono">{node.name}</h4>
                      <p className="text-[11px] text-zinc-400 font-mono flex items-center gap-1.5 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {node.location}
                      </p>
                    </div>
                  </div>

                  {/* CPU gauge indicator */}
                  <div className="flex flex-col w-full md:w-28">
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                      <span>CPU LOAD</span>
                      <span className="font-bold font-mono" style={{ color: colors.starHex }}>{node.cpu}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${node.cpu}%`, backgroundColor: colors.starHex }}
                      />
                    </div>
                  </div>

                  {/* RAM gauge indicator */}
                  <div className="flex flex-col w-full md:w-28">
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                      <span>RAM USE</span>
                      <span className="text-white font-bold">{node.ram}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-white/30 rounded-full transition-all duration-1000"
                        style={{ width: `${node.ram}%` }}
                      />
                    </div>
                  </div>

                  {/* Network IO metrics */}
                  <div className="flex items-center gap-4 text-right font-mono">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 uppercase leading-none">Ingress</span>
                      <span className="text-[11px] text-zinc-300 font-bold mt-1">
                        {node.networkIn.toFixed(1)} Gbps
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 uppercase leading-none">Egress</span>
                      <span className="text-[11px] font-bold mt-1" style={{ color: colors.starHex }}>
                        {node.networkOut.toFixed(1)} Gbps
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right block: diagnostics terminal */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="rounded-xl border border-white/5 bg-[#0A0A0A] p-5 font-mono text-xs text-zinc-400 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="font-bold flex items-center gap-2" style={{ color: colors.starHex }}>
                    <Server className="h-3.5 w-3.5" /> Node_Diagnostics
                  </span>
                  <span className="text-[10px] text-zinc-500">Suite: node_status_active</span>
                </div>
                
                <div className="space-y-2 text-[11px] leading-relaxed">
                  <p className="text-zinc-500 font-bold"># systemctl status anycast-filter</p>
                  <p className="text-emerald-400">● edge-scrubber - Anycast DDoS Mitigation</p>
                  <p className="pl-3">Loaded: optimal (mitigating) in 12 datacenters</p>
                  
                  <p className="text-zinc-500 font-bold mt-3"># cat telemetry_capacity.json</p>
                  <div className="bg-black/40 p-2.5 rounded border border-white/5 leading-normal text-zinc-300">
                    <div>⚡ Transit: Level3/AATA</div>
                    <div>📀 Disk Array: 100% NVMe Gen4</div>
                    <div>🛡️ DDoS Capacity: 15 Terabits</div>
                    <div>🚀 Speed SLA: &lt;15ms edge ping</div>
                  </div>
                </div>
              </div>

              {/* Promo box targeting ticketing portal */}
              <div className="rounded-xl p-5 border" style={{ backgroundColor: colors.starHex + '11', borderColor: colors.starHex + '33' }}>
                <h4 className="text-white font-display font-extrabold italic uppercase tracking-tighter text-lg mb-2">Custom Node Requirements?</h4>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4 font-sans">
                  Have questions about bandwidth provisioning or want custom Ryzen threads? Open an interactive support ticket in our portal. Let's build your architecture together.
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange?.('portal')}
                  className="rounded-full text-black text-xs font-bold uppercase tracking-wider py-3 px-4 block w-full text-center transition-all cursor-pointer outline-none"
                  style={{ backgroundColor: colors.starHex }}
                >
                  Create Support Ticket
                </motion.button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
