import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MessageCircle, ArrowRight, Phone } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../data/products';
import { EquipmentImage } from '../components/EquipmentImage';
import { useQuote } from '../context/QuoteContext';

export const AboutPage: React.FC = () => {
  const { siteSettings, faqItems, products } = useQuote();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const whatsappUrl = `https://wa.me/${siteSettings.whatsappNumber}?text=${encodeURIComponent(
    `Hello ${siteSettings.businessName}, I would like to enquire about audio-visual equipment rentals for an upcoming event.`
  )}`;
  const dialPhone = siteSettings.phone.replace(/[^0-9+]/g, '');

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100">
      {/* Hero Banner */}
      <section className="relative intellio-grid-bg text-white py-14 sm:py-20 border-b border-white/[0.08] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 20% 35%, rgba(99, 102, 241, 0.22) 0%, transparent 45%), radial-gradient(circle at 80% 30%, rgba(217, 70, 239, 0.18) 0%, transparent 45%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-wider text-indigo-300 font-mono-tabular">
            About {siteSettings.businessName}
          </p>
          <h1
            className="text-3xl sm:text-5xl font-bold mt-2 max-w-3xl"
            style={{ textWrap: 'balance' }}
          >
            Your AV Partner for <span className="led-text-gradient">Memorable Events</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 mt-4 max-w-2xl leading-relaxed">
            {siteSettings.businessName} ({siteSettings.tagline}) provides audio-visual rental solutions from {siteSettings.addressFull}.
          </p>
        </div>
      </section>

      {/* Business Introduction & Capabilities */}
      <section className="py-16 sm:py-20 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-block bg-white p-3 rounded-xl shadow-md">
                <img
                  src={siteSettings.logoPath}
                  alt={siteSettings.businessName}
                  className="h-14 w-auto object-contain"
                />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Comprehensive Event Audio-Visual Rentals
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                {siteSettings.businessName} provides audio-visual rental solutions for events, including LED walls, live streaming, sound systems, stage lighting, and supporting equipment. We help customers explore suitable equipment combinations based on their event requirements, venue, audience, and budget.
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                Whether you are organizing a corporate conference, a product launch, a wedding reception, or a live concert, our catalogue brings together modular LED walls, digital audio consoles, line-array speaker systems, intelligent stage lighting, multi-camera video switchers, and backup generator power under one roof.
              </p>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="p-3 rounded-[28px] intellio-card shadow-2xl">
                <div className="rounded-[20px] overflow-hidden bg-slate-950 border border-[#6854fc]/35">
                  <EquipmentImage
                    src="/assets/aistudio/IMG-20261025-WA0039_851e9d5d.jpg"
                    alt="LIVEON CONNECT FOH Control & Stage LED Wall"
                    className="w-full aspect-[16/10] object-cover"
                  />
                </div>
                <p className="text-xs text-slate-300 px-2 pt-2.5">
                  {siteSettings.businessName} on-site OBS Studio live production desk, road-ready flight cases, and modular stage LED wall.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-2.5 rounded-[22px] intellio-card">
                  <div className="rounded-xl overflow-hidden aspect-[16/10]">
                    <EquipmentImage
                      src="/assets/aistudio/IMG-20261025-WA0068_830a56a3.jpg"
                      alt="Wedding FOH NovaStar VX1, OBS Studio & Stage LED Wall"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[11px] font-semibold text-slate-300 mt-2 px-1">
                    Wedding FOH NovaStar VX1, OBS &amp; Stage LED Wall
                  </p>
                </div>
                <div className="p-2.5 rounded-[22px] intellio-card">
                  <div className="rounded-xl overflow-hidden aspect-[16/10]">
                    <EquipmentImage
                      src="/assets/aistudio/IMG-20261025-WA0065_f92ae4c4.jpg"
                      alt="Outdoor LED Wall Mega Show & PA Sound Setup"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[11px] font-semibold text-slate-300 mt-2 px-1">
                    Outdoor LED Wall Mega Show &amp; PA Sound Rig
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional On-Site Production Strip */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-3.5 rounded-[24px] intellio-card space-y-2">
              <div className="rounded-2xl overflow-hidden aspect-video border border-[#6854fc]/35">
                <EquipmentImage
                  src="/assets/aistudio/IMG-20261025-WA0069_b0d21777.jpg"
                  alt="Traditional Kerala Wedding Procession on Stage LED Wall"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs font-semibold text-white px-1">
                Traditional Wedding Procession Live LED Wall
              </p>
            </div>
            <div className="p-3.5 rounded-[24px] intellio-card space-y-2">
              <div className="rounded-2xl overflow-hidden aspect-video border border-[#6854fc]/35">
                <EquipmentImage
                  src="/assets/aistudio/IMG-20261025-WA0023_0e200ba8.jpg"
                  alt="ATEM Multi-Cam Switcher & Dual Hollyland Multiview"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs font-semibold text-white px-1">
                ATEM Multi-Cam Switcher &amp; Dual Hollyland Multiview
              </p>
            </div>
            <div className="p-3.5 rounded-[24px] intellio-card space-y-2">
              <div className="rounded-2xl overflow-hidden aspect-video border border-[#6854fc]/35 bg-[#050112]">
                <video
                  src="/assets/aistudio/VID-20261025-WA0073_b2b97e51.mp4"
                  poster="/assets/aistudio/IMG-20261025-WA0043_7db4c382.jpg"
                  controls
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs font-semibold text-white px-1">
                Graduation Ceremony 2026 — Dual-Laptop OBS Broadcast
              </p>
            </div>
          </div>

          {/* Service Categories & Event Types Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 sm:p-8 rounded-2xl intellio-card">
              <h3 className="text-lg font-bold text-white">
                Equipment Categories We Offer
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                {products.length} rental configurations across 9 specialized AV categories:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRODUCT_CATEGORIES.map((category) => (
                  <Link
                    key={category}
                    to={`/catalogue?category=${encodeURIComponent(category)}`}
                    className="px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-indigo-400/60 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-between transition-colors"
                  >
                    <span>{category}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl intellio-card space-y-4">
              <h3 className="text-lg font-bold text-white">
                Event Types Served
              </h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>
                  <strong className="text-white">Corporate Conferences &amp; Summits:</strong>{' '}
                  P2 fine-pitch LED screens, confidence displays, digital mixing desks, and wireless presentation cue systems.
                </li>
                <li>
                  <strong className="text-white">Brand Launches &amp; Town Halls:</strong>{' '}
                  Widescreen stage LED walls, multi-cam live video switchers for streaming, profile spots, and PA systems.
                </li>
                <li>
                  <strong className="text-white">Weddings &amp; Receptions:</strong>{' '}
                  Ambient LED par washes, moving beam fixtures, stage LED backdrops, cold spark effects, and full-range sound.
                </li>
                <li>
                  <strong className="text-white">Concerts &amp; Exhibitions:</strong>{' '}
                  JBL VRX and RCF 9007-AS high-output sound rigs, Avolites DMX consoles, lasers, and CPCB IV+ diesel genset power.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-16 sm:py-20 intellio-subgrid-bg border-b border-white/[0.08]" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-semibold tracking-wider text-indigo-300 font-mono-tabular">
              Frequently Asked Questions
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
              Rental Pricing, Billing &amp; Logistics FAQ
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Clear answers on how daily rates, P2 LED wall square-foot pricing, Genset 5-hour billing, and WhatsApp quote requests work.
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={item.id}
                  className="intellio-card rounded-2xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <div>
                      <span className="text-[11px] font-semibold text-indigo-300 font-mono-tabular">
                        {item.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                        {item.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-150 ${
                        isOpen ? 'rotate-180 text-indigo-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 text-sm text-slate-300 leading-relaxed border-t border-white/10">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 intellio-grid-bg text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Need Help Selecting the Right AV Package?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Reach out to {siteSettings.businessName} in {siteSettings.addressFull} to discuss your venue layout, audience size, and technical requirements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl intellio-btn-primary text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp {siteSettings.phone}</span>
            </a>
            <Link
              to="/catalogue"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>Explore Equipment Catalogue</span>
              <ArrowRight className="w-4 h-4 text-indigo-400" />
            </Link>
            <a
              href={`tel:${dialPhone}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/15 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>Call {siteSettings.phone}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
