import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, Gamepad2, Cloud, MessageSquare, Globe } from 'lucide-react';
import { CurrencyCode, CURRENCIES, HostCategory, HostingPlan } from '../types';

interface PricingSectionProps {
  currentCurrency: CurrencyCode;
  selectedCategory?: HostCategory;
  onCategoryChange?: (category: HostCategory) => void;
  plans: HostingPlan[];
  themeColor: string;
  deployNodeLink: string;
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
        shadow: 'shadow-[0_0_20px_rgba(139,92,246,0.25)]',
        accentHex: '#a78bfa'
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
        shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
        accentHex: '#34d399'
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
        shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]',
        accentHex: '#22d3ee'
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
        shadow: 'shadow-[0_0_20px_rgba(251,113,133,0.25)]',
        accentHex: '#fb7185'
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
        shadow: 'shadow-[0_0_20px_rgba(250,204,21,0.25)]',
        accentHex: '#facc15'
      };
  }
};

export default function PricingSection({
  currentCurrency,
  selectedCategory,
  onCategoryChange,
  plans,
  themeColor,
  deployNodeLink
}: PricingSectionProps) {
  const [internalCategory, setInternalCategory] = useState<HostCategory>('minecraft');
  const activeCategory = selectedCategory || internalCategory;

  const colors = getAccentColor(themeColor);

  const handleCategorySelect = (category: HostCategory) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    } else {
      setInternalCategory(category);
    }
  };

  const currencyInfo = CURRENCIES[currentCurrency];

  const formatPrice = (priceUSD: number) => {
    const convertedPrice = priceUSD * currencyInfo.rateToUSD;
    if (currencyInfo.code === 'USD') {
      return `${currencyInfo.symbol}${convertedPrice.toFixed(2)}`;
    } else {
      return `${currencyInfo.symbol}${Math.round(convertedPrice).toLocaleString()}`;
    }
  };

  const categories = [
    { id: 'minecraft', label: 'Minecraft Hosting', icon: Gamepad2, desc: 'High single-core CPU nodes' },
    { id: 'vps', label: 'Cloud VPS KVM', icon: Cloud, desc: 'Full root access VPS nodes' },
    { id: 'discord', label: 'Discord Bot Nodes', icon: MessageSquare, desc: 'Uninterrupted bot hosting' },
    { id: 'web', label: 'Web Hosting', icon: Globe, desc: 'Sleek server cPanel hosting' }
  ];

  const filteredPlans = plans.filter((plan) => plan.category === activeCategory);

  return (
    <section id="choose-plan" className="py-20 lg:py-28 bg-[#0A0A0A] relative">
      <div className={`absolute bottom-10 left-10 -z-10 h-[400px] w-[400px] rounded-full blur-[100px] pointer-events-none`} style={{ backgroundColor: colors.accentHex + '11' }} />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span 
            className="font-mono text-[10px] font-bold tracking-widest uppercase rounded px-3 py-1"
            style={{ color: colors.accentHex, backgroundColor: colors.accentHex + '1a' }}
          >
            Flexible Deployment Options
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black italic uppercase leading-none tracking-tighter text-white">
            Server Clusters
          </h2>
          <p className="text-gray-400 text-sm">
            Deploy extreme specs suited for any workload. Showing calculations for{' '}
            <strong className="text-white font-semibold">{currencyInfo.label} ({currencyInfo.code})</strong>.
          </p>
        </div>

        {/* Tab Switcher - Grid layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 max-w-4xl mx-auto mb-16 p-1 bg-white/5 rounded-2xl border border-white/5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategorySelect(cat.id as HostCategory)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl text-center transition-all cursor-pointer outline-none ${
                  isSelected
                    ? 'text-black font-extrabold shadow-lg'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
                style={{ 
                  backgroundColor: isSelected ? colors.accentHex : 'transparent',
                  boxShadow: isSelected ? `0 4px 15px ${colors.accentHex}44` : 'none'
                }}
              >
                <Icon className={`h-5 w-5 mb-2 ${isSelected ? 'text-black font-bold' : ''}`} style={{ color: isSelected ? 'inherit' : colors.accentHex }} />
                <span className="font-sans text-xs font-bold uppercase tracking-wider block leading-none">{cat.label}</span>
                <span className={`text-[9px] mt-1.5 font-mono tracking-wide leading-none ${
                   isSelected ? 'text-zinc-800' : 'text-zinc-500'
                }`}>
                  {cat.desc}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          <AnimatePresence mode="popLayout">
            {filteredPlans.map((plan, index) => {
              const cleanedPrice = plan.priceUSD || 0;
              return (
                <motion.div
                  key={plan.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex flex-col rounded-2xl border bg-white/5 p-6 relative transition-all duration-300 ${
                    plan.isPopular 
                      ? 'shadow-[0_0_30px_rgba(255,255,255,0.05)] scale-[1.02] md:scale-[1.03] lg:scale-[1.02] z-10' 
                      : 'border-white/5 hover:border-white/10'
                  }`}
                  style={{
                    borderColor: plan.isPopular ? colors.accentHex : 'rgba(255,255,255,0.05)'
                  }}
                  id={plan.id}
                >
                  {/* Badge top-right */}
                  {plan.badge && (
                    <span 
                      className={`absolute top-4 right-4 text-[9px] font-mono font-black tracking-widest uppercase px-2.5 py-0.5 rounded leading-none`}
                      style={{
                        backgroundColor: plan.isPopular ? colors.accentHex : 'rgba(255,255,255,0.1)',
                        color: plan.isPopular ? '#000000' : '#ffffff'
                      }}
                    >
                      {plan.badge}
                    </span>
                  )}

                  {/* Plan Name */}
                  <div className="mb-4">
                    <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-white">{plan.name}</h3>
                    <p className="text-[11px] text-zinc-400 font-sans mt-1.5 line-clamp-2 h-8">
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing value display */}
                  <div className="py-4 border-t border-b border-white/5 my-4 flex items-baseline gap-1 bg-[#0A0A0A]/40 px-3 rounded-lg">
                    <span className="font-display text-3xl font-black font-mono tracking-tight" style={{ color: colors.accentHex }}>
                      {formatPrice(cleanedPrice)}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-bold">
                      / {plan.billingPeriod || 'month'}
                    </span>
                  </div>

                  {/* Technical Specifications Highlights (e.g. RAM, CPU) */}
                  <div className="space-y-2 mb-6">
                    <p className="text-[9px] font-mono font-bold tracking-wider text-zinc-500 uppercase">
                      Hardware Specs
                    </p>
                    <div className="grid grid-cols-2 gap-2 bg-[#0A0A0A]/60 p-3 rounded-xl border border-white/5">
                      {plan.specs && plan.specs.map((spec) => (
                        <div key={spec.label} className="flex flex-col">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase leading-none">
                            {spec.label}
                          </span>
                          <span className="text-xs font-semibold text-white mt-1 leading-none font-mono">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features detailed checklist items */}
                  <div className="space-y-2.5 flex-grow mb-8">
                    <p className="text-[9px] font-mono font-bold tracking-wider text-zinc-500 uppercase">
                      Features Loaded
                    </p>
                    {plan.features && plan.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-xs text-zinc-300 font-sans">
                        <Check className="h-4 w-4 shrink-0 mt-0.5" style={{ color: colors.accentHex }} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Buy Button - Targets the requested client billing page link */}
                  <motion.a
                    whileTap={{ scale: 0.95 }}
                    href={deployNodeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 px-4 rounded-full text-center text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer outline-none`}
                    style={{
                      backgroundColor: plan.isPopular ? colors.accentHex : 'rgba(255,255,255,0.05)',
                      color: plan.isPopular ? '#000000' : '#ffffff',
                      boxShadow: plan.isPopular ? `0 4px 15px ${colors.accentHex}33` : 'none'
                    }}
                  >
                    <span>Deploy Node</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </motion.a>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Global Redirect Billing Info Bar */}
        <div className="mt-12 text-center">
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest leading-relaxed">
            * All final configurations, payments, and setups execute safely under{' '}
            <a 
              href={deployNodeLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline font-bold"
              style={{ color: colors.accentHex }}
            >
              {deployNodeLink.replace(/^https?:\/\//i, '')}
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}
