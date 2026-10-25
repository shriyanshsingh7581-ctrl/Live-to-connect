import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, MessageCircle } from 'lucide-react';
import { siteConfig, getWhatsAppUrl } from '../config/site';
import { PRODUCT_CATEGORIES } from '../data/products';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Brand Identity */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block bg-white px-4 py-2.5 rounded-xl">
              <img
                src={siteConfig.logoPath}
                alt={siteConfig.businessName}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <div>
              <div className="text-base font-bold text-white tracking-wide">
                {siteConfig.businessName}
              </div>
              <p className="text-xs font-semibold text-rose-400 tracking-wider mt-0.5">
                {siteConfig.tagline}
              </p>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Complete audio-visual rental solutions for corporate conferences, brand launches, weddings, and concerts across Kerala.
            </p>
            <div className="pt-1 flex items-center gap-3">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition-colors"
              >
                <Instagram className="w-4 h-4 text-rose-500" />
                <span>Follow on Instagram</span>
              </a>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-xs font-semibold text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Column 2: Equipment Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Equipment Categories
            </h3>
            <ul className="space-y-2 text-sm">
              {PRODUCT_CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    to={`/catalogue?category=${encodeURIComponent(category)}`}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/catalogue" className="text-slate-400 hover:text-white transition-colors">
                  Equipment Catalogue
                </Link>
              </li>
              <li>
                <Link to="/quote" className="text-slate-400 hover:text-white transition-colors">
                  Rental Quote Builder
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  About Us &amp; FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-slate-400 hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Contact Information
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-1" />
                <span>{siteConfig.address.full}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a
                  href={`tel:${siteConfig.phoneDial}`}
                  className="hover:text-white transition-colors font-mono-tabular"
                >
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-sky-400 shrink-0" />
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors font-mono-tabular"
                >
                  WhatsApp: {siteConfig.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-white transition-colors break-all"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Pricing Notice */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {currentYear} {siteConfig.businessName}. All rights reserved.
          </p>
          <p>
            Displayed rental rates are indicative reference figures. Final availability, transportation, setup, and quotation require confirmation from {siteConfig.businessName}.
          </p>
        </div>
      </div>
    </footer>
  );
};
