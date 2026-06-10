import { HostingPlan } from './types';

export const PLANS_DATA: HostingPlan[] = [
  // --- MINECRAFT plans ---
  {
    id: 'mc-dirt',
    name: 'Dirt Plan',
    category: 'minecraft',
    priceUSD: 4.50,
    billingPeriod: 'month',
    badge: 'Starter',
    description: 'Perfect for small survival worlds or vanilla servers with close friends.',
    specs: [
      { label: 'RAM', value: '4 GB DDR5 ECC' },
      { label: 'CPU', value: 'Ryzen 9 7950X (5.7GHz)' },
      { label: 'Storage', value: '40 GB NVMe Gen4 SSD' },
      { label: 'Players', value: 'Unlimited Slots' }
    ],
    features: [
      'Pterodactyl Control Panel',
      'Instant Server Setup',
      'Free Subdomain & Dedicated Port',
      '99.9% Uptime SLA',
      'Automated Daily Backups'
    ]
  },
  {
    id: 'mc-iron',
    name: 'Iron Plan',
    category: 'minecraft',
    priceUSD: 8.99,
    billingPeriod: 'month',
    badge: 'Best Budget',
    isPopular: true,
    description: 'The standard sweet spot for modded servers and active communities.',
    specs: [
      { label: 'RAM', value: '8 GB DDR5 ECC' },
      { label: 'CPU', value: 'Ryzen 9 7950X (5.7GHz)' },
      { label: 'Storage', value: '80 GB NVMe Gen4 SSD' },
      { label: 'Players', value: 'Unlimited Slots' }
    ],
    features: [
      'Pterodactyl Control Panel',
      'Instant Server Setup',
      'Free Subdomain & Dedicated Port',
      'Advanced DDoS Protection (12 Tbps+)',
      'Automated Daily Backups',
      '1-Click Modpack Installer',
      'SFTP File Access'
    ]
  },
  {
    id: 'mc-diamond',
    name: 'Diamond Plan',
    category: 'minecraft',
    priceUSD: 17.99,
    billingPeriod: 'month',
    badge: 'Pro Tier',
    description: 'Heavy duty hosting tailored for massive custom plugins or huge modpacks.',
    specs: [
      { label: 'RAM', value: '16 GB DDR5 ECC' },
      { label: 'CPU', value: 'Ryzen 9 7950X (5.7GHz)' },
      { label: 'Storage', value: '150 GB NVMe Gen4 SSD' },
      { label: 'Players', value: 'Unlimited Slots' }
    ],
    features: [
      'Ryzen 9 Dedicated Core Thread',
      'Pterodactyl Control Panel',
      'Instant Server Setup',
      'Dedicated IP Available',
      'Advanced DDoS Protection (12 Tbps+)',
      'Automated Offsite Backups',
      'Premium Modpack support'
    ]
  },
  {
    id: 'mc-netherite',
    name: 'Netherite Tier',
    category: 'minecraft',
    priceUSD: 34.99,
    billingPeriod: 'month',
    badge: 'Extreme Power',
    description: 'The absolute king of server nodes. Max clock rate, ideal for networks with BungeeCord.',
    specs: [
      { label: 'RAM', value: '32 GB DDR5 ECC' },
      { label: 'CPU', value: 'Ryzen 9 7950X (Dedicated)' },
      { label: 'Storage', value: '300 GB NVMe Gen4 SSD' },
      { label: 'Players', value: 'Unlimited Slots' }
    ],
    features: [
      'Full Ryzen Dedicated Threads',
      'Free BungeeCord/Velocity Setup Help',
      'Extreme NVMe Read/Write Speed',
      'Enterprise Level anti-DDoS Filters',
      'Highest Uptime Guarantee',
      'Free Premium MySQL Databases',
      'Priority 24/7 Support Channel'
    ]
  },

  // --- CLOUD VPS plans ---
  {
    id: 'vps-start',
    name: 'V-Start VPS',
    category: 'vps',
    priceUSD: 6.99,
    billingPeriod: 'month',
    badge: 'Starter Dev',
    description: 'Perfect sandbox VPS for testing scripts, small webservers, and database staging.',
    specs: [
      { label: 'VCPU cores', value: '2 vCores AMD EPYC' },
      { label: 'DDR4 RAM', value: '4 GB ECC Server' },
      { label: 'Disk size', value: '60 GB NVMe SSD' },
      { label: 'Bandwidth', value: '5 TB @ 1 Gbps' }
    ],
    features: [
      'Full Root SSH Access',
      'Virtualizor Control Dashboard',
      'Instant KVM Re-installation',
      'Choose Ubuntu/Debian/Rocky Linux',
      'Dedicated public IPv4 address'
    ]
  },
  {
    id: 'vps-grow',
    name: 'V-Grow VPS',
    category: 'vps',
    priceUSD: 13.50,
    billingPeriod: 'month',
    badge: 'Most Popular',
    isPopular: true,
    description: 'The sweet spot for launching traffic-heavy sites, APIs, and gaming platforms.',
    specs: [
      { label: 'VCPU cores', value: '4 vCores AMD EPYC' },
      { label: 'DDR4 RAM', value: '8 GB ECC Server' },
      { label: 'Disk size', value: '120 GB NVMe SSD' },
      { label: 'Bandwidth', value: '10 TB @ 1 Gbps' }
    ],
    features: [
      'Full Root SSH Access',
      'Virtualizor Control Dashboard',
      'Free Automated Backups (Weekly)',
      'Choose Ubuntu/Debian/Rocky Linux',
      'Dedicated IPv4 & IPv6 Range',
      'DDoS Mitigation Shield'
    ]
  },
  {
    id: 'vps-pro',
    name: 'V-Pro VPS',
    category: 'vps',
    priceUSD: 26.99,
    billingPeriod: 'month',
    badge: 'Professional',
    description: 'Heavy computational instance for web scraping, complex backends, and virtual grids.',
    specs: [
      { label: 'VCPU cores', value: '8 vCores AMD EPYC' },
      { label: 'DDR4 RAM', value: '16 GB ECC Server' },
      { label: 'Disk size', value: '240 GB NVMe SSD' },
      { label: 'Bandwidth', value: '20 TB @ 2 Gbps' }
    ],
    features: [
      'Full Root SSH Access',
      'High IOPS RAID Storage',
      'Free Automated Backups',
      '2 Gbps Burst Uplink',
      'Dedicated Reverse DNS (rDNS)',
      'Premium Technical Support Response'
    ]
  },
  {
    id: 'vps-beast',
    name: 'V-Beast Dedicated',
    category: 'vps',
    priceUSD: 52.99,
    billingPeriod: 'month',
    badge: 'Overkill VPS',
    description: 'Enterprise virtual server acting as your private node. Massive network trunk.',
    specs: [
      { label: 'VCPU cores', value: '16 vCores AMD EPYC' },
      { label: 'DDR4 RAM', value: '32 GB ECC Server' },
      { label: 'Disk size', value: '480 GB NVMe SSD' },
      { label: 'Bandwidth', value: 'Unlimited @ 10 Gbps' }
    ],
    features: [
      'Unrestricted Port 10Gbps Uplink',
      'Full Kernel Customization',
      'Dedicated Admin Panel & Analytics',
      'Custom ISO Upload Available',
      'Instant Deployment Node',
      'VIP Dedicated Account Manager'
    ]
  },

  // --- DISCORD plans ---
  {
    id: 'discord-lite',
    name: 'Lite Node',
    category: 'discord',
    priceUSD: 1.20,
    billingPeriod: 'month',
    badge: 'For Tiny Bots',
    description: 'Ideal for custom JS/Python bots running inside 10 – 30 small server channels.',
    specs: [
      { label: 'RAM Alloc', value: '1 GB high speed' },
      { label: 'CPU Share', value: '0.5 Dedicated Core' },
      { label: 'Storage', value: '10 GB SSD' },
      { label: 'Server Port', value: 'Free Port Allocation' }
    ],
    features: [
      'Node.js, python, java, Go runtime',
      'Pterodactyl Control Panel',
      'Git Integration (Pull auto-deploy)',
      'Always-on 24/7 Bot Process',
      'Real-time Console & File Manager'
    ]
  },
  {
    id: 'discord-dev',
    name: 'Dev Node',
    category: 'discord',
    priceUSD: 2.49,
    billingPeriod: 'month',
    isPopular: true,
    badge: 'Active Bot',
    description: 'Great for multi-guild bots with dashboard widgets and lightweight databases.',
    specs: [
      { label: 'RAM Alloc', value: '2 GB high speed' },
      { label: 'CPU Share', value: '1.0 Dedicated Core' },
      { label: 'Storage', value: '25 GB SSD' },
      { label: 'Database', value: '1x Free MariaDB / Redis' }
    ],
    features: [
      'Node.js, python, java, Go runtime',
      'Pterodactyl Control Panel',
      'Git Integration (Pull auto-deploy)',
      'Free Database Instance',
      'Automated daily code backup',
      'WebSocket connection optimization'
    ]
  },
  {
    id: 'discord-guild',
    name: 'Guild Master Node',
    category: 'discord',
    priceUSD: 4.99,
    billingPeriod: 'month',
    badge: 'Massive Reach',
    description: 'Engineered for music, Moderation, and AI bots scaling in hundreds of servers.',
    specs: [
      { label: 'RAM Alloc', value: '4 GB high speed' },
      { label: 'CPU Share', value: '2.0 Dedicated Cores' },
      { label: 'Storage', value: '50 GB NVMe' },
      { label: 'Database', value: 'Unlimited Databases' }
    ],
    features: [
      'Perfect for Lavalink / audio synth',
      'Highest process scheduling priority',
      'Extra low network jitter',
      'Git pull webhook deployment',
      'Dedicated fast-track VIP ticket help'
    ]
  },

  // --- WEB HOSTING plans ---
  {
    id: 'web-cloud-start',
    name: 'Cloud Starter',
    category: 'web',
    priceUSD: 1.99,
    billingPeriod: 'month',
    badge: 'Essential',
    description: 'Fast, secure cloud web hosting to host your portfolio, blog, or gaming community site.',
    specs: [
      { label: 'Websites', value: '1 Domain Port' },
      { label: 'Storage', value: '15 GB NVMe SSD' },
      { label: 'Databases', value: '5x MySQL DB' },
      { label: 'Bandwidth', value: 'Unlimited Traffic' }
    ],
    features: [
      'Free Let’s Encrypt SSL Certificates',
      'cPanel Ultra Panel',
      '1-Click WordPress & Forums Install',
      'Unlimited Email Accounts',
      'DDoS-Protected Web Node'
    ]
  },
  {
    id: 'web-cloud-enterprise',
    name: 'Cloud Enterprise',
    category: 'web',
    priceUSD: 5.99,
    billingPeriod: 'month',
    isPopular: true,
    badge: 'Enterprise VPS Web',
    description: 'Unlimited websites and maximum CloudLite speed for active web shops and portals.',
    specs: [
      { label: 'Websites', value: 'Unlimited Domains' },
      { label: 'Storage', value: '100 GB NVMe SSD' },
      { label: 'Databases', value: 'Unlimited MySQL' },
      { label: 'CPU Share', value: '2.0 Cores (Ultra-speed)' }
    ],
    features: [
      'Free Let’s Encrypt SSL Certificates',
      'cPanel Ultra Panel & Softaculous',
      'Daily Cloud backup automated',
      'Free Premium Website Migration',
      'Premium CDN & Cloudflare cache setup',
      'Dedicated RAM Cache allocation'
    ]
  }
];

