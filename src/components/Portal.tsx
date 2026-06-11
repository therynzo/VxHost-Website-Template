import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, User as UserIcon, ShieldAlert, Laptop, Terminal, Play, Square, RefreshCw, 
  Plus, Trash2, Edit3, Check, X, Clipboard, ArrowRight, MessageSquare, AlertCircle, HelpCircle,
  Key, ShieldCheck
} from 'lucide-react';
import { User, SupportTicket, TicketMessage, HostingPlan, HostCategory } from '../types';

interface PortalProps {
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  siteName: string;
  setSiteName: (name: string) => void;
  siteLogo: string;
  setSiteLogo: (logo: string) => void;
  siteLogoImage: string;
  setSiteLogoImage: (img: string) => void;
  contactEmail: string;
  setContactEmail: (email: string) => void;
  contactAddress: string;
  setContactAddress: (address: string) => void;
  deployNodeLink: string;
  setDeployNodeLink: (link: string) => void;
  controlPanelLink: string;
  setControlPanelLink: (link: string) => void;
  billingPanelLink: string;
  setBillingPanelLink: (link: string) => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  plans: HostingPlan[];
  setPlans: (plans: HostingPlan[]) => void;
  isMaintenanceActive?: boolean;
  setIsMaintenanceActive?: (active: boolean) => void;
  setIsSiteUnlocked?: (unlocked: boolean) => void;
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
        shadow: 'shadow-[0_0_20px_rgba(139,92,246,0.25)]',
        colorName: 'Violet',
        accentHex: '#a78bfa'
      };
    case 'emerald':
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-400',
        bgHover: 'hover:bg-emerald-300',
        bgMuted: 'bg-emerald-400/10',
        border: 'border-emerald-400',
        shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
        colorName: 'Emerald',
        accentHex: '#34d399'
      };
    case 'cyan':
      return {
        text: 'text-cyan-400',
        bg: 'bg-cyan-400',
        bgHover: 'hover:bg-cyan-300',
        bgMuted: 'bg-cyan-400/10',
        border: 'border-cyan-400',
        shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]',
        colorName: 'Cyan',
        accentHex: '#22d3ee'
      };
    case 'rose':
      return {
        text: 'text-rose-400',
        bg: 'bg-rose-400',
        bgHover: 'hover:bg-rose-300',
        bgMuted: 'bg-rose-400/10',
        border: 'border-rose-400',
        shadow: 'shadow-[0_0_20px_rgba(244,63,94,0.25)]',
        colorName: 'Rose',
        accentHex: '#fb7185'
      };
    case 'yellow':
    default:
      return {
        text: 'text-yellow-400',
        bg: 'bg-yellow-400',
        bgHover: 'hover:bg-yellow-300',
        bgMuted: 'bg-yellow-400/10',
        border: 'border-yellow-400',
        shadow: 'shadow-[0_0_20px_rgba(250,204,21,0.25)]',
        colorName: 'Premium Yellow',
        accentHex: '#facc15'
      };
  }
};

const THEME_OPTIONS = ['yellow', 'violet', 'emerald', 'cyan', 'rose'];

