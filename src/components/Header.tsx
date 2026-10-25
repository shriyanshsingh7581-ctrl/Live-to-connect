import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, MessageCircle } from 'lucide-react';
import { siteConfig, getWhatsAppUrl } from '../config/site';
import { useQuote } from '../context/QuoteContext';

export const Header: React.FC = () => {
  const { totalItemCount, setIsQuoteDrawerOpen } = useQuote();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    setQuickSearchOpen(false);
    setMobileMenuOpen(false);
    if (trimmed) {
      navigate(`/catalogue?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/catalogue');
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-all whitespace-nowrap shrink-0 py-1.5 border-b-2 ${
      isActive
        ? 'text-fuchsia-700 border-rose-600'
        : 'text-slate-700 border-transparent hover:text-blue-700 hover:border-blue-400'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-indigo-100 shadow-xs">
      {/* Top Multicolour LED Spectrum Strip inspired by LIVEON CONNECT Logo */}
      <div className="h-1.5 w-full led-spectrum-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Logo */}
        <Link
          to="/"
          className="flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-600 rounded-lg"
          aria-label={`${siteConfig.businessName} Home`}
        >
          <img
            src={siteConfig.logoPath}
            alt={`${siteConfig.businessName} — ${siteConfig.tagline}`}
            className="h-12 sm:h-14 w-auto object-contain"
          />
        </Link>

        {/* Zone 2: Primary Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Main Navigation">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/catalogue" className={navLinkClass}>
            Equipment Catalogue
          </NavLink>
          <Link
            to="/catalogue#categories"
            className="text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 py-1.5 border-b-2 border-transparent hover:border-blue-400"
          >
            Categories
          </Link>
          <NavLink to="/about" className={navLinkClass}>
            About Us
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        {/* Zone 3: Search, Quote Cart & WhatsApp CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setQuickSearchOpen((prev) => !prev)}
            className="p-2.5 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
            aria-label="Search equipment catalogue"
            title="Search equipment"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setIsQuoteDrawerOpen(true)}
            className="relative px-3.5 py-2 rounded-full border border-purple-200 bg-gradient-to-r from-rose-50 via-fuchsia-50 to-indigo-50 hover:from-rose-100 hover:to-indigo-100 text-slate-900 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-2xs"
            aria-label={`Open Quote Builder (${totalItemCount} items)`}
          >
            <ShoppingBag className="w-4 h-4 text-rose-600" />
            <span className="hidden sm:inline text-xs font-bold text-purple-950">Quote</span>
            <span className="min-w-5 h-5 px-1.5 rounded-full bg-gradient-to-r from-rose-600 via-fuchsia-600 to-blue-600 text-white text-xs font-bold font-mono-tabular flex items-center justify-center">
              {totalItemCount}
            </span>
          </button>

          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold transition-all whitespace-nowrap shrink-0 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp CTA</span>
          </a>

          {/* Mobile Hamburger Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Expandable Quick Search Bar */}
      {quickSearchOpen && (
        <div className="border-t border-indigo-100 bg-gradient-to-r from-rose-50/70 via-indigo-50/70 to-cyan-50/70 py-3 px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={handleQuickSearchSubmit}
            className="max-w-3xl mx-auto flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search LED walls, JBL VRX, RCF 9007-AS, Sharpy lights, mixers, projectors..."
                autoFocus
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-indigo-200 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-rose-600 via-fuchsia-600 to-blue-600 text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
            >
              Search Gear
            </button>
            <button
              type="button"
              onClick={() => setQuickSearchOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-indigo-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-indigo-50"
            >
              Home
            </NavLink>
            <NavLink
              to="/catalogue"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-indigo-50"
            >
              Equipment Catalogue (52 Products)
            </NavLink>
            <Link
              to="/catalogue#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-indigo-50"
            >
              Categories
            </Link>
            <NavLink
              to="/quote"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-indigo-50 flex items-center justify-between"
            >
              <span>Rental Quote Builder</span>
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-blue-600 text-white text-xs font-mono-tabular">
                {totalItemCount}
              </span>
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-indigo-50"
            >
              About Us &amp; FAQ
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-indigo-50"
            >
              Contact
            </NavLink>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp {siteConfig.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