export const OTHER_FEATURES = [
  {
    title: 'Extreme Low Latency',
    description: 'We host on top-tier datacenters globally with premium transit routing, ensuring <15ms ping for player bases.',
    iconName: 'Zap'
  },
  {
    title: '15 Tbps+ DDoS Defenses',
    description: 'Never get kicked offline or targeted by raw botnets. Our custom physical scrubbers filter traffic in real-time.',
    iconName: 'ShieldAlert'
  },
  {
    title: 'Instant Provisioning',
    description: 'Your server, bot containers, or cloud VPS is built and deployed within 60 seconds from the invoice clearance.',
    iconName: 'Cpu'
  },
  {
    title: 'Intel Core i9 / Ryzen 9 Hardware',
    description: 'No old Xeon servers here. Enjoy blistering single-core performance with the latest-gen CPU architectures.',
    iconName: 'Gauge'
  },
  {
    title: 'Premium Control Panel',
    description: 'Manage files, install modpacks, restart servers, and configure backups seamlessly using state-of-the-art UI wrappers.',
    iconName: 'LayoutGrid'
  },
  {
    title: '24/7 Expert Support team',
    description: 'Got an issue installing a mod or setting up rDNS? Our technical support team works round-the-clock to debug with you.',
    iconName: 'Headphones'
  }
];

