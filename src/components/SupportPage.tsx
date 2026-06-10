import React, { useState, useEffect } from 'react';
import { User, SupportTicket, TicketMessage } from '../types';
import { MessageSquare, HelpCircle, Lock, AlertCircle, ShieldAlert, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface SupportPageProps {
  user: User | null;
  onLogin: (user: User) => void;
  siteName: string;
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

export default function SupportPage({ user, onLogin, siteName, themeColor }: SupportPageProps) {
  const colors = getAccentColor(themeColor);

  // Tickets local state synchronized with localStorage
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isCreatingTicket, setIsCreatingTicket] = useState<boolean>(false);

  // Ticket creation form fields
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketCategory, setTicketCategory] = useState('minecraft');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Reply state
  const [chatReply, setChatReply] = useState('');

  // Inline auth state for logged-out users
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authError, setAuthError] = useState('');

  // Load tickets and members on mount & when user session changes
  useEffect(() => {
    const saved = localStorage.getItem('vx_tickets');
    if (saved) {
      const parsed = JSON.parse(saved) as SupportTicket[];
      setTickets(parsed);
      // If we already had a selected ticket, find the fresh version
      if (selectedTicket) {
        const found = parsed.find(t => t.id === selectedTicket.id);
        if (found) {
          setSelectedTicket(found);
        }
      }
    }
  }, [user]);

  // Save utility
  const saveTickets = (updated: SupportTicket[]) => {
    setTickets(updated);
    localStorage.setItem('vx_tickets', JSON.stringify(updated));
  };

  // Auth submits
  const handleInlineAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const membersString = localStorage.getItem('vx_members_list') || '[]';
    const membersList = JSON.parse(membersString) as { email: string; password?: string; username: string }[];

    if (isRegisterMode) {
      if (!authUsername || !authEmail || !authPassword) {
        setAuthError('Please fill in all form inputs.');
        return;
      }
      const trimmedEmail = authEmail.trim().toLowerCase();
      if (membersList.some(m => m.email === trimmedEmail)) {
        setAuthError('This email is already registered on our node database.');
        return;
      }

      const newMember = {
        username: authUsername.trim(),
        email: trimmedEmail,
        password: authPassword
      };

      localStorage.setItem('vx_members_list', JSON.stringify([...membersList, newMember]));
      
      const loggedUser: User = {
        username: newMember.username,
        email: newMember.email,
        isAdmin: false
      };
      
      onLogin(loggedUser);
    } else {
      const trimmedEmail = authEmail.trim().toLowerCase();
      // Safe authentication check with saved credentials
      const found = membersList.find(m => m.email === trimmedEmail && m.password === authPassword);

      if (found) {
        const loggedUser: User = {
          username: found.username,
          email: found.email,
          isAdmin: found.email === 'admin@vxhost.in'
        };
        onLogin(loggedUser);
      } else {
        setAuthError('Invalid credentials. Please double check password or register.');
      }
    }
  };

  // Launch new support ticket
  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !ticketSubject || !ticketMessage) return;

    const newTicket: SupportTicket = {
      id: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
      userEmail: user.email,
      userName: user.username,
      subject: ticketSubject.trim(),
      category: ticketCategory,
      priority: ticketPriority,
      status: 'open',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `M-${Date.now()}`,
          senderName: user.username,
          senderEmail: user.email,
          isAdmin: false,
          message: ticketMessage.trim(),
          timestamp: new Date().toISOString()
        }
      ]
    };

    const updated = [newTicket, ...tickets];
    saveTickets(updated);
    setSelectedTicket(newTicket);
    setIsCreatingTicket(false);

    // Reset fields
    setTicketSubject('');
    setTicketMessage('');
  };

  // Send message on active thread
  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatReply.trim() || !selectedTicket || !user || selectedTicket.status === 'suspended') return;

    const newMsg: TicketMessage = {
      id: `M-${Date.now()}`,
      senderName: user.username,
      senderEmail: user.email,
      isAdmin: user.isAdmin || false,
      message: chatReply.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...selectedTicket.messages, newMsg];
    const updatedTicket: SupportTicket = {
      ...selectedTicket,
      messages: updatedMessages,
      status: user.isAdmin ? 'answered' : 'open'
    };

    const updatedList = tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t);
    saveTickets(updatedList);
    setSelectedTicket(updatedTicket);
    setChatReply('');
  };

  // Switch status from customer perspective
  const handleToggleTicketStatus = (tktId: string, newStatus: 'open' | 'closed') => {
    const updated = tickets.map(t => {
      if (t.id === tktId) {
        return { ...t, status: newStatus };
      }
      return t;
    });
    saveTickets(updated);
    if (selectedTicket && selectedTicket.id === tktId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center">
      
      {/* Top Banner Header */}
      <div className="max-w-xl mx-auto space-y-3 mb-10 text-center">
        <span 
          className="font-mono text-[10px] font-bold tracking-widest uppercase rounded px-3 py-1 bg-white/5"
          style={{ color: colors.starHex }}
        >
          {siteName} Nodes Helpdesk
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-black italic uppercase leading-none text-white tracking-tighter">
          SUPPORT DESK
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm font-sans">
          Connect directly with infrastructure engineers or view active support ticket logs.
        </p>
      </div>

      {!user ? (
        /* Logged Out User support Auth screen */
        <div className="max-w-md mx-auto relative rounded-3xl border border-white/5 bg-white/[0.01] p-6 sm:p-10 text-left shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ backgroundColor: colors.starHex }} />
          
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <Lock className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
              <h3 className="font-display text-white text-lg font-bold uppercase tracking-wide">
                {isRegisterMode ? 'Verify Customer Identity' : 'Support Desk Access'}
              </h3>
              <p className="text-zinc-500 text-xs font-sans">
                Please authenticate your server account credentials to contact the staff department.
              </p>
            </div>

            {authError && (
              <div className="p-3.5 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleInlineAuthSubmit} className="space-y-4">
              {isRegisterMode && (
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-mono tracking-widest uppercase text-zinc-400 font-bold">
                    Choose Username
                  </label>
                  <input
                    type="text"
                    required
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    placeholder="e.g. MyNodeManager"
                    className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-white/20 focus:outline-none focus:ring-0 outline-none font-sans"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[9px] font-mono tracking-widest uppercase text-zinc-400 font-bold">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-white/20 focus:outline-none focus:ring-0 outline-none font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] font-mono tracking-widest uppercase text-zinc-400 font-bold">
                  Support Pin / Password
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-white/20 focus:outline-none focus:ring-0 outline-none font-mono"
                />
              </div>

              <div className="pt-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full rounded-xl py-3 px-4 text-xs font-bold uppercase tracking-wider text-black transition-all cursor-pointer outline-none shadow-md font-sans"
                  style={{ backgroundColor: colors.starHex }}
                >
                  {isRegisterMode ? 'Register & Open Ticket' : 'AUTHENTICATE ACCESS'}
                </motion.button>
              </div>
            </form>

            <div className="border-t border-white/5 pt-4 text-center">
              <button
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setAuthError('');
                }}
                className="text-zinc-500 hover:text-white text-xs font-sans"
              >
                {isRegisterMode ? 'Already have an account? Sign In' : "Don't have a login? Register Server Profile"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated Support interface */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start">
          
          {/* Left Tickets Panel list */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="font-display text-white font-extrabold text-xs uppercase tracking-widest">
                My Active Tickets ({tickets.filter(t => t.userEmail === user.email).length})
              </h3>
              <button
                onClick={() => {
                  setIsCreatingTicket(true);
                  setSelectedTicket(null);
                }}
                className="rounded-full bg-white text-black px-4 py-1.5 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all cursor-pointer outline-none"
              >
                ➕ Create Ticket
              </button>
            </div>

            {tickets.filter(t => t.userEmail === user.email).length === 0 ? (
              <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
                <MessageSquare className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-500 text-xs font-sans">You don't have any pending support tickets. Submit one to open a live chat.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {tickets
                  .filter(t => t.userEmail === user.email)
                  .map((t) => {
                    const isSelected = selectedTicket && selectedTicket.id === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => { setSelectedTicket(t); setIsCreatingTicket(false); }}
                        className={`w-full text-left rounded-xl p-4 border transition-all cursor-pointer block outline-none ${
                          isSelected 
                            ? 'bg-white/10 border-white/20 shadow-lg' 
                            : 'border-white/5 bg-zinc-950/40 hover:bg-[#0A0A0A]'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-[9px] text-zinc-500 font-bold">{t.id}</span>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                            t.priority === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-500/10 text-zinc-400'
                          }`}>
                            {t.priority}
                          </span>
                        </div>
                        <h4 className="text-xs font-extrabold text-white mt-1 uppercase line-clamp-1">{t.subject}</h4>
                        
                        <div className="flex mt-3 gap-2 items-center leading-none">
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            t.status === 'open' ? 'bg-amber-400' : t.status === 'answered' ? 'bg-violet-400 animate-pulse' : 'bg-zinc-500'
                          }`} />
                          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                            {t.status === 'answered' ? 'Staff Replied' : t.status}
                          </span>
                        </div>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Right Ticket Workspace */}
          <div className="lg:col-span-7">
            {isCreatingTicket ? (
              /* Create conversational form */
              <form onSubmit={handleCreateTicketSubmit} className="rounded-3xl border border-white/5 bg-[#0D0D0D] p-6 lg:p-8 space-y-4 shadow-xl">
                <div className="border-b border-white/5 pb-3">
                  <h4 className="font-display font-black text-xs uppercase tracking-widest text-emerald-400" style={{ color: colors.starHex }}>
                    Create Ticket Topic
                  </h4>
                  <p className="text-zinc-500 text-[10px] uppercase font-mono mt-0.5">Submit inquiry directly into the support cluster pipeline.</p>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-zinc-400 font-mono uppercase tracking-widest mb-1.5">Subject Heading</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. Memory leak on KVM / Domain registration"
                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-400 font-mono uppercase tracking-widest mb-1.5">General Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20"
                    >
                      <option value="minecraft">Minecraft Server</option>
                      <option value="vps">Cloud VPS Node</option>
                      <option value="discord">Discord Bot Slice</option>
                      <option value="billing">Billing Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-400 font-mono uppercase tracking-widest mb-1.5 text-right">Severity priority</label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['low', 'medium', 'high'] as const).map(prio => (
                        <button
                          key={prio}
                          type="button"
                          onClick={() => setTicketPriority(prio)}
                          className={`rounded-lg py-3 text-[10px] font-mono font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                            ticketPriority === prio 
                              ? prio === 'high' ? 'bg-red-500/20 text-red-500 border border-red-500/40' : 'bg-white/15 text-white'
                              : 'bg-[#0A0A0A] border border-white/5 text-zinc-500'
                          }`}
                        >
                          {prio}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-zinc-400 font-mono uppercase tracking-widest mb-1.5">Inquiry detail description</label>
                  <textarea
                    rows={4}
                    required
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Type detail server specifications or issue details here..."
                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-sans"
                  />
                </div>

                <div className="flex gap-2 justify-end border-t border-white/5 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreatingTicket(false)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl px-5 py-2.5 text-xs font-bold font-mono tracking-widest uppercase text-black cursor-pointer"
                    style={{ backgroundColor: colors.starHex }}
                  >
                    SUBMIT INQUIRY
                  </button>
                </div>
              </form>
            ) : selectedTicket ? (
              /* Conversation Live Chat view */
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                  <div>
                    <span className="font-mono text-[9px] text-zinc-500">TICKETING CORE ({selectedTicket.id})</span>
                    <h4 className="text-sm font-bold text-white uppercase mt-0.5">{selectedTicket.subject}</h4>
                  </div>
                  <div>
                    <span className={`text-[10px] font-mono font-bold uppercase px-3 py-1.5 rounded-lg border leading-none ${
                      selectedTicket.status === 'closed' ? 'bg-zinc-500/5 text-zinc-500 border-zinc-500/10' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse'
                    }`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                </div>

                {/* Messages stream log */}
                <div className="max-h-[300px] overflow-y-auto space-y-3 bg-[#0A0A0A]/60 p-4 rounded-xl border border-white/5 font-sans">
                  {selectedTicket.messages.map((m) => (
                    <div 
                      key={m.id}
                      className={`p-3.5 rounded-2xl max-w-[85%] text-xs ${
                        m.isAdmin 
                          ? 'bg-[#0D0D0D] border border-white/10 text-zinc-300' 
                          : 'ml-auto bg-white/5 border-r-2 text-zinc-200'
                      }`}
                      style={{ borderRightColor: !m.isAdmin ? colors.starHex : 'transparent' }}
                    >
                      <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1">
                        <span className="font-bold">{m.senderName} {m.isAdmin ? '👑 Support Team' : ''}</span>
                        <span>{new Date(m.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="whitespace-pre-line leading-relaxed">{m.message}</p>
                    </div>
                  ))}
                </div>

                {selectedTicket.status === 'suspended' && (
                  <div className="p-3.5 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-400 font-mono text-[11px] leading-relaxed flex items-center gap-2">
                    <ShieldAlert className="h-4.5 w-4.5 text-rose-400 shrink-0" />
                    <span>This ticket has been suspended by support staff. Standard customer replies are locked.</span>
                  </div>
                )}

                {selectedTicket.status !== 'closed' && selectedTicket.status !== 'suspended' ? (
                  <form onSubmit={handleReplySubmit} className="space-y-2">
                    <textarea
                      rows={3}
                      value={chatReply}
                      onChange={(e) => setChatReply(e.target.value)}
                      placeholder="Type client reply or updates here..."
                      className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white/20 font-sans"
                    />
                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => handleToggleTicketStatus(selectedTicket.id, 'closed')}
                        className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-red-400"
                      >
                        Mark as closed / resolved
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl px-5 py-2.5 text-xs font-bold font-mono tracking-widest uppercase text-black"
                        style={{ backgroundColor: colors.starHex }}
                      >
                        SEND REPLY
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-center font-mono text-zinc-500 text-[10px] uppercase py-3 border border-dashed border-white/5 rounded-xl">
                    {selectedTicket.status === 'suspended' ? 'Thread suspended. Chat interactions are frozen.' : 'This support thread is resolved. Reopen ticket below if you have follow-up questions.'}
                  </p>
                )}

                {selectedTicket.status === 'closed' && (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => handleToggleTicketStatus(selectedTicket.id, 'open')}
                      className="text-xs font-bold uppercase font-mono tracking-widest bg-white/5 hover:bg-white/10 px-5 py-2 border border-white/5 hover:border-white/20 rounded-xl"
                    >
                      Reopen Support Ticket
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-24 bg-black/10 border border-dashed border-white/5 rounded-3xl">
                <HelpCircle className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
                <p className="text-sm text-zinc-400 font-sans">Select any active support topic from left panel, or launch a brand new ticket.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
