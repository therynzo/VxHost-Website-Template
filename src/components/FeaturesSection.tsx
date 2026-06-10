import React from 'react';
import { Zap, ShieldAlert, Cpu, Gauge, LayoutGrid, Headphones } from 'lucide-react';
import { OTHER_FEATURES } from '../plansData';

// Safe mapping of strings to Lucide components for robust rendering
const ICON_MAPPING: Record<string, React.ComponentType<any>> = {
  Zap: Zap,
  ShieldAlert: ShieldAlert,
  Cpu: Cpu,
  Gauge: Gauge,
  LayoutGrid: LayoutGrid,
  Headphones: Headphones
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-24 bg-[#0A0A0A] border-t border-b border-white/5 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-yellow-400/[0.02] blur-[150px]" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="font-mono text-[10px] font-bold tracking-widest text-yellow-400 uppercase rounded bg-yellow-400/10 px-3 py-1">
            Core Infrastructure
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black italic uppercase leading-none tracking-tighter text-white">
            Industrial Bare Metal
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
            We do not throttle or overcommit network switch allocations. Enjoy consistent bare-metal performance, 365 days a year.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OTHER_FEATURES.map((item, index) => {
            const IconComponent = ICON_MAPPING[item.iconName] || Cpu;
            return (
              <div
                key={item.title}
                className="group rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 p-6 transition-all duration-300 hover:border-yellow-400/30 hover:shadow-[0_4px_25px_rgba(250,204,21,0.03)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0A0A0A] border border-white/10 group-hover:border-yellow-400/40 group-hover:bg-yellow-400 group-hover:text-black text-yellow-400 transition-all duration-300 mb-5">
                  <IconComponent className="h-5 w-5" />
                </div>
                
                <h3 className="font-display text-base font-bold uppercase tracking-wider text-white mb-2 group-hover:text-yellow-400 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
