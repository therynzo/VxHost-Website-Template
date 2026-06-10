import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, ChevronDown, Check, LogOut, ShieldAlert, Laptop, User as UserIcon } from 'lucide-react';
import { CurrencyCode, CURRENCIES, User } from '../types';

interface NavbarProps {
  currentCurrency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
  currentPage: 'home' | 'plans' | 'status' | 'reviews' | 'faq' | 'portal' | 'support-ticket' | 'profile';
  onPageChange: (page: 'home' | 'plans' | 'status' | 'reviews' | 'faq' | 'portal' | 'support-ticket' | 'profile') => void;
  siteName: string;
  siteLogo: string;
  themeColor: string;
  user: User | null;
  onLogout: () => void;
  controlPanelLink?: string;
  billingPanelLink?: string;
  siteLogoImage?: string;
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
        accent: 'violet-400',
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
        borderMuted: 'border-white/10 hover:border-emerald-400/40',
        shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
        accent: 'emerald-400',
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
        borderMuted: 'border-white/10 hover:border-cyan-400/40',
        shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]',
        accent: 'cyan-400',
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
        borderMuted: 'border-white/10 hover:border-rose-400/40',
        shadow: 'shadow-[0_0_20px_rgba(244,63,94,0.25)]',
        accent: 'rose-400',
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
        borderMuted: 'border-white/10 hover:border-yellow-400/40',
        shadow: 'shadow-[0_0_20px_rgba(250,204,21,0.25)]',
        accent: 'yellow-400',
        starHex: '#facc15'
      };
  }
};