export const CLIENT_REVIEWS = [
  {
    name: 'Alex "Steve" Carter',
    role: 'Server Administrator, CraftRealms Network',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
    comment: 'VxHost is hands down the best MC host I have encountered. The Ryzen 9 core handles 120 players and complex plugins without dropping below 19.9 TPS. Absolute beast!'
  },
  {
    name: 'Fatima Al-Sayed',
    role: 'Lead Dev, StarBot Discord System',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    comment: 'The Discord bot node is exceptionally reliable. We upgraded to the Guild Master plan as our bot reached 15,000 servers. Webhooks git-pull has simplified integration immensely!'
  },
  {
    name: 'Mirza Baig',
    role: 'Founder, Apex VPS solutions',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    comment: 'Having PKR and INR billing with simple payment gateways is life-changing for South Asian developers. Their KVM VPS is blazing fast and has zero lag.'
  }
];

export const FAQS = [
  {
    question: 'How fast will my Minecraft server or VPS be online?',
    answer: 'Minecraft servers and Discord Bot containers are spun up instantly (typically within 10 to 30 seconds). Cloud KVM VPS require OS deployment and boot, which takes under 60 seconds.'
  },
  {
    question: 'Which server locations do you offer for hosting?',
    answer: 'We deploy from high-grade carrier hotels in Ashburn (USA), Frankfurt (Germany), Singapore (Asia Pacific), Mumbai (India), and Dhaka (Bangladesh upcoming) to ensure optimal latency.'
  },
  {
    question: 'Can I change my server plan or upgrade resources later?',
    answer: 'Yes! You can upgrade or downgrade RAM, disk, or bandwidth at any time via the panel at billing.vxhost.in. Rest assured, all files and server settings remain completely intact.'
  },
  {
    question: 'How does the currency converter work?',
    answer: 'Simply select your localized currency (USD, INR, BDT, or PKR) in our top header. The page prices will dynamically recalculate using stable current exchange rates so you see exactly what to expect.'
  },
  {
    question: 'Do you offer a money-back guarantee?',
    answer: 'Yes! We support a 72-hour money-back policy if you are unsatisfied with your server performance or experience service outages.'
  }
];
