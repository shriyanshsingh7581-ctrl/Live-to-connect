import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, ArrowRight, Send, ChevronUp, Settings } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../data/products';
import { useQuote } from '../context/QuoteContext';

export const Footer: React.FC = () => {
  const { siteSettings } = useQuote();
  const currentYear = new Date().getFullYear();
  const [quickMessage, setQuickMessage] = useState('');

  const handleQuickEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = quickMessage.trim()
      ? `Hello ${siteSettings.businessName}, I would like to enquire about: ${quickMessage.trim()}`
      : `Hello ${siteSettings.businessName}, I would like to enquire about audio-visual equipment rentals for an upcoming event.`;
    const url = `https://wa.me/${siteSettings.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setQuickMessage('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dialPhone = siteSettings.phone.replace(/[^0-9+]/g, '');

  return (
    <footer className="relative intellio-footer-glow text-slate-300 border-t border-[#6854fc]/30 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Column 1: Intellio Top Brand + Request Quote Pill Button */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="bg-white px-3 py-1.5 rounded-xl shadow-md">
                <img
                  src={siteSettings.logoPath}
                  alt={siteSettings.businessName}
                  className="h-10 w-auto object-contain"
                />
              </div>
              <span className="font-display text-3xl font-bold text-white tracking-tight">
                {siteSettings.businessName}
              </span>
            </Link>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug max-w-sm">
              Stay Updated with our Latest AV Rental Offerings
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              {siteSettings.tagline} — Complete audio-visual rental solutions in {siteSettings.addressFull}.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <Link
                to="/quote"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 intellio-solid-btn text-base whitespace-nowrap shrink-0"
              >
                <span>Request Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={siteSettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-full border border-[#6854fc]/50 bg-[#08031d]/80 hover:bg-[#6854fc]/20 text-xs font-semibold text-white transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#6854fc]" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Column 2: Products / Equipment Categories */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-display text-2xl font-bold text-white">
              Products
            </h3>
            <ul className="space-y-3 text-base text-slate-300">
              {PRODUCT_CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    to={`/catalogue?category=${encodeURIComponent(category)}`}
                    className="hover:text-[#6854fc] transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Utility / Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-display text-2xl font-bold text-white">
              Utility
            </h3>
            <ul className="space-y-3 text-base text-slate-300">
              <li>
                <Link to="/" className="hover:text-[#6854fc] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/catalogue" className="hover:text-[#6854fc] transition-colors">
                  Equipment Catalogue
                </Link>
              </li>
              <li>
                <Link to="/quote" className="hover:text-[#6854fc] transition-colors">
                  Quote Checkout
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#6854fc] transition-colors">
                  About &amp; FAQ&apos;s
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#6854fc] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-[#a594ff] hover:text-white font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin Panel</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#6854fc] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-[#6854fc] transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Intellio Corner-Bracket Quick WhatsApp Box */}
          <div className="lg:col-span-3 space-y-5">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white text-center lg:text-left">
              Quick Enquiry
            </h3>

            {/* Corner-Bracket Framed Box */}
            <div className="relative p-6 sm:p-7 bg-[#090420]/70">
              <span
                className="pointer-events-none absolute top-0 left-0 w-12 h-12 border-t border-l border-[#6854fc]/60"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute top-0 right-0 w-12 h-12 border-t border-r border-[#6854fc]/60"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute bottom-0 left-0 w-12 h-12 border-b border-l border-[#6854fc]/60"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute bottom-0 right-0 w-12 h-12 border-b border-r border-[#6854fc]/60"
                aria-hidden="true"
              />

              <p className="text-center text-sm sm:text-base text-slate-200 leading-relaxed mb-5">
                Send your event requirement on WhatsApp to get Latest Rental Rates
              </p>

              <form onSubmit={handleQuickEnquirySubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={quickMessage}
                  onChange={(e) => setQuickMessage(e.target.value)}
                  placeholder="Event requirement..."
                  className="w-full pl-5 pr-14 py-3.5 rounded-full bg-[#060216] border border-[#6854fc]/70 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6854fc]"
                />
                <button
                  type="submit"
                  aria-label="Send WhatsApp enquiry"
                  className="absolute right-1.5 w-11 h-11 rounded-full bg-[#6854fc] hover:bg-[#7b6aff] text-white flex items-center justify-center shadow-lg cursor-pointer transition-transform hover:scale-105"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Official Contact Details */}
            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#6854fc] shrink-0 mt-0.5" />
                <span>{siteSettings.addressFull}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#6854fc] shrink-0" />
                <a href={`tel:${dialPhone}`} className="hover:text-white font-mono-tabular">
                  {siteSettings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#6854fc] shrink-0" />
                <a href={`mailto:${siteSettings.email}`} className="hover:text-white break-all">
                  {siteSettings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Line */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center space-y-2">
          <p className="font-display text-base sm:text-lg font-semibold text-white">
            &copy; {currentYear} Copyright Reserved by {siteSettings.businessName}
          </p>
          <p className="text-xs text-slate-400 max-w-2xl mx-auto">
            Displayed rental rates are indicative reference figures. Final availability, transportation, setup, and quotation require confirmation from {siteSettings.businessName}.
          </p>
        </div>
      </div>

      {/* Floating Bottom-Right Periwinkle Scroll-To-Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-6 right-5 z-30 w-12 h-12 rounded-full bg-[#6854fc] hover:bg-[#7b6aff] text-white shadow-[0_10px_28px_rgba(104,84,252,0.65)] flex items-center justify-center cursor-pointer transition-transform hover:-translate-y-1"
      >
        <ChevronUp className="w-6 h-6 stroke-[2.5]" />
      </button>
    </footer>
  );
};