export default function Navbar({
  currentCurrency,
  onCurrencyChange,
  currentPage,
  onPageChange,
  siteName,
  siteLogo,
  themeColor,
  user,
  onLogout,
  controlPanelLink = 'https://control.vxhost.in',
  billingPanelLink = 'https://billing.vxhost.in',
  siteLogoImage = ''
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCurrencyDrop, setShowCurrencyDrop] = useState(false);

  const colors = getAccentColor(themeColor);

  const handleCurrencySelect = (code: CurrencyCode) => {
    onCurrencyChange(code);
    setShowCurrencyDrop(false);
  };

  const navItems = [
    { label: 'Home', page: 'home' as const },
    { label: 'Hosting Plans', page: 'plans' as const },
    { label: 'Node Status', page: 'status' as const },
    { label: 'Reviews', page: 'reviews' as const },
    { label: 'FAQ', page: 'faq' as const },
    ...(user ? [{ label: 'Profile', page: 'profile' as const }] : [])
  ];

  const halfBrandedName = () => {
    if (siteName.length <= 4) {
      return (
        <span className="font-display text-xl font-extrabold tracking-tighter text-white">
          {siteName}<span className="italic" style={{ color: colors.starHex }}>Host</span>
        </span>
      );
    }
    const mid = Math.ceil(siteName.length / 2);
    const leftPart = siteName.substring(0, mid);
    const rightPart = siteName.substring(mid);
    return (
      <span className="font-display text-xl font-extrabold tracking-tighter text-white">
        {leftPart}<span className="italic" style={{ color: colors.starHex }}>{rightPart}</span>
      </span>
    );
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0A]/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Brand Logo - Styled dynamically like Rockstar Games "V" and palm trees logo */}
          <div className="flex items-center gap-3">
            <motion.button 
              onClick={() => onPageChange('home')}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-3 text-left bg-transparent border-none p-0 cursor-pointer outline-none"
            >
              <div 
                className={`relative flex h-11 w-11 items-center justify-center rounded-lg ${colors.bg} p-1 ${colors.shadow} transition-all duration-300 group-hover:scale-105`}
              >
                {siteLogoImage ? (
                  <img src={siteLogoImage} alt={siteName} className="h-full w-full object-contain rounded-md" referrerPolicy="no-referrer" />
                ) : (
                  <span className="font-display text-2xl font-black italic text-black select-none tracking-tighter leading-none">
                    {siteLogo.toUpperCase()}
                  </span>
                )}
                <div className="absolute -right-1.5 -bottom-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#0A0A0A] p-[1.5px] border border-white/10">
                  <svg className="h-full w-full text-white fill-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                {halfBrandedName()}
                <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase leading-none mt-0.5">
                  premium servers
                </span>
              </div>
            </motion.button>
          </div>

          {/* Desktop Navigation Links - Improved to switch pages */}
          <div className="hidden md:flex md:items-center md:gap-7">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <motion.button
                  key={item.label}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange(item.page)}
                  className={`relative font-sans text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer py-2 px-1 outline-none ${
                    isActive ? colors.text + ' font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeUnderline"
                      className={`absolute bottom-0 left-0 right-0 h-[2px] ${colors.bg} rounded-full`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Navigation Action Buttons (Currency + Client Area) */}
          <div className="hidden lg:flex md:items-center md:gap-4">
            
            {/* Currency Selector dropdown */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCurrencyDrop(!showCurrencyDrop)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer outline-none"
              >
                <span className="text-xs text-gray-500 uppercase font-bold">Currency:</span>
                <span className="text-base leading-none">{CURRENCIES[currentCurrency].flag}</span>
                <span className={`font-mono ${colors.text} font-bold`}>{currentCurrency}</span>
                <ChevronDown className="h-3 w-3 text-zinc-400" />
              </motion.button>

              <AnimatePresence>
                {showCurrencyDrop && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowCurrencyDrop(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-white/10 bg-[#0A0A0A] p-2 shadow-2xl z-50"
                    >
                      <div className="px-3 py-1.5 text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
                        Select Billing Currency
                      </div>
                      {Object.values(CURRENCIES).map((curr) => (
                        <button
                          key={curr.code}
                          onClick={() => handleCurrencySelect(curr.code)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-all cursor-pointer ${
                            curr.code === currentCurrency 
                              ? `${colors.bgMuted} ${colors.text} font-bold` 
                              : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-base">{curr.flag}</span>
                            <div className="flex flex-col text-left">
                              <span className="font-sans leading-none">{curr.code}</span>
                              <span className="text-[10px] text-zinc-400 leading-none mt-1">{curr.label}</span>
                            </div>
                          </div>
                          {curr.code === currentCurrency ? (
                            <Check className={`h-4 w-4 ${colors.text}`} />
                          ) : (
                            <span className="font-mono text-zinc-500 text-xs">{curr.symbol}</span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Game Control Panel button - instructed config game control panel */}
            <motion.a
              whileTap={{ scale: 0.95 }}
              href={controlPanelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-bold uppercase tracking-tight text-white transition-all duration-300 hover:bg-white/10 hover:border-white/20 outline-none"
            >
              <span>Control Panel</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: colors.starHex }} />
            </motion.a>

            {/* Interactive User Module / Portal Page Trigger */}
            <AnimatePresence mode="wait">
              {user ? (
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPageChange('portal')}
                    className={`flex items-center gap-2 rounded-full border ${colors.borderMuted} ${colors.bgMuted} ${colors.text} px-5 py-2.5 text-xs font-bold uppercase tracking-tight transition-all`}
                  >
                    {user.isAdmin ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-mono">
                        <ShieldAlert className="h-3.5 w-3.5" /> ADMIN DESK
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Laptop className="h-3.5 w-3.5" /> MY ACCOUNT
                      </span>
                    )}
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={onLogout}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-zinc-400"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange('portal')}
                  className={`group flex items-center gap-2 rounded-full ${colors.bg} px-6 py-2.5 text-xs font-bold uppercase tracking-tight text-black transition-all duration-300 ${colors.shadow} ${colors.bgHover}`}
                >
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>Client Area</span>
                </motion.button>
              )}
            </AnimatePresence>

          </div>

          {/* Medium screen view buttons */}
          <div className="hidden md:flex lg:hidden items-center gap-3">
            <motion.a
              whileTap={{ scale: 0.95 }}
              href={controlPanelLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10`}
              title="Game Control Panel"
            >
              <ArrowUpRight className="h-4 w-4" style={{ color: colors.starHex }} />
            </motion.a>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange('portal')}
              className={`rounded-full ${colors.bg} px-4 py-2 text-xs font-bold uppercase tracking-tight text-black`}
            >
              Portal
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const codes = Object.keys(CURRENCIES) as CurrencyCode[];
                const nextIndex = (codes.indexOf(currentCurrency) + 1) % codes.length;
                onCurrencyChange(codes[nextIndex]);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-2.5 py-1.5 text-xs font-mono text-white"
            >
              <span>{CURRENCIES[currentCurrency].flag}</span>
              <span className={`${colors.text} font-bold`}>{currentCurrency}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2.5 text-zinc-400 hover:bg-white/5 hover:text-white outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/5 bg-[#0A0A0A] md:hidden"
          >
            <div className="space-y-1.5 px-4 pt-3 pb-6">
              {navItems.map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      onPageChange(item.page);
                      setIsOpen(false);
                    }}
                    className={`block w-full text-left rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors ${
                      isActive ? `${colors.bgMuted} ${colors.text}` : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              
              {/* Account module inside mobile layout */}
              <button
                onClick={() => {
                  onPageChange('portal');
                  setIsOpen(false);
                }}
                className={`block w-full text-left rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors ${
                  currentPage === 'portal' ? `${colors.bgMuted} ${colors.text}` : 'text-zinc-300 hover:bg-white/5'
                }`}
              >
                {user ? (user.isAdmin ? 'Admin Panel' : 'Client Dashboard') : 'Register'}
              </button>

              {user && (
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wider text-red-400 hover:bg-red-500/10"
                >
                  Sign Out
                </button>
              )}

              <div className="border-t border-white/5 pt-4 mt-4">
                <div className="px-3 pb-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                  Currency Mode (Tap to toggle)
                </div>
                <div className="grid grid-cols-2 gap-2 px-3">
                  {Object.values(CURRENCIES).map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => handleCurrencySelect(curr.code)}
                      className={`flex items-center gap-2 rounded-lg p-2.5 text-xs transition-colors cursor-pointer ${
                        curr.code === currentCurrency 
                          ? `${colors.bg} text-black font-bold` 
                          : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                      }`}
                    >
                      <span>{curr.flag}</span>
                      <span>{curr.code} ({curr.symbol})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Game Control Panel mobile buttons */}
              <div className="pt-4 px-3 flex flex-col gap-2">
                <a
                  href={controlPanelLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-3 text-center text-sm font-bold uppercase tracking-wider text-white transition-all"
                >
                  Game Control Panel
                  <ArrowUpRight className="h-4 w-4" style={{ color: colors.starHex }} />
                </a>

                {!user && (
                  <a
                    href={billingPanelLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex w-full items-center justify-center gap-2 rounded-full ${colors.bg} py-3 text-center text-sm font-bold uppercase tracking-wider text-black`}
                  >
                    Billing Panel
                    <ArrowUpRight className="h-4 w-4 text-black" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
