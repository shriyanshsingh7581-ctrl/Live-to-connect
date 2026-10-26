import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, MessageCircle, ArrowRight, Settings } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';

export const Header: React.FC = () => {
  const { totalItemCount, setIsQuoteDrawerOpen, siteSettings, products } = useQuote();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const whatsappUrl = `https://wa.me/${siteSettings.whatsappNumber}?text=${encodeURIComponent(
    `Hello ${siteSettings.businessName}, I would like to enquire about audio-visual equipment rentals for an upcoming event.`
  )}`;

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
    `text-sm font-semibold transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
      isActive
        ? 'text-[#6854fc] border-[#6854fc]'
        : 'text-slate-200 border-transparent hover:text-[#6854fc]'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#141418]/95 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Logo & Intellio-style Geometric Brand Title */}
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0 focus:outline-none"
          aria-label={`${siteSettings.businessName} Home`}
        >
          <div className="bg-white px-2.5 py-1.5 rounded-xl shadow-xs shrink-0">
            <img
              src={siteSettings.logoPath}
              alt={siteSettings.businessName}
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </div>
          <span className="font-display text-2xl sm:text-[26px] font-bold tracking-tight text-white whitespace-nowrap">
            {siteSettings.businessName}
          </span>
        </Link>

        {/* Zone 2: Primary Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/catalogue" className={navLinkClass}>
            Equipment Catalogue
          </NavLink>
          <Link
            to="/catalogue#categories"
            className="text-sm font-semibold text-slate-200 hover:text-[#6854fc] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Categories
          </Link>
          <NavLink to="/about" className={navLinkClass}>
            About Us
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#6854fc] border-[#6854fc] text-white'
                  : 'bg-[#6854fc]/15 border-[#6854fc]/50 text-[#a594ff] hover:bg-[#6854fc] hover:text-white'
              }`
            }
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Admin Panel</span>
          </NavLink>
        </nav>

        {/* Zone 3: Search, Quote Cart & Intellio Pill CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setQuickSearchOpen((prev) => !prev)}
            className="p-2.5 rounded-full bg-white/[0.06] border border-[#6854fc]/40 text-white hover:bg-[#6854fc]/20 transition-colors cursor-pointer"
            aria-label="Search equipment catalogue"
            title="Search equipment"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsQuoteDrawerOpen(true)}
            className="px-3.5 py-2 rounded-full bg-[#090420] hover:bg-[#6854fc]/20 border border-[#6854fc]/60 text-white flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            aria-label={`Open Quote Builder (${totalItemCount} items)`}
          >
            <ShoppingBag className="w-4 h-4 text-[#6854fc]" />
            <span className="hidden sm:inline text-xs font-bold">Quote</span>
            <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#6854fc] text-white text-xs font-bold font-mono-tabular flex items-center justify-center">
              {totalItemCount}
            </span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 intellio-solid-btn text-sm whitespace-nowrap shrink-0"
          >
            <span>WhatsApp Us</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Mobile 3-Bar Hamburger Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 text-white hover:text-[#6854fc] transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Expandable Quick Search Bar */}
      {quickSearchOpen && (
        <div className="border-t border-[#6854fc]/30 bg-[#08031d]/95 backdrop-blur-xl py-3.5 px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={handleQuickSearchSubmit}
            className="max-w-3xl mx-auto flex items-center gap-2.5"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#6854fc] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search LED walls, JBL VRX, RCF 9007-AS, Sharpy lights, mixers, projectors..."
                autoFocus
                className="w-full pl-11 pr-4 py-2.5 text-sm bg-[#060216] text-white placeholder:text-slate-400 border border-[#6854fc]/50 rounded-full focus:outline-none focus:ring-2 focus:ring-[#6854fc]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 intellio-solid-btn text-xs whitespace-nowrap shrink-0 cursor-pointer"
            >
              Search Gear
            </button>
            <button
              type="button"
              onClick={() => setQuickSearchOpen(false)}
              className="px-3 py-2 rounded-full text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#6854fc]/30 bg-[#08031d] px-4 pt-3 pb-6 space-y-3 shadow-2xl">
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-2xl text-base font-display font-bold text-white hover:bg-[#6854fc]/20"
            >
              Home
            </NavLink>
            <NavLink
              to="/catalogue"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-2xl text-base font-display font-bold text-white hover:bg-[#6854fc]/20"
            >
              Equipment Catalogue ({products.length} Products)
            </NavLink>
            <Link
              to="/catalogue#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-2xl text-base font-display font-bold text-white hover:bg-[#6854fc]/20"
            >
              Categories
            </Link>
            <NavLink
              to="/quote"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-2xl text-base font-display font-bold text-white hover:bg-[#6854fc]/20 flex items-center justify-between"
            >
              <span>Rental Quote Builder</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#6854fc] text-white text-xs font-mono-tabular">
                {totalItemCount}
              </span>
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-2xl text-base font-display font-bold text-white hover:bg-[#6854fc]/20"
            >
              About Us &amp; FAQ
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-2xl text-base font-display font-bold text-white hover:bg-[#6854fc]/20"
            >
              Contact
            </NavLink>
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-2xl text-base font-display font-bold text-[#a594ff] bg-[#6854fc]/15 hover:bg-[#6854fc]/30 flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span>Admin Control Panel (A to Z)</span>
            </NavLink>
          </nav>

          <div className="pt-3 border-t border-[#6854fc]/25 flex flex-col sm:flex-row gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 intellio-solid-btn text-base flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp {siteSettings.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
