import React, { useState, useEffect } from 'react';
import { CurrencyCode, HostCategory, HostingPlan, User } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PricingSection from './components/PricingSection';
import FeaturesSection from './components/FeaturesSection';
import NodeStats from './components/NodeStats';
import ReviewsSection from './components/ReviewsSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import Portal from './components/Portal';
import SupportPage from './components/SupportPage';
import ProfilePage from './components/ProfilePage';
import { PLANS_DATA } from './plansData';
import { Gamepad2, Cloud, MessageSquare, Globe, Cpu, Shield, Zap, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Page = 'home' | 'plans' | 'status' | 'reviews' | 'faq' | 'portal' | 'support-ticket' | 'profile';

const getAccentColor = (color: string) => {
  switch (color) {
    case 'violet':
      return {
        text: 'text-violet-400',
        textMuted: 'text-violet-500',
        bg: 'bg-violet-400',
        bgHover: 'hover:bg-violet-300',
        bgMuted: 'bg-violet-400/10',
        starHex: '#a78bfa'
      };
    case 'emerald':
      return {
        text: 'text-emerald-400',
        textMuted: 'text-emerald-500',
        bg: 'bg-emerald-400',
        bgHover: 'hover:bg-emerald-300',
        bgMuted: 'bg-emerald-400/10',
        starHex: '#34d399'
      };
    case 'cyan':
      return {
        text: 'text-cyan-400',
        textMuted: 'text-cyan-500',
        bg: 'bg-cyan-400',
        bgHover: 'hover:bg-cyan-300',
        bgMuted: 'bg-cyan-400/10',
        starHex: '#22d3ee'
      };
    case 'rose':
      return {
        text: 'text-rose-400',
        textMuted: 'text-rose-500',
        bg: 'bg-rose-400',
        bgHover: 'hover:bg-rose-300',
        bgMuted: 'bg-rose-400/10',
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
        starHex: '#facc15'
      };
  }
};

export default function App() {
  // Configured states with default values that read from localStorage
  const [siteName, setSiteName] = useState(() => {
    return localStorage.getItem('vx_site_name') || 'VxHost';
  });
  
  const [siteLogo, setSiteLogo] = useState(() => {
    return localStorage.getItem('vx_site_logo') || 'VX';
  });

  const [siteLogoImage, setSiteLogoImage] = useState(() => {
    return localStorage.getItem('vx_site_logo_image') || '';
  });

  const [contactEmail, setContactEmail] = useState(() => {
    return localStorage.getItem('vx_contact_email') || 'team@vxhost.in';
  });

  const [contactAddress, setContactAddress] = useState(() => {
    return localStorage.getItem('vx_contact_address') || 'Worldwide server clusters (US, EU, IN, SG, BD)';
  });

  const [deployNodeLink, setDeployNodeLink] = useState(() => {
    return localStorage.getItem('vx_deploy_node_link') || 'https://billing.vxhost.in';
  });

  const [controlPanelLink, setControlPanelLink] = useState(() => {
    return localStorage.getItem('vx_control_panel_link') || 'https://control.vxhost.in';
  });

  const [billingPanelLink, setBillingPanelLink] = useState(() => {
    return localStorage.getItem('vx_billing_panel_link') || 'https://billing.vxhost.in';
  });

  const [themeColor, setThemeColor] = useState(() => {
    return localStorage.getItem('vx_theme_color') || 'yellow';
  });

  const [plans, setPlans] = useState<HostingPlan[]>(() => {
    const saved = localStorage.getItem('vx_custom_plans');
    return saved ? JSON.parse(saved) : PLANS_DATA;
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedSession = localStorage.getItem('vx_user_session');
    return savedSession ? JSON.parse(savedSession) : null;
  });

  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCategory, setSelectedCategory] = useState<HostCategory>('minecraft');

  // Push state changes to storage
  useEffect(() => {
    localStorage.setItem('vx_site_name', siteName);
  }, [siteName]);

  useEffect(() => {
    localStorage.setItem('vx_site_logo', siteLogo);
  }, [siteLogo]);

  useEffect(() => {
    localStorage.setItem('vx_site_logo_image', siteLogoImage);
  }, [siteLogoImage]);

  useEffect(() => {
    localStorage.setItem('vx_contact_email', contactEmail);
  }, [contactEmail]);

  useEffect(() => {
    localStorage.setItem('vx_contact_address', contactAddress);
  }, [contactAddress]);

  useEffect(() => {
    localStorage.setItem('vx_deploy_node_link', deployNodeLink);
  }, [deployNodeLink]);

  useEffect(() => {
    localStorage.setItem('vx_control_panel_link', controlPanelLink);
  }, [controlPanelLink]);

  useEffect(() => {
    localStorage.setItem('vx_billing_panel_link', billingPanelLink);
  }, [billingPanelLink]);

  useEffect(() => {
    localStorage.setItem('vx_theme_color', themeColor);
  }, [themeColor]);

  // Auth helper callbacks
  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    localStorage.setItem('vx_user_session', JSON.stringify(loggedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('vx_user_session');
    setCurrentPage('home');
  };

  const handlePageChange = (page: Page, category?: HostCategory) => {
    setCurrentPage(page);
    if (category) {
      setSelectedCategory(category);
    }
    // Scroll to top instantly on page navigation
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  const colors = getAccentColor(themeColor);

  return (
    <div id="app-root" className="min-h-screen bg-[#09090b] text-zinc-100 overflow-x-hidden font-sans flex flex-col justify-between">
      
      {/* Prime Header Navigation with Currency Config */}
      <Navbar 
        currentCurrency={currency} 
        onCurrencyChange={setCurrency} 
        currentPage={currentPage}
        onPageChange={(page) => handlePageChange(page)}
        siteName={siteName}
        siteLogo={siteLogo}
        themeColor={themeColor}
        user={user}
        onLogout={handleLogout}
        controlPanelLink={controlPanelLink}
        billingPanelLink={billingPanelLink}
        siteLogoImage={siteLogoImage}
      />

      {/* Main page views with transition animations */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {currentPage === 'home' && (
              <>
                {/* Hero Header Presentation */}
                <Hero siteName={siteName} themeColor={themeColor} onPageChange={(page) => handlePageChange(page)} />

                {/* Feature Products Shortcut Widgets (Page routing click triggers) */}
                <section className="py-12 bg-zinc-950/40 border-y border-white/5">
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center space-y-3 mb-10">
                      <span 
                        className="font-mono text-[10px] font-bold tracking-widest uppercase rounded px-3 py-1 bg-white/5"
                        style={{ color: colors.starHex }}
                      >
                        Deployment categories
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-black italic uppercase leading-none tracking-tighter text-white">
                        Choose Your Vector
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm font-sans max-w-md mx-auto">
                        Pick a dedicated server framework. Selecting a category navigates to the custom configuration planner.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      
                      {/* Minecraft Box */}
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange('plans', 'minecraft')}
                        className="group flex flex-col text-left justify-between h-[150px] cursor-pointer rounded-2xl border border-white/5 bg-[#09090b] p-6 hover:bg-white/5 transition-all outline-none"
                        style={{ contentVisibility: 'auto' }}
                      >
                        <div 
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-yellow-400 group-hover:scale-110 transition-transform"
                        >
                          <Gamepad2 className="h-5 w-5" style={{ color: colors.starHex }} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white transition-colors" style={{ color: 'inherit' }}>Minecraft Nodes</h4>
                          <p className="text-[10px] text-zinc-500 font-mono tracking-wide mt-1">Multi-core ECC RAM</p>
                        </div>
                      </motion.button>

                      {/* Cloud VPS Box */}
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange('plans', 'vps')}
                        className="group flex flex-col text-left justify-between h-[150px] cursor-pointer rounded-2xl border border-white/5 bg-[#09090b] p-6 hover:bg-white/5 transition-all outline-none"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-yellow-400 group-hover:scale-110 transition-transform">
                          <Cloud className="h-5 w-5" style={{ color: colors.starHex }} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white transition-colors">KVM Cloud VPS</h4>
                          <p className="text-[10px] text-zinc-500 font-mono tracking-wide mt-1">Full Root SSH</p>
                        </div>
                      </motion.button>

                      {/* Discord Bots Box */}
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange('plans', 'discord')}
                        className="group flex flex-col text-left justify-between h-[150px] cursor-pointer rounded-2xl border border-white/5 bg-[#09090b] p-6 hover:bg-white/5 transition-all outline-none"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-yellow-400 group-hover:scale-110 transition-transform">
                          <MessageSquare className="h-5 w-5" style={{ color: colors.starHex }} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white transition-colors">Discord Bots</h4>
                          <p className="text-[10px] text-zinc-500 font-mono tracking-wide mt-1">Sleek Containers</p>
                        </div>
                      </motion.button>

                      {/* Web Hosting Box */}
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange('plans', 'web')}
                        className="group flex flex-col text-left justify-between h-[150px] cursor-pointer rounded-2xl border border-white/5 bg-[#09090b] p-6 hover:bg-white/5 transition-all outline-none"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-yellow-400 group-hover:scale-110 transition-transform">
                          <Globe className="h-5 w-5" style={{ color: colors.starHex }} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white transition-colors">Web Cloud</h4>
                          <p className="text-[10px] text-zinc-500 font-mono tracking-wide mt-1">Enterprise cPanel</p>
                        </div>
                      </motion.button>

                    </div>
                  </div>
                </section>

                {/* Main Hardware Specs details list (Ryzen 9 etc) */}
                <FeaturesSection />

                {/* HOME REPLACEMENT CONTENT: Premium Infrastructure Guarantees (Removal of Node Status telemetry cards from Home) */}
                <section className="py-20 bg-zinc-950/20 relative border-t border-white/5">
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                        <Cpu className="h-8 w-8" style={{ color: colors.starHex }} />
                        <h4 className="font-display font-bold text-white uppercase tracking-wider text-base">AMD Ryzen 9 cores</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                          All server deployments execute on the latest AMD Ryzen 9 7950X processors, featuring up to 5.7 GHz single-core execution speed. Unmatched gaming execution.
                        </p>
                      </div>
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                        <Shield className="h-8 w-8" style={{ color: colors.starHex }} />
                        <h4 className="font-display font-bold text-white uppercase tracking-wider text-base">15 Tbps+ DDoS Scruber</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                          Experience true uptime reliability. Our distributed physical Scrubbing Nodes filter out malicious spikes automatically, defending your guild world around the clock.
                        </p>
                      </div>
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                        <Zap className="h-8 w-8" style={{ color: colors.starHex }} />
                        <h4 className="font-display font-bold text-white uppercase tracking-wider text-base">Instant configuration</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                          Skip the long queues. Once invoice cleared under our security, virtual machine containers and server containers boot instantly under 30 seconds.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {currentPage === 'plans' && (
              <div className="pt-8">
                {/* Main Filterable Dynamic Currency Pricing Panel */}
                <PricingSection 
                  currentCurrency={currency} 
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  plans={plans}
                  themeColor={themeColor}
                  deployNodeLink={deployNodeLink}
                />
              </div>
            )}

            {currentPage === 'status' && (
              <div className="pt-12">
                {/* Cluster diagnostics telemetry */}
                <div className="py-16 bg-[#09090b] text-center border-b border-white/5">
                  <div className="max-w-xl mx-auto space-y-3 px-4">
                    <span 
                      className="font-mono text-[10px] font-bold tracking-widest uppercase rounded px-3 py-1 bg-white/5"
                      style={{ color: colors.starHex }}
                    >
                      {siteName} Telemetry
                    </span>
                    <h1 className="font-display text-4xl sm:text-5xl font-black italic uppercase leading-none text-white tracking-tighter">
                      NODE STATUS
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm font-sans">
                      Real-time telemetry and resource usage statistics across worldwide high-capacity nodes.
                    </p>
                  </div>
                </div>
                <NodeStats themeColor={themeColor} onPageChange={(page) => handlePageChange(page)} />
                <div className="border-t border-white/5">
                  <FeaturesSection />
                </div>
              </div>
            )}

            {currentPage === 'reviews' && (
              <div className="pt-12">
                {/* Customer reviews and testimonials */}
                <div className="py-16 bg-[#09090b] text-center border-b border-white/5">
                  <div className="max-w-xl mx-auto space-y-3 px-4">
                    <span 
                      className="font-mono text-[10px] font-bold tracking-widest uppercase rounded px-3 py-1 bg-white/5"
                      style={{ color: colors.starHex }}
                    >
                      Customer feedback
                    </span>
                    <h1 className="font-display text-4xl sm:text-5xl font-black italic uppercase leading-none text-white tracking-tighter">
                      Node Reviews
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm font-sans">
                      See what developers, gaming guilds, and agency owners say about their experience on {siteName}.
                    </p>
                  </div>
                </div>
                <ReviewsSection />
              </div>
            )}

            {currentPage === 'faq' && (
              <div className="pt-12">
                {/* Help section accordion questions */}
                <FaqSection />
              </div>
            )}

            {currentPage === 'portal' && (
              <div className="pt-12">
                <Portal 
                  user={user}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                  siteName={siteName}
                  setSiteName={setSiteName}
                  siteLogo={siteLogo}
                  setSiteLogo={setSiteLogo}
                  siteLogoImage={siteLogoImage}
                  setSiteLogoImage={setSiteLogoImage}
                  contactEmail={contactEmail}
                  setContactEmail={setContactEmail}
                  contactAddress={contactAddress}
                  setContactAddress={setContactAddress}
                  deployNodeLink={deployNodeLink}
                  setDeployNodeLink={setDeployNodeLink}
                  controlPanelLink={controlPanelLink}
                  setControlPanelLink={setControlPanelLink}
                  billingPanelLink={billingPanelLink}
                  setBillingPanelLink={setBillingPanelLink}
                  themeColor={themeColor}
                  setThemeColor={setThemeColor}
                  plans={plans}
                  setPlans={setPlans}
                />
              </div>
            )}

            {currentPage === 'support-ticket' && (
              <div className="pt-12">
                <SupportPage 
                  user={user}
                  onLogin={handleLogin}
                  siteName={siteName}
                  themeColor={themeColor}
                />
              </div>
            )}

            {currentPage === 'profile' && (
              <div className="pt-12">
                <ProfilePage 
                  user={user}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                  siteName={siteName}
                  themeColor={themeColor}
                  onPageChange={(page) => handlePageChange(page)}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Premium detailed platform footer with unalterable credentials */}
      <Footer 
        onPageChange={(page, category) => handlePageChange(page, category)} 
        siteName={siteName}
        siteLogo={siteLogo}
        contactEmail={contactEmail}
        contactAddress={contactAddress}
        themeColor={themeColor}
      />

    </div>
  );
}