export default function Portal({
  user,
  onLogin,
  onLogout,
  siteName,
  setSiteName,
  siteLogo,
  setSiteLogo,
  siteLogoImage,
  setSiteLogoImage,
  contactEmail,
  setContactEmail,
  contactAddress,
  setContactAddress,
  deployNodeLink,
  setDeployNodeLink,
  controlPanelLink,
  setControlPanelLink,
  billingPanelLink,
  setBillingPanelLink,
  themeColor,
  setThemeColor,
  plans,
  setPlans,
  isMaintenanceActive,
  setIsMaintenanceActive,
  setIsSiteUnlocked
}: PortalProps) {
  // Login states
  const [isRegister, setIsRegister] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active view states
  const [activeTab, setActiveTab] = useState<'profile' | 'tickets'>('profile');
  const [adminTab, setAdminTab] = useState<'site' | 'plans' | 'tickets' | 'members' | 'maintenance'>('site');

  // Local draft states for global settings - supports: anything changed shows a save option
  const [draftSiteName, setDraftSiteName] = useState(siteName);
  const [draftSiteLogo, setDraftSiteLogo] = useState(siteLogo);
  const [draftSiteLogoImage, setDraftSiteLogoImage] = useState(siteLogoImage || '');
  const [draftContactEmail, setDraftContactEmail] = useState(contactEmail);
  const [draftContactAddress, setDraftContactAddress] = useState(contactAddress);
  const [draftDeployNodeLink, setDraftDeployNodeLink] = useState(deployNodeLink);
  const [draftControlPanelLink, setDraftControlPanelLink] = useState(controlPanelLink || 'https://control.vxhost.in');
  const [draftBillingPanelLink, setDraftBillingPanelLink] = useState(billingPanelLink || 'https://billing.vxhost.in');
  const [draftThemeColor, setDraftThemeColor] = useState(themeColor);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  // Members lists
  const [members, setMembers] = useState<any[]>([]);

  // Maintenance operations state
  const [localMaintenanceActive, setLocalMaintenanceActive] = useState(() => localStorage.getItem('vx_maintenance_active') === 'true');
  const [licenseKeys, setLicenseKeys] = useState<any[]>([]);
  const [keyMaxUses, setKeyMaxUses] = useState<number>(5);
  const [keyExpiryDate, setKeyExpiryDate] = useState<string>('2026-12-31');
  const [keyGenSuccess, setKeyGenSuccess] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Dual loading local/api to fast render and sync real state from backend
  useEffect(() => {
    // Fetch current maintenance active status
    fetch('/api/maintenance')
      .then(res => res.json())
      .then(data => {
        setLocalMaintenanceActive(data.active);
        localStorage.setItem('vx_maintenance_active', data.active ? 'true' : 'false');
        if (setIsMaintenanceActive) {
          setIsMaintenanceActive(data.active);
        }
      })
      .catch(err => console.error('Error fetching maintenance state on mount:', err));

    // Fetch license keys database list from server
    fetch('/api/licenses')
      .then(res => res.json())
      .then(data => {
        setLicenseKeys(data);
      })
      .catch(err => console.error('Error fetching license files list:', err));
  }, []);

  const generateLicenseKey = (maxUsesInput: number, expiryDateInput: string) => {
    fetch('/api/licenses/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maxUses: maxUsesInput, expiryDate: expiryDateInput })
    })
      .then(res => res.json())
      .then(newLicense => {
        setLicenseKeys(prev => [newLicense, ...prev]);
        setKeyGenSuccess(newLicense.key);
        setTimeout(() => {
          setKeyGenSuccess('');
        }, 4500);
      })
      .catch(err => console.error('Error generating new license key:', err));
  };

  const toggleKeyStatus = (keyStr: string) => {
    fetch('/api/licenses/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: keyStr })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLicenseKeys(prev => prev.map(k => k.key === keyStr ? data.license : k));
        }
      })
      .catch(err => console.error('Error toggling license status:', err));
  };

  const deleteKey = (keyStr: string) => {
    fetch(`/api/licenses/${encodeURIComponent(keyStr)}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLicenseKeys(prev => prev.filter(k => k.key !== keyStr));
        }
      })
      .catch(err => console.error('Error deleting license content:', err));
  };

  const toggleMaintenance = () => {
    const nextVal = !localMaintenanceActive;
    
    fetch('/api/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: nextVal })
    })
      .then(res => res.json())
      .then(data => {
        setLocalMaintenanceActive(data.active);
        localStorage.setItem('vx_maintenance_active', data.active ? 'true' : 'false');
        
        if (data.active) {
          localStorage.setItem('vx_site_unlocked', 'false');
          if (setIsSiteUnlocked) {
            setIsSiteUnlocked(false);
          }
        }
        
        if (setIsMaintenanceActive) {
          setIsMaintenanceActive(data.active);
        }
      })
      .catch(err => console.error('Error toggling system maintenance active:', err));
  };

  // Update drafts when props change under-the-hood
  useEffect(() => {
    setDraftSiteName(siteName);
    setDraftSiteLogo(siteLogo);
    setDraftSiteLogoImage(siteLogoImage || '');
    setDraftContactEmail(contactEmail);
    setDraftContactAddress(contactAddress);
    setDraftDeployNodeLink(deployNodeLink);
    setDraftControlPanelLink(controlPanelLink || 'https://control.vxhost.in');
    setDraftBillingPanelLink(billingPanelLink || 'https://billing.vxhost.in');
    setDraftThemeColor(themeColor);
  }, [siteName, siteLogo, siteLogoImage, contactEmail, contactAddress, deployNodeLink, controlPanelLink, billingPanelLink, themeColor]);

  // Load custom members from local storage or seed
  useEffect(() => {
    const savedMembers = localStorage.getItem('vx_members_list');
    if (savedMembers) {
      setMembers(JSON.parse(savedMembers));
    } else {
      const initialMembers = [
        { username: 'Rynzo Dev', email: 'dev@rynzo.io', createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), lastActive: new Date(Date.now() - 3600000).toISOString(), status: 'Active' },
        { username: 'Steve Blocks', email: 'guildmaster@vanilla.net', createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), lastActive: new Date(Date.now() - 10 * 3600000).toISOString(), status: 'Active' },
        { username: 'Maddy Corp', email: 'maddy@gmail.com', createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), lastActive: new Date(Date.now() - 15 * 3600000).toISOString(), status: 'Suspended' }
      ];
      localStorage.setItem('vx_members_list', JSON.stringify(initialMembers));
      setMembers(initialMembers);
    }
  }, []);

  const hasUnsavedChanges = 
    draftSiteName !== siteName ||
    draftSiteLogo !== siteLogo ||
    draftSiteLogoImage !== siteLogoImage ||
    draftContactEmail !== contactEmail ||
    draftContactAddress !== contactAddress ||
    draftDeployNodeLink !== deployNodeLink ||
    draftControlPanelLink !== controlPanelLink ||
    draftBillingPanelLink !== billingPanelLink ||
    draftThemeColor !== themeColor;

  const handleSaveGlobalSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSiteName(draftSiteName);
    setSiteLogo(draftSiteLogo);
    setSiteLogoImage(draftSiteLogoImage);
    setContactEmail(draftContactEmail);
    setContactAddress(draftContactAddress);
    setDeployNodeLink(draftDeployNodeLink);
    setControlPanelLink(draftControlPanelLink);
    setBillingPanelLink(draftBillingPanelLink);
    setThemeColor(draftThemeColor);
    
    setShowSaveNotification(true);
    setTimeout(() => {
      setShowSaveNotification(false);
    }, 4000);
  };

  // Support ticket system states
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('minecraft');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [ticketMessage, setTicketMessage] = useState('');
  const [chatReply, setChatReply] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteMemberEmail, setConfirmDeleteMemberEmail] = useState<string | null>(null);

  // User profile states
  const [profileUsername, setProfileUsername] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileUsername(user.username);
      setProfileEmail(user.email);
      const savedMembers = localStorage.getItem('vx_members_list');
      if (savedMembers) {
        const membersList = JSON.parse(savedMembers);
        const match = membersList.find((m: any) => m.email === user.email);
        if (match) {
          setProfilePassword(match.password || 'vxclient');
        } else {
          setProfilePassword('vxclient');
        }
      } else {
        setProfilePassword('vxclient');
      }
    }
  }, [user]);

  // Plan editing states
  const [editingPlan, setEditingPlan] = useState<HostingPlan | null>(null);
  const [editingSpecs, setEditingSpecs] = useState<{ label: string; value: string }[]>([]);
  const [editingFeatures, setEditingFeatures] = useState<string[]>([]);
  const [newFeatureText, setNewFeatureText] = useState('');

  // Client simulated servers list
  const [userServers, setUserServers] = useState<any[]>([]);
  const [isOrderingNode, setIsOrderingNode] = useState(false);
  const [orderCategory, setOrderCategory] = useState<HostCategory>('minecraft');
  const [orderPlanId, setOrderPlanId] = useState('');
  const [deploymentLog, setDeploymentLog] = useState<string[]>([]);
  const [deploymentProgress, setDeploymentProgress] = useState(0);

  // Focus consoles for managing simulated node
  const [activeConsoleServer, setActiveConsoleServer] = useState<any | null>(null);
  const [consolePowerState, setConsolePowerState] = useState<'online' | 'offline' | 'restarting'>('online');
  const [mockConsoleLogs, setMockConsoleLogs] = useState<string[]>([]);
  const [consoleCommand, setConsoleCommand] = useState('');

  const colors = getAccentColor(themeColor);

  // Initial load of tickets & custom servers
  useEffect(() => {
    const savedTickets = localStorage.getItem('vx_tickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    } else {
      // Seed initial dummy tickets and store
      const initialTickets: SupportTicket[] = [
        {
          id: 'TKT-92041',
          userEmail: 'dev@rynzo.io',
          userName: 'Rynzo Dev',
          subject: ' rDNS setup help on Cloud VPS',
          category: 'vps',
          priority: 'medium',
          status: 'answered',
          createdAt: new Date(Date.now() - 36000000).toISOString(),
          messages: [
            {
              id: 'M1',
              senderName: 'Rynzo Dev',
              senderEmail: 'dev@rynzo.io',
              isAdmin: false,
              message: 'Good day! I recently launched a Cloud VPS Node. Can you set up the rDNS pointer from my target IP to custom host mail.rynzo.io?',
              timestamp: new Date(Date.now() - 36000000).toISOString()
            },
            {
              id: 'M2',
              senderName: 'Staff Admin',
              senderEmail: 'admin@vxhost.in',
              isAdmin: true,
              message: 'Hello! I have pointed reversing loops successfully for your IPv4. Propagation should finish within 30 minutes. Let us know if you need anything else.',
              timestamp: new Date(Date.now() - 18000000).toISOString()
            }
          ]
        }
      ];
      localStorage.setItem('vx_tickets', JSON.stringify(initialTickets));
      setTickets(initialTickets);
    }

    const savedUserServers = localStorage.getItem('vx_user_servers');
    if (savedUserServers) {
      setUserServers(JSON.parse(savedUserServers));
    } else {
      // Seed initial mock user servers
      const initialServers = [
        {
          id: 'NODE-71',
          name: 'Survival Craft Guild',
          category: 'minecraft',
          planName: 'Iron Plan (8GB)',
          ipAddress: '144.91.81.18:25565',
          status: 'online',
          loadCpu: 12,
          loadRam: 48,
          maxRam: '8 GB'
        },
        {
          id: 'NODE-102',
          name: 'Starlite JS Bot Daemon',
          category: 'discord',
          planName: 'Dev Node (2GB)',
          ipAddress: '15.90.111.4:8040',
          status: 'online',
          loadCpu: 3,
          loadRam: 22,
          maxRam: '2 GB'
        }
      ];
      localStorage.setItem('vx_user_servers', JSON.stringify(initialServers));
      setUserServers(initialServers);
    }
  }, []);

  // Sync tickets back to localStorage on change
  const saveTicketsState = (updatedTickets: SupportTicket[]) => {
    setTickets(updatedTickets);
    localStorage.setItem('vx_tickets', JSON.stringify(updatedTickets));
  };

  // Auth Submit handler
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!emailInput || !passwordInput) {
      setAuthError('Please fill out all credentials.');
      return;
    }

    // Check pre-configured Admin account: admin@vxhost.in / vxadmin
    if (emailInput === 'admin@vxhost.in') {
      if (passwordInput === 'vxadmin') {
        const adminUser: User = {
          username: 'Master Admin',
          email: 'admin@vxhost.in',
          isAdmin: true
        };
        onLogin(adminUser);
        setAdminTab('site');
        return;
      } else {
        setAuthError('Incorrect Password for Admin account.');
        return;
      }
    }

    // Standard client user logins
    const trimmedEmail = emailInput.trim().toLowerCase();
    const savedMembersList = localStorage.getItem('vx_members_list');
    let membersListArray = savedMembersList ? JSON.parse(savedMembersList) : [];

    if (isRegister) {
      // 1. REGISTRATION MODE
      if (!usernameInput.trim()) {
        setAuthError('Desired username is required to register.');
        return;
      }
      if (membersListArray.some((m: any) => m.email.toLowerCase() === trimmedEmail)) {
        setAuthError('This email is already registered. Please sign in instead.');
        return;
      }

      const userRole: User = {
        username: usernameInput.trim(),
        email: trimmedEmail,
        isAdmin: false
      };

      const newMb = {
        username: userRole.username,
        email: userRole.email,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        status: 'Active',
        password: passwordInput
      };
      membersListArray.push(newMb);
      localStorage.setItem('vx_members_list', JSON.stringify(membersListArray));
      setMembers(membersListArray);
      onLogin(userRole);

    } else {
      // 2. SIGN IN MODE
      const matchedUser = membersListArray.find((m: any) => m.email.toLowerCase() === trimmedEmail);

      if (matchedUser) {
        // Retrieve and check correct password
        const expectedPassword = matchedUser.password || 'vxclient';
        if (passwordInput !== expectedPassword) {
          setAuthError('Incorrect password. Please verify your credentials or try registering.');
          return;
        }

        // Logic matched! Update profile lastActive
        membersListArray = membersListArray.map((m: any) => 
          m.email.toLowerCase() === trimmedEmail 
            ? { ...m, lastActive: new Date().toISOString() }
            : m
        );
        localStorage.setItem('vx_members_list', JSON.stringify(membersListArray));
        setMembers(membersListArray);

        const userRole: User = {
          username: matchedUser.username,
          email: matchedUser.email,
          isAdmin: false
        };
        onLogin(userRole);

      } else {
        // Email not registered yet, direct them to sign up
        setAuthError('No account found matching this email. Please register or check for typos.');
      }
    }
  };

  // User profile update handler
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!profileUsername || !profileEmail) {
      return;
    }

    // 1. Update in vx_members_list
    const savedMembersList = localStorage.getItem('vx_members_list');
    let membersListArray = savedMembersList ? JSON.parse(savedMembersList) : [];
    membersListArray = membersListArray.map((m: any) => 
      m.email === user.email 
        ? { 
            ...m, 
            username: profileUsername, 
            email: profileEmail, 
            password: profilePassword,
            lastActive: new Date().toISOString()
          }
        : m
    );
    localStorage.setItem('vx_members_list', JSON.stringify(membersListArray));
    setMembers(membersListArray);

    // 2. Also update their existing tickets' emails/names if their user credentials changed
    const savedTickets = localStorage.getItem('vx_tickets');
    if (savedTickets) {
      let tList = JSON.parse(savedTickets);
      tList = tList.map((t: any) => {
        if (t.userEmail === user.email) {
          return {
            ...t,
            userEmail: profileEmail,
            userName: profileUsername,
            messages: t.messages.map((m: any) => 
              m.senderEmail === user.email 
                ? { ...m, senderEmail: profileEmail, senderName: profileUsername } 
                : m
            )
          };
        }
        return t;
      });
      localStorage.setItem('vx_tickets', JSON.stringify(tList));
      setTickets(tList);
    }

    // 3. Sync to parent state
    const updatedUser: User = {
      ...user,
      username: profileUsername,
      email: profileEmail
    };
    onLogin(updatedUser);

    setProfileSaveSuccess(true);
    setTimeout(() => {
      setProfileSaveSuccess(false);
    }, 4000);
  };

  // Ticketing actions
  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    if (!user) return;

    const newTicket: SupportTicket = {
      id: `TKT-${Math.floor(Math.random() * 90000) + 10000}`,
      userEmail: user.email,
      userName: user.username,
      subject: ticketSubject,
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
          message: ticketMessage,
          timestamp: new Date().toISOString()
        }
      ]
    };

    const updatedTickets = [newTicket, ...tickets];
    saveTicketsState(updatedTickets);

    // Reset fields
    setTicketSubject('');
    setTicketMessage('');
    setIsCreatingTicket(false);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatReply || !selectedTicket || !user || selectedTicket.status === 'suspended') return;

    const newMsg: TicketMessage = {
      id: `M-${Date.now()}`,
      senderName: user.username,
      senderEmail: user.email,
      isAdmin: user.isAdmin || false,
      message: chatReply,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...selectedTicket.messages, newMsg];
    const updatedTicket: SupportTicket = {
      ...selectedTicket,
      messages: updatedMessages,
      status: user.isAdmin ? 'answered' : 'open'
    };

    const updatedTicketsList = tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t);
    saveTicketsState(updatedTicketsList);
    setSelectedTicket(updatedTicket);
    setChatReply('');
  };

  const handleToggleTicketStatus = (tktId: string, newStatus: 'open' | 'answered' | 'closed') => {
    const updated = tickets.map(t => {
      if (t.id === tktId) {
        return { ...t, status: newStatus };
      }
      return t;
    });
    saveTicketsState(updated);
    if (selectedTicket && selectedTicket.id === tktId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };

  const handleToggleSuspendTicket = (tktId: string) => {
    const updated = tickets.map(t => {
      if (t.id === tktId) {
        const nextStatus: SupportTicket['status'] = t.status === 'suspended' ? 'open' : 'suspended';
        return { ...t, status: nextStatus };
      }
      return t;
    });
    saveTicketsState(updated);
    if (selectedTicket && selectedTicket.id === tktId) {
      setSelectedTicket({ ...selectedTicket, status: selectedTicket.status === 'suspended' ? 'open' : 'suspended' });
    }
  };

  const handleDeleteTicket = (tktId: string) => {
    const updated = tickets.filter(t => t.id !== tktId);
    saveTicketsState(updated);
    setSelectedTicket(null);
    setConfirmDeleteId(null);
  };

  // Plan list management (Admin editing values)
  const handleEditPlanClick = (plan: HostingPlan) => {
    setEditingPlan(plan);
    setEditingSpecs([...plan.specs]);
    setEditingFeatures([...plan.features]);
  };

  const handleSavePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    const updatedPlans = plans.map(p => {
      if (p.id === editingPlan.id) {
        return {
          ...editingPlan,
          specs: editingSpecs,
          features: editingFeatures
        };
      }
      return p;
    });

    setPlans(updatedPlans);
    localStorage.setItem('vx_custom_plans', JSON.stringify(updatedPlans));
    setEditingPlan(null);
  };

  const handleAddPlanClick = () => {
    const newId = `plan-${Date.now()}`;
    const newPlanObj: HostingPlan = {
      id: newId,
      name: 'New Custom Plan',
      category: 'minecraft',
      priceUSD: 9.99,
      billingPeriod: 'month',
      description: 'Custom customized server specifications preset',
      specs: [
        { label: 'RAM', value: '8 GB DDR5' },
        { label: 'CPU', value: 'AMD/Intel Ryzen 4.2GHz' },
        { label: 'Storage', value: '100 GB Gen4 SSD' },
        { label: 'Bandwidth', value: '10 Gbps Edge Uplink' }
      ],
      features: [
        'Premium Control Software Panel',
        'Physical low-ping carrier transit'
      ]
    };
    const updated = [newPlanObj, ...plans];
    setPlans(updated);
    localStorage.setItem('vx_custom_plans', JSON.stringify(updated));
    handleEditPlanClick(newPlanObj);
  };

  const handleDeletePlan = (planId: string) => {
    const updated = plans.filter(p => p.id !== planId);
    setPlans(updated);
    localStorage.setItem('vx_custom_plans', JSON.stringify(updated));
    if (editingPlan && editingPlan.id === planId) {
      setEditingPlan(null);
    }
  };

  // Deployment simulation triggers
  const handleDeploySimulate = () => {
    const selectedPlan = plans.find(p => p.id === orderPlanId);
    if (!selectedPlan) return;

    setIsOrderingNode(true);
    setDeploymentLog([]);
    setDeploymentProgress(5);

    const logs = [
      'Initializing Node socket handshakes...',
      'Setting up virtualization container slice...',
      'Binding public IPv4 block allocation...',
      'Extracting default core panel files...',
      'Linking edge network telemetry logs...',
      'Deployment fully finished!'
    ];

    let count = 0;
    const interval = setInterval(() => {
      if (count < logs.length) {
        setDeploymentLog(prev => [...prev, logs[count]]);
        setDeploymentProgress(Math.min(100, (count + 1) * 18));
        count++;
      } else {
        clearInterval(interval);
        // Save new server to custom state
        const hostIp = `${Math.floor(Math.random() * 200) + 40}.${Math.floor(Math.random() * 200) + 12}.${Math.floor(Math.random() * 200) + 90}:${orderCategory === 'minecraft' ? '25565' : '8220'}`;
        const newServ = {
          id: `NODE-${Math.floor(Math.random() * 800) + 100}`,
          name: `${user?.username || 'Client'}'s ${selectedPlan.name}`,
          category: orderCategory,
          planName: `${selectedPlan.name} (${selectedPlan.specs[0]?.value || 'Custom'})`,
          ipAddress: hostIp,
          status: 'online',
          loadCpu: 0,
          loadRam: 15,
          maxRam: selectedPlan.specs[0]?.value || '8 GB'
        };

        const updatedServers = [...userServers, newServ];
        setUserServers(updatedServers);
        localStorage.setItem('vx_user_servers', JSON.stringify(updatedServers));

        setTimeout(() => {
          setIsOrderingNode(false);
          setOrderPlanId('');
        }, 1000);
      }
    }, 850);
  };

  // Simulated node manage console state
  const handleOpenConsole = (srv: any) => {
    setActiveConsoleServer(srv);
    setConsolePowerState(srv.status === 'online' ? 'online' : 'offline');
    setMockConsoleLogs([
      `[SYSTEM] Connecting to container node terminal for ${srv.name}...`,
      `[SYSTEM] Secure shell established at daemon IP: ${srv.ipAddress}`,
      `[DAEMON] Loading JVM stack config metrics...`,
      `[DAEMON] Ryzen hyper-cores running under strict PCI virtualization layers.`,
      `[DAEMON] CPU LOAD: ${srv.loadCpu}% | MEMORY USED: ${srv.loadRam}%`,
      `[DAEMON] Active Port Listener secure. Type "help" or "status" to view telemetry.`
    ]);
  };

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleCommand) return;

    const cmd = consoleCommand.toLowerCase().trim();
    let reply = '';

    if (cmd === 'help') {
      reply = `[HELP] Commands loaded: "help", "status", "restart", "stop", "uptime", "clear"`;
    } else if (cmd === 'status') {
      reply = `[STATUS] Active node: ${activeConsoleServer?.name} | Health: OPTIMAL | Temp: 42°C`;
    } else if (cmd === 'restart') {
      reply = `[SYSTEM] Recalibrating server...`;
      setConsolePowerState('restarting');
      setTimeout(() => {
        setConsolePowerState('online');
        setMockConsoleLogs(prev => [...prev, `[DAEMON] Bootstrap sequence completed. Server online!`]);
      }, 2000);
    } else if (cmd === 'stop') {
      reply = `[SYSTEM] Halting container daemon hooks...`;
      setConsolePowerState('offline');
    } else {
      reply = `[CONSOLE] Command "${consoleCommand}" parsed. Action executed.`;
    }

    setMockConsoleLogs(prev => [...prev, `> ${consoleCommand}`, reply]);
    setConsoleCommand('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-[600px] bg-[#0A0A0A]">
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: AUTHENTICATION FORM SCREEN */}
        {!user ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-md mx-auto my-12 p-8 rounded-3xl border border-white/5 bg-[#0D0D0D] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: colors.accentHex }} />
            
            <div className="text-center mb-8">
              <span className="font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase rounded bg-white/5 border border-white/10 px-3 py-1.5 inline-block mb-3">
                Secure Client Portal Gateway
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black italic uppercase text-white tracking-widest">
                {isRegister ? 'REGISTER INSTANT' : 'SIGN IN ACCOUNT'}
              </h2>
              <p className="text-zinc-500 text-xs font-sans mt-2">
                {isRegister ? 'Join the ultimate hosting grid in seconds.' : 'Access support tickets, node stats, and active order lists.'}
              </p>
            </div>

            {authError && (
              <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 font-mono flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-widest mb-1.5">Desired Username</label>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="e.g. HostRuler"
                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:border-zinc-400 font-sans"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-widest mb-1.5">Enter Registered Email</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. dev@rynzo.io"
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:border-zinc-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-widest mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:border-zinc-400 font-mono"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full rounded-xl py-3 text-xs font-bold font-mono tracking-widest uppercase text-black text-center mt-3 cursor-pointer outline-none"
                style={{ backgroundColor: colors.accentHex }}
              >
                {isRegister ? 'CREATE ACCOUNT' : 'SECURE SIGN IN'}
              </motion.button>
            </form>

            <div className="border-t border-white/5 pt-6 mt-6">
              {isRegister ? (
                <p className="text-xs text-zinc-500 text-center font-sans">
                  Already have billing parameters?{' '}
                  <button onClick={() => setIsRegister(false)} className="underline hover:text-white" style={{ color: colors.accentHex }}>
                    Sign in here
                  </button>
                </p>
              ) : (
                <p className="text-xs text-zinc-500 text-center font-sans">
                  Need a secure terminal account?{' '}
                  <button onClick={() => setIsRegister(true)} className="underline hover:text-white" style={{ color: colors.accentHex }}>
                    Create account
                  </button>
                </p>
              )}
            </div>



          </motion.div>
        ) : user.isAdmin ? (
          
          /* VIEW 2: ADMINISTRATOR SITE CUSTOMIZER PANEL */
          <motion.div
            key="admin-dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Header branding */}
            <div className="rounded-3xl border border-white/5 bg-[#0D0D0D] p-6 sm:p-10 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: colors.accentHex }} />
              <div>
                <span className="font-mono text-[9px] font-bold text-red-400 uppercase tracking-widest bg-red-500/10 rounded px-2.5 py-1 inline-block mb-2 border border-red-500/20">
                  SYSTEM CORE ADMINISTRATOR DESK
                </span>
                <h1 className="font-display text-3xl sm:text-5xl font-black italic uppercase leading-none tracking-tighter text-white">
                  CONTROL PANEL
                </h1>
                <p className="text-zinc-500 text-xs sm:text-sm mt-1">
                  Adjust company metadata, pricing multipliers, custom themes, and support channels instantly.
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={onLogout}
                  className="rounded-full border border-white/10 bg-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Admin Sign Out
                </button>
              </div>
            </div>

            {/* Config Sub Tabs navigation bar */}
            <div className="flex flex-wrap gap-2 border-b border-white/5 pb-2">
              <button
                onClick={() => setAdminTab('site')}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer outline-none ${
                  adminTab === 'site' ? `${colors.bg} text-black font-extrabold` : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                Global Site Settings
              </button>
              <button
                onClick={() => setAdminTab('plans')}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer outline-none ${
                  adminTab === 'plans' ? `${colors.bg} text-black font-extrabold` : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                Plan Catalog Customizer
              </button>
              <button
                onClick={() => setAdminTab('tickets')}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer outline-none ${
                  adminTab === 'tickets' ? `${colors.bg} text-black font-extrabold` : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                Ticket Area ({tickets.filter(t => t.status === 'open').length})
              </button>
              <button
                onClick={() => setAdminTab('members')}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer outline-none ${
                  adminTab === 'members' ? `${colors.bg} text-black font-extrabold` : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                Registered Members ({members.length + 1})
              </button>
              <button
                onClick={() => setAdminTab('maintenance')}
                className={`hover:scale-105 active:scale-95 duration-200 transition-all px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl cursor-pointer outline-none ${
                  adminTab === 'maintenance' ? `${colors.bg} text-black font-extrabold shadow-sm` : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                Maintenance Locks
              </button>
            </div>

            {/* TAB CONTENT SUB-RENDERERS */}
            <div className="bg-[#0D0D0D] rounded-3xl border border-white/5 p-6 lg:p-8 relative">
              
              {showSaveNotification && (
                <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/5 p-4 flex items-center gap-3 text-xs text-green-400 font-sans">
                  <Check className="h-4 w-4 text-green-400 shrink-0" />
                  <div>
                    <p className="font-extrabold uppercase tracking-wide">✓ Configuration saved successfully!</p>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">All global links, company branding files, and currency states fully updated.</p>
                  </div>
                </div>
              )}

              {/* SUB TAB A: Site configurations */}
              {adminTab === 'site' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Left Column Config fields */}
                  <div className="space-y-4">
                    <h3 className="font-display text-white font-black text-xs uppercase tracking-widest border-b border-white/5 pb-2">
                      Dynamic Identity Specifications
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 font-mono tracking-wider uppercase mb-1.5">Company Label</label>
                        <input
                          type="text"
                          value={draftSiteName}
                          onChange={(e) => setDraftSiteName(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[9px] text-zinc-500 font-mono tracking-wider uppercase mb-1.5">Initials Logo Text</label>
                        <input
                          type="text"
                          maxLength={3}
                          value={draftSiteLogo}
                          onChange={(e) => setDraftSiteLogo(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    {/* Image Logo Upload Component integration requested by user */}
                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                      <label className="block text-[10px] font-bold text-zinc-400 font-mono tracking-wider uppercase mb-2">Upload Branding Image logo</label>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center p-1.5 overflow-hidden shrink-0">
                          {draftSiteLogoImage ? (
                            <img src={draftSiteLogoImage} alt="Logo preview" className="h-full w-full object-contain rounded" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="font-mono text-[9px] text-zinc-600 font-bold uppercase">TXT</span>
                          )}
                        </div>
                        <div className="flex-grow">
                          <input
                            type="file"
                            accept="image/*"
                            id="admin-logo-upload"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setDraftSiteLogoImage(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                          <div className="flex gap-2">
                            <label
                              htmlFor="admin-logo-upload"
                              className="cursor-pointer bg-white/5 text-white border border-white/10 hover:bg-white/10 text-xs px-3 py-2 rounded-lg font-bold"
                            >
                              Upload File
                            </label>
                            {draftSiteLogoImage && (
                              <button
                                type="button"
                                onClick={() => setDraftSiteLogoImage('')}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs px-3 py-2 rounded-lg border border-red-500/20 font-bold"
                              >
                                Clear Image
                              </button>
                            )}
                          </div>
                          <p className="text-[9px] text-zinc-500 font-mono mt-1">Converts to local base64 storage string instantly.</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 font-mono tracking-wider uppercase mb-1.5">Game Control Panel Link URL</label>
                        <input
                          type="text"
                          value={draftControlPanelLink}
                          onChange={(e) => setDraftControlPanelLink(e.target.value)}
                          placeholder="https://control.vxhost.in"
                          className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-[11px] text-white focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 font-mono tracking-wider uppercase mb-1.5">Billing Panel Link URL</label>
                        <input
                          type="text"
                          value={draftBillingPanelLink}
                          onChange={(e) => setDraftBillingPanelLink(e.target.value)}
                          placeholder="https://billing.vxhost.in"
                          className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-[11px] text-white focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 font-mono tracking-wider uppercase mb-1.5">Deploy Node Purchase Link URL</label>
                      <input
                        type="text"
                        value={draftDeployNodeLink}
                        onChange={(e) => setDraftDeployNodeLink(e.target.value)}
                        placeholder="https://billing.vxhost.in"
                        className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 font-mono tracking-wider uppercase mb-1.5 font-sans">Contact Support Email</label>
                      <input
                        type="email"
                        value={draftContactEmail}
                        onChange={(e) => setDraftContactEmail(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 font-mono tracking-wider uppercase mb-1.5">Datacenters Address coordinates</label>
                      <textarea
                        rows={2}
                        value={draftContactAddress}
                        onChange={(e) => setDraftContactAddress(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white focus:outline-none font-sans"
                      />
                    </div>
                  </div>

                  {/* Right Column: Theme selection & unalterable info */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-display text-white font-black text-xs uppercase tracking-widest border-b border-white/5 pb-2 mb-4">
                        Instant Theme color system selection
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {THEME_OPTIONS.map((opt) => {
                          const optionColors = getAccentColor(opt);
                          const isCurrent = opt === draftThemeColor;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setDraftThemeColor(opt)}
                              className={`flex items-center gap-3 rounded-xl p-3 text-left border cursor-pointer select-none transition-all ${
                                isCurrent 
                                  ? `${optionColors.bgMuted} font-bold text-white` 
                                  : 'border-white/5 bg-white/[0.02] hover:bg-white/5 text-zinc-400'
                              }`}
                              style={{
                                borderColor: isCurrent ? optionColors.accentHex : 'rgba(255,255,255,0.05)'
                              }}
                            >
                              <span className="h-5 w-5 rounded-full block border shadow-inner shrink-0" style={{ backgroundColor: optionColors.accentHex, borderColor: 'rgba(255,255,255,0.1)' }} />
                              <div className="flex flex-col">
                                <span className="text-xs uppercase font-mono tracking-widest font-extrabold">{opt}</span>
                                {isCurrent && <span className="text-[9px] text-zinc-400 font-medium font-sans">Active in Draft</span>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Developer Credits restriction guidelines */}
                    <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5 relative overflow-hidden">
                      <div className="absolute right-0 bottom-0 h-10 w-10 bg-yellow-400/10 rounded-tl-full flex items-center justify-center">
                        <Lock className="h-4 w-4 text-yellow-400" />
                      </div>
                      <h4 className="font-display text-yellow-400 font-bold text-sm uppercase mb-1">Developer attribution lock</h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed font-sans mb-3">
                        The authorship credit <strong>"made by TheRynzo"</strong> in the bottom web footer remains locked. This guarantees authorship trace integrity across all dynamically customized domains and hosting categories.
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        <span>Security verified under SHA-256 integrity check.</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* SUB TAB B: Plan customizer catalog list */}
              {adminTab === 'plans' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h3 className="font-display text-white font-black text-xs uppercase tracking-widest">
                        Hosting Hardware Preset catalogs
                      </h3>
                      <p className="text-zinc-500 text-[11px] mt-0.5">Edit, add, or delete any plan shown on the public tables instantly.</p>
                    </div>
                    <button
                      onClick={handleAddPlanClick}
                      className="flex items-center gap-2 rounded-full bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Create Plan
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Plans sidebar list */}
                    <div className="lg:col-span-4 max-h-[500px] overflow-y-auto space-y-2 pr-2 border-r border-white/5">
                      {plans.map((pl) => {
                        const isEditingThis = editingPlan && editingPlan.id === pl.id;
                        return (
                          <div
                            key={pl.id}
                            className={`rounded-xl p-3 border transition-all text-left flex justify-between items-center ${
                              isEditingThis 
                                ? 'bg-white/10 text-white' 
                                : 'border-white/5 bg-white/[0.02] hover:bg-white/5 text-zinc-300'
                            }`}
                            style={{
                              borderColor: isEditingThis ? colors.accentHex : 'rgba(255,255,255,0.05)'
                            }}
                          >
                            <button
                              onClick={() => handleEditPlanClick(pl)}
                              className="flex flex-col text-left flex-grow outline-none bg-transparent border-none cursor-pointer"
                            >
                              <span className="font-sans text-xs font-bold leading-none">{pl.name}</span>
                              <span className="font-mono text-[9px] text-zinc-500 uppercase mt-1">
                                {pl.category} • ${pl.priceUSD}/{pl.billingPeriod}
                              </span>
                            </button>
                            <button
                              onClick={() => handleDeletePlan(pl.id)}
                              className="text-zinc-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10"
                              title="Delete Plan"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Active Editor form */}
                    <div className="lg:col-span-8">
                      {editingPlan ? (
                        <form onSubmit={handleSavePlanSubmit} className="space-y-4">
                          <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#a78bfa] flex items-center gap-2" style={{ color: colors.accentHex }}>
                            <Edit3 className="h-3.5 w-3.5" /> Editing: {editingPlan.name}
                          </h4>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] font-bold text-zinc-500 font-mono uppercase tracking-widest mb-1.5">Plan Title Name</label>
                              <input
                                type="text"
                                value={editingPlan.name}
                                onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-zinc-500 font-mono uppercase tracking-widest mb-1.5">Base Price (USD)</label>
                              <input
                                type="number"
                                step="0.01"
                                value={editingPlan.priceUSD}
                                onChange={(e) => setEditingPlan({ ...editingPlan, priceUSD: parseFloat(e.target.value) })}
                                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white focus:outline-none font-mono"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[9px] font-bold text-zinc-500 font-mono uppercase tracking-widest mb-1.5">Billing Period</label>
                              <input
                                type="text"
                                value={editingPlan.billingPeriod}
                                onChange={(e) => setEditingPlan({ ...editingPlan, billingPeriod: e.target.value })}
                                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white focus:outline-none font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-zinc-500 font-mono uppercase tracking-widest mb-1.5">Server Category Type</label>
                              <select
                                value={editingPlan.category}
                                onChange={(e) => setEditingPlan({ ...editingPlan, category: e.target.value as HostCategory })}
                                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-xs text-white focus:outline-none"
                              >
                                <option value="minecraft">Minecraft Hosting</option>
                                <option value="vps">Cloud VPS KVM</option>
                                <option value="discord">Discord Bot Nodes</option>
                                <option value="web">Web Hosting cPanel</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-zinc-500 font-mono uppercase tracking-widest mb-1.5">Badge (Optional)</label>
                              <input
                                type="text"
                                value={editingPlan.badge || ''}
                                onChange={(e) => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                                placeholder="Popular / Starter"
                                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-zinc-500 font-mono uppercase tracking-widest mb-1.5">Short Card Description text</label>
                            <input
                              type="text"
                              value={editingPlan.description}
                              onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white focus:outline-none"
                            />
                          </div>

                          {/* Technical Hardware Specs inputs */}
                          <div className="space-y-2 border-t border-white/5 pt-3">
                            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Hardware Spec Details (e.g. RAM, CPU)</span>
                            <div className="grid grid-cols-2 gap-4">
                              {editingSpecs.map((spec, sidx) => (
                                <div key={sidx} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={spec.label}
                                    placeholder="Label (e.g. RAM)"
                                    onChange={(e) => {
                                      const copy = [...editingSpecs];
                                      copy[sidx].label = e.target.value;
                                      setEditingSpecs(copy);
                                    }}
                                    className="w-1/3 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white focus:outline-none"
                                  />
                                  <input
                                    type="text"
                                    value={spec.value}
                                    placeholder="Value (e.g. 8 GB DDR5)"
                                    onChange={(e) => {
                                      const copy = [...editingSpecs];
                                      copy[sidx].value = e.target.value;
                                      setEditingSpecs(copy);
                                    }}
                                    className="w-2/3 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white focus:outline-none font-mono"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Custom Features array customizer */}
                          <div className="space-y-2 border-t border-white/5 pt-3">
                            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">Core Loaded Features Checklist</span>
                            
                            <div className="flex flex-wrap gap-2">
                              {editingFeatures.map((ft, fidx) => (
                                <span key={fidx} className="inline-flex items-center gap-1.5 bg-white/5 border border-white/5 px-2.5 py-1 rounded text-xs text-zinc-300 font-sans">
                                  {ft}
                                  <button
                                    type="button"
                                    onClick={() => setEditingFeatures(editingFeatures.filter((_, idx) => idx !== fidx))}
                                    className="text-red-400 hover:text-red-300 font-bold ml-1"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>

                            <div className="flex gap-2 max-w-sm">
                              <input
                                type="text"
                                value={newFeatureText}
                                onChange={(e) => setNewFeatureText(e.target.value)}
                                placeholder="Add feature item..."
                                className="flex-grow rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (!newFeatureText) return;
                                  setEditingFeatures([...editingFeatures, newFeatureText]);
                                  setNewFeatureText('');
                                }}
                                className="bg-white text-black font-mono font-bold px-3 rounded-lg text-xs"
                              >
                                ADD
                              </button>
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end border-t border-white/5 pt-4">
                            <button
                              type="button"
                              onClick={() => setEditingPlan(null)}
                              className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="rounded-xl px-6 py-2 text-xs font-bold uppercase tracking-widest text-black"
                              style={{ backgroundColor: colors.accentHex }}
                            >
                              Save Specs
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="text-center py-20 bg-black/20 border border-dashed border-white/10 rounded-2xl">
                          <Clipboard className="h-8 w-8 text-zinc-600 mx-auto mb-3 animate-bounce" />
                          <p className="text-sm text-zinc-400 font-sans">Select any preset catalog plan from the list sidebar to customize its parameters and values.</p>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* SUB TAB C: Support ticket replies */}
              {adminTab === 'tickets' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Tickets list */}
                  <div className="lg:col-span-5 space-y-3 max-h-[500px] overflow-y-auto pr-2 border-r border-white/5Grid">
                    <h4 className="font-display text-white font-bold text-xs uppercase tracking-widest border-b border-white/5 pb-2">
                      Active Customer Inbound Questions
                    </h4>
                    {tickets.map((t) => {
                      const isSelected = selectedTicket && selectedTicket.id === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTicket(t)}
                          className={`w-full text-left rounded-xl p-3.5 border transition-all cursor-pointer block outline-none ${
                            isSelected 
                              ? 'bg-white/10 border-white/20' 
                              : 'border-white/5 bg-zinc-950/40 hover:bg-[#0A0A0A]'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-mono text-[10px] text-zinc-500 font-bold">{t.id}</span>
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                              t.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-zinc-500/10 text-zinc-400'
                            }`}>
                              {t.priority}
                            </span>
                          </div>
                          
                          <p className="text-xs font-extrabold text-white mt-1.5 leading-tight">{t.subject}</p>
                          <p className="text-[10px] text-zinc-400 font-mono mt-1">From: {t.userName}</p>

                          <div className="flex gap-2 mt-2.5 items-center">
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              t.status === 'open' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                            }`} />
                            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                              {t.status === 'open' ? 'Pending Admin Reply' : t.status}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Reply container */}
                  <div className="lg:col-span-7">
                    {selectedTicket ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                          <div>
                            <span className="font-mono text-[10px] text-zinc-500">SUBJECT STREAM ({selectedTicket.id})</span>
                            <h4 className="text-sm font-bold text-white uppercase mt-0.5">{selectedTicket.subject}</h4>
                          </div>
                          <div className="flex gap-1.5 flex-wrap">
                            {/* Suspend / Unsuspend */}
                            <button
                              onClick={() => handleToggleSuspendTicket(selectedTicket.id)}
                              className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border ${
                                selectedTicket.status === 'suspended'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-white/5 text-zinc-400 hover:text-amber-400 border-white/10'
                              }`}
                            >
                              {selectedTicket.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                            </button>

                            {/* Close / Reopen */}
                            {selectedTicket.status !== 'closed' ? (
                              <button
                                onClick={() => handleToggleTicketStatus(selectedTicket.id, 'closed')}
                                className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 hover:text-red-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
                              >
                                Close
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleTicketStatus(selectedTicket.id, 'open')}
                                className="text-[10px] font-mono font-bold uppercase tracking-wider text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20"
                              >
                                Reopen
                              </button>
                            )}

                            {/* Delete Thread with custom non-blocking double-click / state confirmation under iframe constraints */}
                            {confirmDeleteId === selectedTicket.id ? (
                              <div className="flex items-center gap-1 bg-red-500/10 rounded-lg p-1 border border-red-500/20">
                                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-red-400 px-2">Are you sure?</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTicket(selectedTicket.id)}
                                  className="text-[10px] font-mono font-bold uppercase tracking-wider bg-red-500 hover:bg-red-400 text-white px-2.5 py-1 rounded-md"
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#1c1c1c] text-zinc-400 hover:text-white px-2.5 py-1 rounded-md"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(selectedTicket.id)}
                                className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 hover:text-red-500 hover:bg-red-500/10 bg-white/5 px-3 py-1.5 rounded-lg border border-red-500/20"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>

                        {selectedTicket.status === 'suspended' && (
                          <div className="p-3.5 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-400 font-mono text-[11px] leading-relaxed flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse animate-duration-1000" />
                            <span>This ticket thread has been SUSPENDED by an administrator. Chat interactions are temporarily frozen.</span>
                          </div>
                        )}

                        {/* Thread message logs */}
                        <div className="max-h-[250px] overflow-y-auto space-y-3 bg-[#0A0A0A]/60 p-4 rounded-xl border border-white/5 font-sans">
                          {selectedTicket.messages.map((m) => (
                            <div 
                              key={m.id}
                              className={`p-3.5 rounded-2xl max-w-[85%] text-xs ${
                                m.isAdmin 
                                  ? 'ml-auto bg-white/5 text-purple-200 border-l-2' 
                                  : 'bg-zinc-900 border border-white/5 text-zinc-300'
                              }`}
                              style={{ borderLeftColor: m.isAdmin ? colors.accentHex : 'transparent' }}
                            >
                              <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1">
                                <span className="font-bold flex items-center gap-1.5">{m.senderName} {m.isAdmin ? <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded uppercase font-semibold text-zinc-300">Staff</span> : ''}</span>
                                <span>{new Date(m.timestamp).toLocaleTimeString()}</span>
                              </div>
                              <p className="whitespace-pre-line leading-relaxed">{m.message}</p>
                            </div>
                          ))}
                        </div>

                        {selectedTicket.status !== 'closed' && selectedTicket.status !== 'suspended' ? (
                          <form onSubmit={handleReplySubmit} className="space-y-2">
                            <textarea
                              rows={3}
                              value={chatReply}
                              onChange={(e) => setChatReply(e.target.value)}
                              placeholder="Type professional reply as Staff Support Specialist..."
                              className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 text-xs text-white focus:outline-none font-sans"
                            />
                            <div className="flex justify-end">
                              <button
                                type="submit"
                                className="rounded-xl px-5 py-2 text-xs font-bold font-mono tracking-widest uppercase text-black"
                                style={{ backgroundColor: colors.accentHex }}
                              >
                                DISPATCH REPLY
                              </button>
                            </div>
                          </form>
                        ) : (
                          <p className="text-center font-mono text-zinc-500 text-[10px] uppercase py-3 border border-dashed border-white/5 rounded-xl">
                            {selectedTicket.status === 'suspended' ? 'This thread has been suspended. normal interactions are blocked.' : 'This support thread has been resolved and closed.'}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-black/20 border border-dashed border-white/10 rounded-2xl">
                        <MessageSquare className="h-8 w-8 text-zinc-600 mx-auto mb-3 animate-ping" />
                        <p className="text-sm text-zinc-400 font-sans">Select any customer support thread from the left list to read messages and type replies.</p>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* SUB TAB D: Members & Database Log */}
              {adminTab === 'members' && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h3 className="font-display text-white font-black text-xs uppercase tracking-widest">
                      Registered Member accounts & Database history
                    </h3>
                    <p className="text-zinc-500 text-[11px] mt-0.5">Audit user access, check dynamic account creations, and adjust operational clearance tags.</p>
                  </div>

                  {/* Stat cards split */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                      <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">Total Databases</span>
                      <span className="text-xl font-bold font-mono tracking-tight text-white mt-1 block">{members.length + 1}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                      <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">Admin clearance</span>
                      <span className="text-xl font-bold font-mono tracking-tight text-[#facc15] mt-1 block" style={{ color: colors.accentHex }}>1 Accounts</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                      <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">Active Accounts</span>
                      <span className="text-xl font-bold font-mono tracking-tight text-emerald-400 mt-1 block">
                        {members.filter(m => m.status === 'Active').length}
                      </span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                      <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">Flagged Logins</span>
                      <span className="text-xl font-bold font-mono tracking-tight text-red-400 mt-1 block">
                        {members.filter(m => m.status === 'Suspended').length}
                      </span>
                    </div>
                  </div>

                  {/* Search and Table */}
                  <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/5 flex gap-4 items-center">
                      <div className="relative w-full max-w-xs">
                        <input
                          type="text"
                          placeholder="Search system registry..."
                          className="bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none w-full font-mono"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-white/5 bg-white/[0.01] text-zinc-500 font-mono uppercase text-[9px] tracking-wider">
                            <th className="p-4 font-bold">User Initial</th>
                            <th className="p-4 font-bold">Unique username</th>
                            <th className="p-4 font-bold">Encrypted email address</th>
                            <th className="p-4 font-bold">Created at stamp</th>
                            <th className="p-4 font-bold">Clearance Tag</th>
                            <th className="p-4 font-bold">Current node status</th>
                            <th className="p-4 font-bold text-right">Operational Tools</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {/* Render Hardcoded Master Admin */}
                          <tr className="hover:bg-white/[0.01]">
                            <td className="p-4">
                              <div className="h-8 w-8 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-xs ring-1 ring-red-500/20">
                                MA
                              </div>
                            </td>
                            <td className="p-4 font-bold text-white">Master Admin</td>
                            <td className="p-4 font-mono text-zinc-400">admin@vxhost.in</td>
                            <td className="p-4 font-mono text-zinc-500">2026-05-01 10:11</td>
                            <td className="p-4">
                              <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-[10px] font-mono border border-red-500/20">ADMIN LEVEL 5</span>
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> <span className="text-[10px] font-mono text-zinc-400">ONLINE</span></span>
                            </td>
                            <td className="p-4 text-right">
                              <span className="text-[10px] text-zinc-500 font-mono">ROOT PROTECTED</span>
                            </td>
                          </tr>

                          {members.map((m, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.01]">
                              <td className="p-4">
                                <div className="h-8 w-8 rounded-full bg-white/5 text-zinc-300 flex items-center justify-center font-bold text-xs ring-1 ring-white/10">
                                  {m.username.substring(0, 2).toUpperCase()}
                                </div>
                              </td>
                              <td className="p-4 font-bold text-white">{m.username}</td>
                              <td className="p-4 font-mono text-zinc-400">{m.email}</td>
                              <td className="p-4 font-mono text-zinc-500">
                                {m.createdAt ? m.createdAt.substring(0, 10) : '2026-06-10'}
                              </td>
                              <td className="p-4">
                                <span className="bg-zinc-500/10 text-zinc-400 px-2 py-0.5 rounded text-[10px] font-mono">CLIENT</span>
                              </td>
                              <td className="p-4">
                                <span className="inline-flex items-center gap-1.5">
                                  <span className={`h-2 w-2 rounded-full ${m.status === 'Active' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                  <span className="text-[10px] font-mono text-zinc-400">
                                    {m.status === 'Active' ? 'ACTIVE' : 'SUSPENDED'}
                                  </span>
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {confirmDeleteMemberEmail === m.email ? (
                                    <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-md p-1">
                                      <span className="text-[10px] font-mono text-red-400 font-bold px-1.5 uppercase">CONFIRM?</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = members.filter((u) => u.email !== m.email);
                                          setMembers(updated);
                                          localStorage.setItem('vx_members_list', JSON.stringify(updated));
                                          setConfirmDeleteMemberEmail(null);
                                          
                                          setShowSaveNotification(true);
                                          setTimeout(() => setShowSaveNotification(false), 3000);
                                        }}
                                        className="text-[10px] font-mono font-bold bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded"
                                      >
                                        YES
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setConfirmDeleteMemberEmail(null)}
                                        className="text-[10px] font-mono font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded"
                                      >
                                        NO
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = members.map((u, i) => i === idx ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u);
                                          setMembers(updated);
                                          localStorage.setItem('vx_members_list', JSON.stringify(updated));
                                          
                                          setShowSaveNotification(true);
                                          setTimeout(() => setShowSaveNotification(false), 3000);
                                        }}
                                        className="text-[10px] font-mono font-bold bg-white/5 hover:bg-white/10 text-zinc-300 px-2.5 py-1 rounded transition-colors"
                                      >
                                        {m.status === 'Active' ? 'Flag Suspended' : 'Unsuspend'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setConfirmDeleteMemberEmail(m.email)}
                                        className="text-[10px] font-mono font-bold bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 px-2.5 py-1 rounded transition-colors"
                                      >
                                        Delete
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB TAB E: Maintenance Mode Panel */}
              {adminTab === 'maintenance' && (
                <div className="space-y-8 animate-fadeIn">
                  
                  {/* Header text */}
                  <div className="border-b border-white/5 pb-4">
                    <h3 className="font-display text-white font-black text-xs uppercase tracking-widest">
                      Website Lock & Maintenance Area
                    </h3>
                    <p className="text-zinc-500 text-[11px] mt-0.5">
                      Toggle active site-wide maintenance lockdown. When locks are active, only authorized license holders and administrators bypass controls.
                    </p>
                  </div>

                  {/* Main status indicator card */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* Left status panel card with Hover Grow */}
                    <div className="md:col-span-5 bg-white/[0.01] border border-white/7 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] duration-300 transition-all shadow-lg hover:border-white/15">
                      <div 
                        className="absolute top-0 left-0 right-0 h-[4px]" 
                        style={{ backgroundColor: localMaintenanceActive ? '#ef4444' : colors.accentHex }} 
                      />
                      
                      <div className="space-y-4">
                        <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                          LOCK STATUS SECTOR
                        </span>
                        
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${localMaintenanceActive ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}`} />
                          <span className="font-display font-black text-xl text-white uppercase tracking-tight">
                            {localMaintenanceActive ? 'ACTIVE LOCKDOWN' : 'PUBLIC ONLINE'}
                          </span>
                        </div>

                        <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                          {localMaintenanceActive 
                            ? 'The website is currently locked down for standard users. Visitors see the dedicated Maintenance Bypass Page and must supply a valid license key or sign in as an admin.'
                            : 'The website is operating normally. All services, plan selectors, custom pricing engines, and client databases are fully accessible.'
                          }
                        </p>
                      </div>

                      <div className="pt-6">
                        <button
                          type="button"
                          onClick={() => {
                            toggleMaintenance();
                            setShowSaveNotification(true);
                            setTimeout(() => setShowSaveNotification(false), 3000);
                          }}
                          className={`w-full py-3.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 duration-200 cursor-pointer shadow-md ${
                            localMaintenanceActive 
                              ? 'bg-emerald-500 text-black hover:bg-emerald-400' 
                              : 'bg-red-500 text-white hover:bg-red-400'
                          }`}
                        >
                          {localMaintenanceActive ? 'END LOCKDOWN (GO LIVE)' : 'TRIGGER LOCKDOWN'}
                        </button>
                      </div>

                    </div>

                    {/* Right Key Generator with Hover Grow */}
                    <div className="md:col-span-7 bg-white/[0.01] border border-white/7 rounded-3xl p-6 relative overflow-hidden group hover:scale-[1.02] duration-300 transition-all shadow-lg hover:border-white/15">
                      <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ backgroundColor: colors.accentHex }} />
                      
                      <div className="space-y-4">
                        <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                          LICENSE KEY MATRIX
                        </span>
                        
                        <h4 className="font-display font-black text-base text-white uppercase tracking-wider">
                          GENERATE ACCESS TOKEN
                        </h4>
                        
                        <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                          Create randomized cryptographic license keys that users can enter to look up and unlock website operational menus during locking routines.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                              Maximum User Uses
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={9999}
                              value={keyMaxUses}
                              onChange={(e) => setKeyMaxUses(parseInt(e.target.value) || 1)}
                              className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-xs text-white focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                              Key Expiry Date
                            </label>
                            <input
                              type="date"
                              value={keyExpiryDate}
                              onChange={(e) => setKeyExpiryDate(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-xs text-zinc-300 font-mono focus:outline-none"
                            />
                          </div>
                        </div>

                        {keyGenSuccess && (
                          <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center justify-between gap-2 text-xs font-mono text-emerald-400 animate-pulse">
                            <span>Generated: <strong className="font-bold underline">{keyGenSuccess}</strong></span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(keyGenSuccess);
                                setIsCopied(true);
                                setTimeout(() => setIsCopied(false), 2000);
                              }}
                              className="text-[9px] uppercase font-bold bg-emerald-500/20 px-2.5 py-1 rounded hover:bg-emerald-500/30 text-white min-w-[70px] text-center transition-all cursor-pointer"
                            >
                              {isCopied ? 'Copied' : 'Copy Key'}
                            </button>
                          </div>
                        )}

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => generateLicenseKey(keyMaxUses, keyExpiryDate)}
                            className="w-full py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-[1.03] active:scale-95 duration-200 cursor-pointer text-black"
                            style={{ backgroundColor: colors.accentHex }}
                          >
                            Generate Random License Key
                          </button>
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* Active Licenses Table list with Hover Grow rows */}
                  <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden mt-6 shadow-xl">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                      <span className="font-mono text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                        AUTHORIZED LOCK ENTRANCE REGISTRY ({licenseKeys.length})
                      </span>
                    </div>

                    <div className="overflow-x-auto text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 bg-white/[0.01] text-zinc-500 font-mono uppercase text-[9px] tracking-wider">
                            <th className="p-4 font-bold">Token code value</th>
                            <th className="p-4 font-bold">Created timestamp</th>
                            <th className="p-4 font-bold">Expiry Date stamp</th>
                            <th className="p-4 font-bold">Usage counter</th>
                            <th className="p-4 font-bold">License Status</th>
                            <th className="p-4 font-bold text-right">Emergency Controls</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {licenseKeys.map((keyObj, idx) => {
                            const isExpired = new Date(keyObj.expiryDate) < new Date();
                            return (
                              <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="p-4 font-mono font-black text-white flex items-center gap-2 group-hover:scale-[1.01] transition-transform duration-100">
                                  <Key className="h-3 w-3" style={{ color: colors.accentHex }} />
                                  <span>{keyObj.key}</span>
                                </td>
                                <td className="p-4 font-mono text-zinc-500">{keyObj.createdAt.substring(0,10)}</td>
                                <td className="p-4 font-mono">
                                  <span className={isExpired ? 'text-red-400 font-bold animate-pulse' : 'text-zinc-300'}>
                                    {keyObj.expiryDate} {isExpired && '[EXPIRED]'}
                                  </span>
                                </td>
                                <td className="p-4 font-mono font-bold">
                                  <span className="text-zinc-200">{keyObj.uses}</span>
                                  <span className="text-zinc-500"> / {keyObj.maxUses}</span>
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                                    keyObj.status === 'Active' && !isExpired
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                      : 'bg-red-500/10 text-red-500 border-red-500/20'
                                  }`}>
                                    {keyObj.status === 'Active' && !isExpired ? 'ACTIVE' : 'LOCKED / EXPIRED'}
                                  </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => toggleKeyStatus(keyObj.key)}
                                    className="text-[10px] font-mono font-bold bg-white/5 hover:bg-white/10 text-zinc-200 px-2.5 py-1 rounded transition-all hover:scale-105 active:scale-95 duration-100"
                                  >
                                    {keyObj.status === 'Active' ? 'Disable Key' : 'Activate Key'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteKey(keyObj.key)}
                                    className="text-[10px] font-mono font-bold bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-2.5 py-1 rounded transition-all hover:scale-105 active:scale-95 duration-100"
                                  >
                                    Delete Key
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                          {licenseKeys.length === 0 && (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-zinc-500 font-mono text-xs">
                                No cryptographic access keys generated yet. Click generate above to register first.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {hasUnsavedChanges && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#121214]/90 border border-white/10 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 max-w-lg w-[95%] justify-between backdrop-blur-md">
                <div>
                  <p className="text-white text-xs font-bold font-sans">You have unsaved changes</p>
                  <p className="text-[10px] text-zinc-400 font-mono">Save changes to deploy and synchronize portal configs</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDraftSiteName(siteName);
                      setDraftSiteLogo(siteLogo);
                      setDraftSiteLogoImage(siteLogoImage || '');
                      setDraftContactEmail(contactEmail);
                      setDraftContactAddress(contactAddress);
                      setDraftDeployNodeLink(deployNodeLink);
                      setDraftControlPanelLink(controlPanelLink);
                      setDraftBillingPanelLink(billingPanelLink);
                      setDraftThemeColor(themeColor);
                    }}
                    className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white px-3 py-2 rounded-lg bg-white/5 transition-all"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveGlobalSettings()}
                    className="text-[10px] font-bold uppercase tracking-wider text-black px-4 py-2 rounded-lg transition-all"
                    style={{ backgroundColor: colors.accentHex }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        ) : (
          
          /* VIEW 3: STANDARD LOGGED-IN CUSTOMER SYSTEM INTERACTIVE TERMINAL */
          <motion.div
            key="client-portal"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Upper Client Header card */}
            <div className="rounded-3xl border border-white/5 bg-[#0D0D0D] p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: colors.accentHex }} />
              <div>
                <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest bg-white/5 border border-white/10 rounded px-2.5 py-1 inline-block mb-2">
                  Interactive Node Portal
                </span>
                <h1 className="font-display text-2xl sm:text-4xl font-extrabold italic uppercase text-white tracking-widest">
                  Welcome back, <span style={{ color: colors.accentHex }}>{user.username}</span>
                </h1>
                <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">
                  Secure gateway session verified for: <span className="font-mono text-zinc-400">{user.email}</span>
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsOrderingNode(true)}
                  className="rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black font-mono transition-all cursor-pointer"
                  style={{ backgroundColor: colors.accentHex }}
                  title="Deploy a new container virtual server slice"
                >
                  ➕ Order New Node Server
                </button>
                <button
                  onClick={onLogout}
                  className="rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-zinc-400"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Portal Navigation menu tabs */}
            <div className="flex gap-3 border-b border-white/5 pb-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer outline-none ${
                  activeTab === 'profile' ? `${colors.bgMuted} ${colors.text} font-black` : 'text-zinc-400 hover:text-white'
                }`}
              >
                👤 My Profile
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer outline-none ${
                  activeTab === 'tickets' ? `${colors.bgMuted} ${colors.text} font-black` : 'text-zinc-400 hover:text-white'
                }`}
              >
                📥 Support Desk Tickets ({tickets.filter(t => t.userEmail === user.email).length})
              </button>
            </div>

            {/* Simulated deployment overlay screen */}
            <AnimatePresence>
              {isOrderingNode && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="max-w-lg w-full bg-[#0D0D0D] p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden text-left"
                    style={{ maxHeight: '90vh', overflowY: 'auto' }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: colors.accentHex }} />
                    <button
                      onClick={() => setIsOrderingNode(false)}
                      className="absolute top-4 right-4 text-zinc-400 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>

                    {orderPlanId === '' ? (
                      <div className="space-y-4">
                        <h3 className="font-display text-white font-extrabold uppercase text-lg tracking-wider">Select hosting template core</h3>
                        <p className="text-xs text-zinc-400">Order from catalog lists. This deploys a virtual simulated machine container inside your account instantly.</p>
                        
                        <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto pr-1">
                          {plans.map(p => (
                            <button
                              key={p.id}
                              onClick={() => { setOrderPlanId(p.id); setOrderCategory(p.category); }}
                              className="w-full rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 p-4 text-left flex justify-between items-center transition-all cursor-pointer group outline-none"
                            >
                              <div>
                                <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">{p.category}</span>
                                <span className="font-sans text-xs font-bold text-white group-hover:text-yellow-400 mt-1 block" style={{ color: colors.accentHex }}>{p.name}</span>
                                <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">{p.specs[0]?.value || '4GB RAM'} • {p.specs[1]?.value || 'High Clock Core'}</span>
                              </div>
                              <div className="text-right flex items-center gap-2">
                                <span className="font-mono text-sm font-extrabold text-white">${p.priceUSD}/mo</span>
                                <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 font-mono text-xs">
                        <div className="flex justify-between border-b border-white/5 pb-3">
                          <h3 className="font-display font-black text-white text-sm uppercase tracking-wider">Deploying virtual node...</h3>
                          <span className="text-[11px]" style={{ color: colors.accentHex }}>{deploymentProgress}% finished</span>
                        </div>

                        {/* Progress meter bar */}
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ width: `${deploymentProgress}%`, backgroundColor: colors.accentHex }}
                          />
                        </div>

                        <div className="bg-black/60 rounded-xl p-4 border border-white/5 space-y-2 max-h-[180px] overflow-y-auto leading-relaxed text-zinc-300">
                          {deploymentLog.map((logLine, lidx) => (
                            <p key={lidx}>{logLine}</p>
                          ))}
                          {deploymentProgress < 100 && (
                            <div className="flex items-center gap-1.5 text-zinc-500">
                              <span className="h-3 w-3 animate-spin rounded-full border border-t-transparent" style={{ borderColor: colors.accentHex }} />
                              Processing container sector sectors...
                            </div>
                          )}
                        </div>

                        {deploymentProgress < 100 ? (
                          <div className="flex justify-end">
                            <button
                              onClick={handleDeploySimulate}
                              className="rounded-xl font-mono text-xs font-bold uppercase tracking-wide px-5 py-2.5 text-black"
                              style={{ backgroundColor: colors.accentHex }}
                            >
                              START AUTOMATED INSTALLATION
                            </button>
                          </div>
                        ) : (
                          <p className="text-center font-bold text-green-400 text-xs py-2 uppercase">🎉 Server deployed. Ready to connect and mount daemon files!</p>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* TAB INTERACTION 1: USER PROFILE MANAGEMENT */}
            {activeTab === 'profile' && (
              <div className="max-w-2xl mx-auto py-4">
                <div className="relative rounded-3xl border border-white/5 bg-white/[0.01] p-6 sm:p-10 overflow-hidden text-left shadow-2xl">
                  <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ backgroundColor: colors.accentHex }} />
                  
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-white text-xl font-extrabold tracking-tight">
                        Account Profile Management
                      </h2>
                      <p className="text-zinc-500 font-sans text-xs mt-1">
                        Review or change your global security permissions, registration emails, and dashboard alias.
                      </p>
                    </div>

                    {profileSaveSuccess && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 text-xs font-mono flex items-center gap-2"
                      >
                        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Profile changes updated successfully. All credentials synced with secure database.</span>
                      </motion.div>
                    )}

                    <form onSubmit={handleProfileSave} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-400 font-bold">
                          Client Username / Alias
                        </label>
                        <input
                          type="text"
                          value={profileUsername}
                          onChange={(e) => setProfileUsername(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-white/20 focus:outline-none focus:ring-0 outline-none font-sans"
                          placeholder="Your username"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-400 font-bold">
                          Primary Email Address
                        </label>
                        <input
                          type="email"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-white/20 focus:outline-none focus:ring-0 outline-none font-sans"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-400 font-bold">
                          Change Password
                        </label>
                        <input
                          type="password"
                          value={profilePassword}
                          onChange={(e) => setProfilePassword(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-white/20 focus:outline-none focus:ring-0 outline-none font-mono"
                          placeholder="Enter a new password"
                          required
                        />
                      </div>

                      <div className="pt-2">
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="w-full rounded-xl py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 flex items-center justify-center cursor-pointer outline-none shadow-md"
                          style={{ 
                            backgroundColor: colors.accentHex,
                          }}
                        >
                          Save Changes & Re-hash
                        </motion.button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* TAB INTERACTION 2: SUPPORT DESK CHAT TICKETS FOR CLIENTS */}
            {activeTab === 'tickets' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Tickets inventory list */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className="font-display text-white font-black text-xs uppercase tracking-widest">
                      My Questions & Interactions
                    </h3>
                    <button
                      onClick={() => setIsCreatingTicket(true)}
                      className="rounded-full bg-white text-black px-4 py-1.5 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all cursor-pointer"
                    >
                      ➕ Launch Ticket
                    </button>
                  </div>

                  {tickets.filter(t => t.userEmail === user.email).length === 0 ? (
                    <div className="text-center py-16 bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
                      <MessageSquare className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
                      <p className="text-zinc-500 text-xs font-sans">No support tickets found on your record. Create one above!</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {tickets
                        .filter(t => t.userEmail === user.email)
                        .map((t) => {
                          const isSelected = selectedTicket && selectedTicket.id === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => { setSelectedTicket(t); setIsCreatingTicket(false); }}
                              className={`w-full text-left rounded-xl p-3.5 border transition-all cursor-pointer block outline-none ${
                                isSelected 
                                  ? 'bg-white/10 border-white/20' 
                                  : 'border-white/5 bg-zinc-950/40 hover:bg-[#0A0A0A]'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <span className="font-mono text-[9px] text-zinc-500">{t.id}</span>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                                  t.priority === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-500/10 text-zinc-400'
                                }`}>
                                  {t.priority}
                                </span>
                              </div>
                              <p className="text-xs font-extrabold text-white mt-1 uppercase line-clamp-1">{t.subject}</p>
                              
                              <div className="flex mt-2.5 gap-2 items-center leading-none">
                                <span className={`h-1.5 w-1.5 rounded-full ${
                                  t.status === 'open' ? 'bg-amber-400' : t.status === 'answered' ? 'bg-violet-400 animate-pulse' : 'bg-zinc-500'
                                }`} />
                                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                                  {t.status === 'answered' ? 'Staff Replied (View reply)' : t.status}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* Right Area: Dynamic Thread reply window OR new ticket creators */}
                <div className="lg:col-span-7">
                  {isCreatingTicket ? (
                    <form onSubmit={handleCreateTicketSubmit} className="rounded-3xl border border-white/5 bg-[#0D0D0D] p-5 lg:p-6 space-y-4 text-left">
                      <div className="border-b border-white/5 pb-3">
                        <h4 className="font-display font-black text-xs uppercase tracking-widest text-emerald-400" style={{ color: colors.accentHex }}>
                          Launch New Support Ticket
                        </h4>
                        <p className="text-zinc-500 text-[10px] uppercase font-mono mt-0.5">Submit inquiry directly into the Admin control terminal core.</p>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-widest mb-1.5">Subject Headline</label>
                        <input
                          type="text"
                          required
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          placeholder="e.g. Server lagging on modpack loading / backup recovery"
                          className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-widest mb-1.5">Category context</label>
                          <select
                            value={ticketCategory}
                            onChange={(e) => setTicketCategory(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-xs text-white focus:outline-none"
                          >
                            <option value="minecraft">Minecraft Guild Server</option>
                            <option value="vps">Cloud VPS System</option>
                            <option value="discord">Discord Bot Slice</option>
                            <option value="billing">Billing issue ticket</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-widest mb-1.5 text-right">Inquiry Severity</label>
                          <div className="grid grid-cols-3 gap-1">
                            {(['low', 'medium', 'high'] as const).map(prio => (
                              <button
                                key={prio}
                                type="button"
                                onClick={() => setTicketPriority(prio)}
                                className={`rounded-lg py-2.5 text-xs font-mono font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                                  ticketPriority === prio 
                                    ? prio === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-white/15 text-white'
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
                        <label className="block text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-widest mb-1.5">Detail Message parameters</label>
                        <textarea
                          rows={4}
                          required
                          value={ticketMessage}
                          onChange={(e) => setTicketMessage(e.target.value)}
                          placeholder="Provide all logs, steps to reproduce, or requested DNS modifications to handle..."
                          className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white focus:outline-none font-sans"
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
                          className="rounded-xl px-5 py-2 text-xs font-bold font-mono tracking-widest uppercase text-black cursor-pointer"
                          style={{ backgroundColor: colors.accentHex }}
                        >
                          SUBMIT INQUIRY
                        </button>
                      </div>
                    </form>
                  ) : selectedTicket ? (
                    
                    /* VIEW CLIENT CHAT DETAIL */
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                        <div>
                          <span className="font-mono text-[9px] text-zinc-500">TICKETING DESK ({selectedTicket.id})</span>
                          <h4 className="text-sm font-bold text-white uppercase mt-0.5">{selectedTicket.subject}</h4>
                        </div>
                        <div>
                          <span className={`text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-lg border leading-none ${
                            selectedTicket.status === 'closed' ? 'bg-zinc-500/5 text-zinc-500 border-zinc-500/10' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse'
                          }`}>
                            {selectedTicket.status}
                          </span>
                        </div>
                      </div>

                      {/* Chat messages thread logs */}
                      <div className="max-h-[250px] overflow-y-auto space-y-3 bg-[#0A0A0A]/60 p-4 rounded-xl border border-white/5 font-sans">
                        {selectedTicket.messages.map((m) => (
                          <div 
                            key={m.id}
                            className={`p-3.5 rounded-2xl max-w-[85%] text-xs ${
                              m.isAdmin 
                                ? 'bg-[#0D0D0D] border border-white/10 text-zinc-300' 
                                : 'ml-auto bg-white/5 border-r-2 text-zinc-200'
                            }`}
                            style={{ borderRightColor: !m.isAdmin ? colors.accentHex : 'transparent' }}
                          >
                            <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1">
                              <span className="font-bold flex items-center gap-1.5">{m.senderName} {m.isAdmin ? <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded uppercase font-semibold">Support Team</span> : ''}</span>
                              <span>{new Date(m.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <p className="whitespace-pre-line leading-relaxed">{m.message}</p>
                          </div>
                        ))}
                      </div>

                      {selectedTicket.status === 'suspended' && (
                        <div className="p-3.5 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-400 font-mono text-[11px] leading-relaxed flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                          <span>This ticket has been suspended by support staff. Standard customer replies are locked.</span>
                        </div>
                      )}

                      {selectedTicket.status !== 'closed' && selectedTicket.status !== 'suspended' ? (
                        <form onSubmit={handleReplySubmit} className="space-y-2">
                          <textarea
                            rows={3}
                            value={chatReply}
                            onChange={(e) => setChatReply(e.target.value)}
                            placeholder="Type client message here..."
                            className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 text-xs text-white focus:outline-none font-sans"
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
                              className="rounded-xl px-5 py-2 text-xs font-bold font-mono tracking-widest uppercase text-black"
                              style={{ backgroundColor: colors.accentHex }}
                            >
                              SEND REPLY
                            </button>
                          </div>
                        </form>
                      ) : (
                        <p className="text-center font-mono text-zinc-500 text-[10px] uppercase py-3 border border-dashed border-white/5 rounded-xl">
                          {selectedTicket.status === 'suspended' ? 'Thread suspended. Chat interactions are frozen.' : 'This support thread is resolved. Reopen via administrator actions if needed.'}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-24 bg-[#0D0D0D] border border-dashed border-white/5 rounded-3xl">
                      <MessageSquare className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
                      <p className="text-sm text-zinc-400 font-sans">Select any support ticket thread, or click "Launch Ticket" to request help from the administrators.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
