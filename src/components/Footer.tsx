import React from 'react';
import { ArrowUpRight, ShieldCheck, Mail, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterProps {
  onPageChange?: (page: 'home' | 'plans' | 'status' | 'reviews' | 'faq' | 'portal' | 'support-ticket', category?: 'minecraft' | 'vps' | 'discord' | 'web') => void;
  siteName: string;
  siteLogo: string;
  contactEmail: string;
  contactAddress: string;
  themeColor: string;
}

const getAccentColor = (color: string) => {
  switch (color) {
    case 'violet':
      return {
        text: 'text-violet-400',
        bg: 'bg-violet-400',
        bgHover: 'hover:bg-violet-300',
        bgMuted: 'bg-violet-400/10',
        border: 'border-violet-400',
        starHex: '#a78bfa'
      };
    case 'emerald':
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-400',
        bgHover: 'hover:bg-emerald-300',
        bgMuted: 'bg-emerald-400/10',
        border: 'border-emerald-400',
        starHex: '#34d399'
      };
    case 'cyan':
      return {
        text: 'text-cyan-400',
        bg: 'bg-cyan-400',
        bgHover: 'hover:bg-cyan-300',
        bgMuted: 'bg-cyan-400/10',
        border: 'border-cyan-400',
        starHex: '#22d3ee'
      };
    case 'rose':
      return {
        text: 'text-rose-400',
        bg: 'bg-rose-400',
        bgHover: 'hover:bg-rose-300',
        bgMuted: 'bg-rose-400/10',
        border: 'border-rose-400',
        starHex: '#fb7185'
      };
    case 'yellow':
    default:
      return {
        text: 'text-yellow-400',
        bg: 'bg-yellow-400',
        bgHover: 'hover:bg-yellow-300',
        bgMuted: 'bg-yellow-400/10',
        border: 'border-yellow-400',
        starHex: '#facc15'
      };
  }
};

export default function Footer({
  onPageChange,
  siteName,
  siteLogo,
  contactEmail,
  contactAddress,
  themeColor
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const colors = getAccentColor(themeColor);

  return (
    <footer className="border-t border-white/5 bg-[#0A0A0A]">
      
      {/* Upper CTA prompt block */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16">
        <div 
          className="rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl transition-all duration-300"
          style={{ 
            background: `linear-gradient(135deg, ${colors.starHex}dd 0%, ${colors.starHex} 100%)` 
          }}
        >
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-white/5 pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="font-mono text-xs font-bold text-zinc-950 uppercase tracking-widest bg-white/20 px-3 py-1 rounded">
              Ready to claim your server?
            </span>
            <h3 className="font-display text-2xl sm:text-4xl font-black text-zinc-950 leading-tight">
              Get Started on {siteName} Nodes today under 60 seconds!
            </h3>
            <p className="text-zinc-900/80 text-sm sm:text-base font-medium">
              Set up your Minecraft guild world, container script, or dev virtual machine instantly on high-end Ryzen/Epic cores. Cancel or upgrade anytime, no questions asked.
            </p>
            
            <div className="pt-4 flex flex-wrap gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange?.('plans')}
                className="rounded-full bg-black text-white hover:text-white py-3.5 px-8 font-extrabold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer outline-none shadow-xl"
              >
                <span>View Plans & Order Servers</span>
                <ArrowUpRight className="h-4 w-4" style={{ color: colors.starHex }} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer columns */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand details column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl p-1" style={{ backgroundColor: colors.starHex }}>
              <span className="font-display text-lg font-black italic text-black">{siteLogo.toUpperCase()}</span>
              <div className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0A0A0A] p-[1px]">
                <svg className="h-full w-full text-white fill-white" viewBox="0 0 24 24">
                   <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" />
                </svg>
              </div>
            </div>
            <span className="font-display text-lg font-bold tracking-wider text-white">
              {siteName.substring(0, Math.ceil(siteName.length / 2))}
              <span style={{ color: colors.starHex }}>{siteName.substring(Math.ceil(siteName.length / 2))}</span>
            </span>
          </div>
          
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
            High performance hosting solutions supporting modern gamers and global development teams. Fast, dependable, and heavily secure.
          </p>

          <div className="flex items-center gap-3 text-zinc-500 text-xs font-mono">
            <ShieldCheck className="h-4.5 w-4.5 shrink-0" style={{ color: colors.starHex }} />
            <span>PCI-DSS SSL Encrypted Gateway</span>
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="space-y-3 pt-2">
          <h4 className="font-display text-white font-bold text-xs uppercase tracking-widest">Server Categories</h4>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li>
              <button 
                onClick={() => onPageChange?.('plans', 'minecraft')}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer text-left font-sans outline-none"
              >
                Minecraft Hosting
              </button>
            </li>
            <li>
              <button 
                onClick={() => onPageChange?.('plans', 'vps')}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer text-left font-sans outline-none"
              >
                Cloud VPS KVM Nodes
              </button>
            </li>
            <li>
              <button 
                onClick={() => onPageChange?.('plans', 'discord')}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer text-left font-sans outline-none"
              >
                Discord Bot Hosting
              </button>
            </li>
            <li>
              <button 
                onClick={() => onPageChange?.('plans', 'web')}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer text-left font-sans outline-none"
              >
                Web cPanel Packages
              </button>
            </li>
          </ul>
        </div>

        {/* Global Client Gateways */}
        <div className="space-y-3 pt-2">
          <h4 className="font-display text-white font-bold text-xs uppercase tracking-widest">Client Portals</h4>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li>
              <button 
                onClick={() => onPageChange?.('portal')} 
                className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 font-sans text-left outline-none"
              >
                Client Dashboard <ArrowUpRight className="h-3 w-3" />
              </button>
            </li>
            <li>
              <a href="https://control.vxhost.in" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 font-sans font-bold">
                Game Control Panel <ArrowUpRight className="h-3 w-3" style={{ color: colors.starHex }} />
              </a>
            </li>
            <li>
              <button 
                onClick={() => onPageChange?.('support-ticket')}
                className="text-zinc-400 hover:text-white transition-colors font-sans text-left outline-none"
              >
                Open Support Ticket
              </button>
            </li>
            <li>
              <button
                onClick={() => onPageChange?.('faq')}
                className="text-zinc-400 hover:text-white transition-colors font-sans text-left outline-none"
              >
                Knowledge Base & FAQ
              </button>
            </li>
          </ul>
        </div>

        {/* Support and Coordinates */}
        <div className="space-y-3 pt-2">
          <h4 className="font-display text-white font-bold text-xs uppercase tracking-widest">Reach Out</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-zinc-400">
            <li className="flex items-center gap-2">
              <Mail className="h-4.5 w-4.5 shrink-0" style={{ color: colors.starHex }} />
              <span className="font-mono text-zinc-300">{contactEmail}</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4.5 w-4.5 shrink-0 mt-0.5" style={{ color: colors.starHex }} />
              <span className="font-sans leading-relaxed">{contactAddress}</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright bottom bar with STATIC "made by TheRynzo" */}
      <div className="border-t border-white/5 py-8 bg-black/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <p>© {currentYear} {siteName}. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[11px] font-sans font-semibold tracking-wider text-zinc-400">
            <span>made by</span>
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white hover:border-yellow-400/25 transition-all text-[10px] font-mono leading-none tracking-widest select-none">
              TheRynzo
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
}
