export interface SiteConfig {
  businessName: string;
  tagline: string;
  phone: string;
  phoneDial: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  email: string;
  address: {
    locality: string;
    district: string;
    state: string;
    postalCode: string;
    country: string;
    full: string;
  };
  instagramUrl: string;
  referenceWebsite: string;
  currency: {
    code: string;
    symbol: string;
    locale: string;
  };
  logoPath: string;
  seo: {
    title: string;
    description: string;
    siteUrl: string;
  };
}

export const siteConfig: SiteConfig = {
  businessName: 'LIVEON CONNECT',
  tagline: 'LED WALL, LIVE STREAMING, SOUND COMPANY',
  phone: import.meta.env.VITE_BUSINESS_PHONE || '+91 8590952476',
  phoneDial: '+918590952476',
  // Normalized international format required by WhatsApp click-to-chat (no +, spaces, or dashes)
  whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER || '918590952476').replace(/[^0-9]/g, ''),
  whatsappDisplay: '+91 8590952476',
  email: import.meta.env.VITE_CONTACT_EMAIL || 'Liveonconnect@gmail.com',
  address: {
    locality: 'Manimala',
    district: 'Kottayam',
    state: 'Kerala',
    postalCode: '686543',
    country: 'India',
    full: 'Manimala, Kottayam, Kerala – 686543, India',
  },
  instagramUrl: 'https://www.instagram.com/liveonconnect?dlrf=MWZmZWphZndxcWN1Yw==',
  referenceWebsite: 'https://www.eventwave.in/',
  currency: {
    code: 'INR',
    symbol: '₹',
    locale: 'en-IN',
  },
  logoPath: '/images/liveon-connect-logo.png',
  seo: {
    title: 'LIVEON CONNECT — Event AV, LED Wall & Sound Rentals',
    description:
      'Complete audio-visual rental solutions in Kerala including LED walls, live streaming, sound systems, stage lighting, displays, and event production gear.',
    siteUrl: import.meta.env.VITE_SITE_URL || 'https://liveonconnect.vercel.app',
  },
};

export function formatINR(amount: number): string {
  return new Intl.NumberFormat(siteConfig.currency.locale, {
    style: 'currency',
    currency: siteConfig.currency.code,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  if (!message) {
    const defaultGreeting = `Hello ${siteConfig.businessName}, I would like to enquire about audio-visual equipment rentals for an upcoming event.`;
    return `${base}?text=${encodeURIComponent(defaultGreeting)}`;
  }
  return `${base}?text=${encodeURIComponent(message)}`;
}
