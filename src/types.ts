export type CurrencyCode = 'USD' | 'INR' | 'BDT' | 'PKR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateToUSD: number; // Multiply USD price by this rate to get target price
  label: string;
  flag: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rateToUSD: 1, label: 'US Dollar', flag: '🇺🇸' },
  INR: { code: 'INR', symbol: '₹', rateToUSD: 83.5, label: 'Indian Rupee', flag: '🇮🇳' },
  BDT: { code: 'BDT', symbol: '৳', rateToUSD: 117.0, label: 'Bangladeshi Taka', flag: '🇧🇩' },
  PKR: { code: 'PKR', symbol: '₨', rateToUSD: 278.0, label: 'Pakistani Rupee', flag: '🇵🇰' }
};

export type HostCategory = 'minecraft' | 'vps' | 'discord' | 'web';

export interface PlanSpec {
  label: string;
  value: string;
}

export interface HostingPlan {
  id: string;
  name: string;
  category: HostCategory;
  priceUSD: number; // Base price in USD
  billingPeriod: string;
  badge?: string; // e.g. "Popular", "Extreme", "Best Value"
  specs: PlanSpec[];
  features: string[];
  description: string;
  isPopular?: boolean;
}

export interface User {
  username: string;
  email: string;
  isAdmin?: boolean;
}

export interface TicketMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  isAdmin: boolean;
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userEmail: string;
  userName: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'answered' | 'closed' | 'suspended';
  createdAt: string;
  messages: TicketMessage[];
}

