import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User as UserIcon, Lock, Mail, Save, LogOut, CheckCircle2, 
  Server, MessageSquare
} from 'lucide-react';
import { User, SupportTicket } from '../types';

interface ProfilePageProps {
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  siteName: string;
  themeColor: string;
  onPageChange?: (page: any) => void;
}

const getAccentColor = (color: string) => {
  switch (color) {
    case 'violet':
      return {
        text: 'text-violet-400',
        bg: 'bg-violet-400',
        bgHover: 'hover:bg-violet-300',
        bgMuted: 'bg-violet-400/10',
        starHex: '#a78bfa'
      };
    case 'emerald':
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-400',
        bgHover: 'hover:bg-emerald-300',
        bgMuted: 'bg-emerald-400/10',
        starHex: '#34d399'
      };
    case 'cyan':
      return {
        text: 'text-cyan-400',
        bg: 'bg-cyan-400',
        bgHover: 'hover:bg-cyan-300',
        bgMuted: 'bg-cyan-400/10',
        starHex: '#22d3ee'
      };
    case 'rose':
      return {
        text: 'text-rose-400',
        bg: 'bg-rose-400',
        bgHover: 'hover:bg-rose-300',
        bgMuted: 'bg-rose-400/10',
        starHex: '#fb7185'
      };
    case 'yellow':
    default:
      return {
        text: 'text-yellow-400',
        bg: 'bg-yellow-400',
        bgHover: 'hover:bg-yellow-300',
        bgMuted: 'bg-yellow-400/10',
        starHex: '#facc15'
      };
  }
};

export default function ProfilePage({ user, onLogin, onLogout, siteName, themeColor, onPageChange }: ProfilePageProps) {
  const colors = getAccentColor(themeColor);

  // Profile fields state (for logged in state)
  const [usernameField, setUsernameField] = useState('');
  const [emailField, setEmailField] = useState('');
  const [passwordField, setPasswordField] = useState('');
  const [avatarUrlField, setAvatarUrlField] = useState('');
  const [discordField, setDiscordField] = useState('');
  const [countryField, setCountryField] = useState('Worldwide');
  const [bioField, setBioField] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Stats Counters
  const [numServers, setNumServers] = useState(0);
  const [numTickets, setNumTickets] = useState(0);

  // Fetch or initialize profile details
  useEffect(() => {
    if (user) {
      setUsernameField(user.username);
      setEmailField(user.email);
      
      const savedMembers = localStorage.getItem('vx_members_list');
      if (savedMembers) {
        const membersList = JSON.parse(savedMembers);
        const match = membersList.find((m: any) => m.email === user.email);
        if (match) {
          setPasswordField(match.password || 'vxclient');
          setAvatarUrlField(match.avatarUrl || '');
          setDiscordField(match.discord || '');
          setCountryField(match.country || 'Worldwide');
          setBioField(match.bio || '');
        } else {
          setPasswordField('vxclient');
        }
      }

      // Count node servers from user
      const savedServers = localStorage.getItem('vx_user_servers');
      if (savedServers) {
        const serversList = JSON.parse(savedServers);
        setNumServers(serversList.length);
      }

      // Count support tickets from user
      const savedTickets = localStorage.getItem('vx_tickets');
      if (savedTickets) {
        const ticketsList = JSON.parse(savedTickets) as SupportTicket[];
        const count = ticketsList.filter(t => t.userEmail === user.email).length;
        setNumTickets(count);
      }
    }
  }, [user]);

  // Profile settings Save Handler
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!usernameField.trim() || !emailField.trim()) {
      return;
    }

    const savedMembers = localStorage.getItem('vx_members_list');
    let membersList = savedMembers ? JSON.parse(savedMembers) : [];

    let didUpdate = false;
    membersList = membersList.map((m: any) => {
      if (m.email === user.email) {
        didUpdate = true;
        return {
          ...m,
          username: usernameField.trim(),
          email: emailField.trim().toLowerCase(),
          password: passwordField,
          avatarUrl: avatarUrlField.trim(),
          discord: discordField.trim(),
          country: countryField,
          bio: bioField.trim(),
          lastActive: new Date().toISOString()
        };
      }
      return m;
    });

    // If current system didn't have user, create it as a fallback
    if (!didUpdate) {
      membersList.push({
        username: usernameField.trim(),
        email: emailField.trim().toLowerCase(),
        password: passwordField,
        avatarUrl: avatarUrlField.trim(),
        discord: discordField.trim(),
        country: countryField,
        bio: bioField.trim(),
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        status: 'Active'
      });
    }

    // Save members base
    localStorage.setItem('vx_members_list', JSON.stringify(membersList));

    // Update session
    const updatedSession: User = {
      username: usernameField.trim(),
      email: emailField.trim().toLowerCase(),
      isAdmin: user.isAdmin
    };
    onLogin(updatedSession);

    // Sync ticket logs for user so their username/email remains accurate
    const savedTickets = localStorage.getItem('vx_tickets');
    if (savedTickets) {
      let tList = JSON.parse(savedTickets);
      tList = tList.map((t: any) => {
        if (t.userEmail === user.email) {
          return {
            ...t,
            userEmail: updatedSession.email,
            userName: updatedSession.username,
            messages: t.messages.map((m: any) => 
              m.senderEmail === user.email 
                ? { ...m, senderEmail: updatedSession.email, senderName: updatedSession.username } 
                : m
            )
          };
        }
        return t;
      });
      localStorage.setItem('vx_tickets', JSON.stringify(tList));
    }

    // Display Save UI notification
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 4500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center">
      
      {/* Dynamic Main Header */}
      <div className="max-w-xl mx-auto space-y-3 mb-10 text-center">
        <span 
          className="font-mono text-[10px] font-bold tracking-widest uppercase rounded px-3 py-1 bg-white/5"
          style={{ color: colors.starHex }}
        >
          Secure User Hub
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-black italic uppercase leading-none text-white tracking-tighter">
          CLIENT PROFILE
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm font-sans">
          Manage your global server node account identity, email coordinates, avatar aesthetics and password hashing.
        </p>
      </div>

      {!user ? (
        /* Render fallback message for logged-out state - guiding user to portal login */
        <div className="max-w-md mx-auto relative rounded-3xl border border-white/5 bg-white/[0.01] p-8 sm:p-10 text-center shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ backgroundColor: colors.starHex }} />
          
          <div className="space-y-6 py-4">
            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Lock className="h-6 w-6 text-zinc-400" style={{ color: colors.starHex }} />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display text-white text-lg font-bold uppercase tracking-wide">
                AUTHENTICATION REQUIRED
              </h3>
              <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                You must login or register an active account subscription in the main Client Portal to customize user dashboard settings.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onPageChange?.('portal')}
                className="w-full rounded-xl py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-black font-sans transition-all active:scale-95 cursor-pointer outline-none shadow-md"
                style={{ backgroundColor: colors.starHex }}
              >
                Go to Client Portal & Sign In
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated active profile workspace module */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start">
          
          {/* Left Avatar Card and Account Metrics */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Account visual branding metadata widget */}
            <div className="relative rounded-3xl border border-white/5 bg-zinc-950/40 p-6 text-center overflow-hidden shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ backgroundColor: colors.starHex }} />
              
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative h-24 w-24 rounded-full border-2 border-white/15 overflow-hidden bg-black flex items-center justify-center">
                    {avatarUrlField ? (
                      <img 
                        src={avatarUrlField} 
                        alt={usernameField} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <UserIcon className="h-10 w-10 text-zinc-500" />
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">{usernameField || user.username}</h3>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">{emailField || user.email}</span>
                </div>

                {bioField && (
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed italic bg-black/20 p-3 rounded-xl border border-white/5">
                    "{bioField}"
                  </p>
                )}

                <div className="flex justify-center gap-2 pt-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-white/5 px-2.5 py-1 text-zinc-400 rounded-lg">
                    {countryField}
                  </span>
                  {discordField && (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 px-2.5 py-1 rounded-lg">
                      👾 {discordField}
                    </span>
                  )}
                </div>

                <div className="border-t border-white/5 pt-4">
                  <button
                    onClick={onLogout}
                    className="w-full rounded-xl bg-red-500/5 hover:bg-red-500/15 border border-red-500/10 text-red-400 hover:text-red-300 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer outline-none"
                  >
                    <LogOut className="h-3.5 w-3.5 inline mr-1.5" /> SIGN OUT OF NODE
                  </button>
                </div>
              </div>
            </div>

            {/* Account diagnostics counter */}
            <div className="rounded-3xl border border-white/5 bg-zinc-950/40 p-5 space-y-4 shadow-sm">
              <h4 className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-white/5 pb-2">
                ACTIVE PIPELINE TELEMETRY
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-black/60 p-4 border border-white/5 text-center">
                  <Server className="h-5 w-5 text-zinc-500 mx-auto mb-1" style={{ color: colors.starHex }} />
                  <span className="block font-display text-2xl font-black text-white">{numServers}</span>
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">Node Servers</span>
                </div>
                <div className="rounded-2xl bg-black/60 p-4 border border-white/5 text-center">
                  <MessageSquare className="h-5 w-5 text-zinc-500 mx-auto mb-1" style={{ color: colors.starHex }} />
                  <span className="block font-display text-2xl font-black text-white">{numTickets}</span>
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">Help Tickets</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Main settings dashboard block to change details */}
          <div className="lg:col-span-8">
            <div className="relative rounded-3xl border border-white/5 bg-white/[0.01] p-6 sm:p-8 overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ backgroundColor: colors.starHex }} />
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-white text-xl font-extrabold uppercase tracking-tight">
                    ACCOUNT PREFERENCES
                  </h3>
                  <p className="text-zinc-500 text-xs font-sans mt-0.5">
                    Modifying registration credentials, high-level attributes, and passwords in realtime.
                  </p>
                </div>

                {saveSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 text-xs font-mono flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    <span>Success! User profile updated on central storage.</span>
                  </motion.div>
                )}

                <form onSubmit={handleProfileSave} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-mono tracking-widest uppercase text-zinc-400 font-bold">
                        Client Username / Alias
                      </label>
                      <input
                        type="text"
                        value={usernameField}
                        onChange={(e) => setUsernameField(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-xs text-white focus:border-white/20 focus:outline-none font-sans"
                        placeholder="Your username"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-mono tracking-widest uppercase text-zinc-400 font-bold">
                        Primary Email Address
                      </label>
                      <input
                        type="email"
                        value={emailField}
                        onChange={(e) => setEmailField(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-xs text-white focus:border-white/20 focus:outline-none font-sans"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-mono tracking-widest uppercase text-zinc-400 font-bold">
                        Change Account Password
                      </label>
                      <input
                        type="text"
                        value={passwordField}
                        onChange={(e) => setPasswordField(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-xs text-white focus:border-white/20 focus:outline-none font-mono"
                        placeholder="Enter a new secure password"
                        required
                      />
                      <span className="text-[8px] text-zinc-500 font-mono block">Pass is visible here for clear node access key review.</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-mono tracking-widest uppercase text-zinc-400 font-bold">
                        Avatar Profile Picture URL
                      </label>
                      <input
                        type="url"
                        value={avatarUrlField}
                        onChange={(e) => setAvatarUrlField(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-xs text-white focus:border-white/20 focus:outline-none font-mono"
                        placeholder="e.g. https://images.unsplash.com/... or custom png link"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-mono tracking-widest uppercase text-zinc-400 font-bold">
                        Discord Username Handle
                      </label>
                      <input
                        type="text"
                        value={discordField}
                        onChange={(e) => setDiscordField(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-xs text-white focus:border-white/20 focus:outline-none font-sans"
                        placeholder="e.g. username#1234"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-mono tracking-widest uppercase text-zinc-400 font-bold">
                        Server Operational Region
                      </label>
                      <select
                        value={countryField}
                        onChange={(e) => setCountryField(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-xs text-white focus:border-white/20 focus:outline-none font-sans"
                      >
                        <option value="Worldwide">Worldwide / Automated Global Anycast</option>
                        <option value="North America">North America (Chicago / Oregon / Virginia)</option>
                        <option value="European Union">European Union (Frankfurt / London / Helsinki)</option>
                        <option value="Asia Pacific">Asia Pacific (Singapore / Mumbai / Sydney)</option>
                        <option value="Bangladesh / India">Bengal Core (Dhaka / New Delhi)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-mono tracking-widest uppercase text-zinc-400 font-bold">
                      Account Description Bio
                    </label>
                    <textarea
                      rows={3}
                      value={bioField}
                      onChange={(e) => setBioField(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-xs text-white focus:border-white/20 focus:outline-none font-sans"
                      placeholder="Share a short bio summarizing your guild or network system role..."
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="rounded-xl py-3.5 px-8 text-xs font-mono font-bold uppercase tracking-wider text-black transition-all flex items-center gap-2 cursor-pointer outline-none shadow-md"
                      style={{ 
                        backgroundColor: colors.starHex,
                      }}
                    >
                      <Save className="h-4 w-4" /> Save Profile Preferences
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
