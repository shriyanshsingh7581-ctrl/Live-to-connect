import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MessageCircle, ArrowRight, Phone } from 'lucide-react';
import { siteConfig, getWhatsAppUrl } from '../config/site';
import { PRODUCT_CATEGORIES } from '../data/products';
import { EquipmentImage } from '../components/EquipmentImage';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    category: 'Rental Products',
    question: 'What types of audio-visual equipment can I rent from LIVEON CONNECT?',
    answer:
      'LIVEON CONNECT provides 52 equipment configurations across 9 categories: Sound Systems (500W Bluetooth speakers up to JBL VRX and RCF 12 & 9007-AS line array stacks), Stage Lighting (LED Par Cans, Sharpy beams, Blinders, Profile/Follow spots, Avolites consoles, and Circle Lasers), Modular LED Walls (8×6 ft up to 10×30 ft and fine-pitch P2 walls), TVs & Displays (43" to 75" and Touch Screen TVs), Projectors, Mixers & Microphones (Soundcraft LX7, Allen & Heath SQ7, Drum Mic Sets), AV Accessories (Live Video Switchers, Clear-Com Intercoms, Cue Commanders), Special Effects, and Acoustic Diesel Gensets.',
  },
  {
    category: 'Daily Rates',
    question: 'How do daily rental rates work in the equipment catalogue?',
    answer:
      'Most sound, lighting, projector, mixer, display, and accessory items are listed with an indicative per-day reference price or price range in INR (₹/day). In the Quote Builder, daily equipment estimates are calculated as Selected Rate × Quantity × Rental Days. All displayed rates are reference figures and require confirmation from LIVEON CONNECT based on your specific event requirements.',
  },
  {
    category: 'LED Wall Pricing',
    question: 'How is LED wall pricing calculated for fixed sizes versus the P2 LED Wall?',
    answer:
      'Standard modular stage sizes (8×6 ft, 10×12 ft, 10×20 ft, and 10×30 ft) have indicative daily package reference ranges. The fine-pitch P2 LED Wall is priced per square foot (₹120–₹150/sq ft reference rate). In our catalogue and Quote Builder, you can enter your required Width (ft) and Height (ft) to calculate the total square footage and indicative estimate.',
  },
  {
    category: 'Genset Billing',
    question: 'How is the Diesel Genset billed for events?',
    answer:
      'Unlike standard daily AV items, the DEC DE63 CPCB IV+ soundproof diesel generator set is billed in 5-hour operational blocks (₹7,000 per 5 hours reference rate). You can select the required number of 5-hour blocks directly in the Catalogue or Quote Builder.',
  },
  {
    category: 'Transportation',
    question: 'Is venue transportation included in the indicative equipment estimate?',
    answer:
      'Transportation is calculated separately and shown as "To Be Confirmed" in your quote summary. Transport charges depend on the venue distance from Manimala, Kottayam, the total volume/weight of LED wall structures, sound stacks, or gensets, and local venue access conditions.',
  },
  {
    category: 'Availability',
    question: 'Does adding equipment to the Quote Cart reserve it for my event date?',
    answer:
      'Adding items to your Quote Cart generates an indicative enquiry list and does not automatically reserve inventory. Equipment availability for your specific event date must be verified directly with LIVEON CONNECT via WhatsApp or phone.',
  },
  {
    category: 'Delivery and Setup',
    question: 'Do you provide delivery, on-site setup, and technical operation?',
    answer:
      'Yes, where available and confirmed as part of your quotation, LIVEON CONNECT coordinates equipment delivery to your venue, stage rigging, signal setup, and post-event collection after the show.',
  },
  {
    category: 'Quote Requests',
    question: 'How do I request a final confirmed quotation?',
    answer:
      'Select your required gear in the Catalogue, open the Rental Quote Builder (/quote), enter your event date, venue, and audience size, and click "Send Quote Request via WhatsApp". This opens a pre-formatted WhatsApp message addressed to +91 8590952476 so our team can confirm availability and provide your final quotation.',
  },
];

export const AboutPage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="bg-slate-950 text-white py-14 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-widest text-sky-400 uppercase">
            About {siteConfig.businessName}
          </p>
          <h1
            className="text-3xl sm:text-5xl font-bold mt-2 max-w-3xl"
            style={{ textWrap: 'balance' }}
          >
            Your AV Partner for Memorable Events
          </h1>
          <p className="text-base sm:text-lg text-slate-300 mt-4 max-w-2xl leading-relaxed">
            {siteConfig.businessName} ({siteConfig.tagline}) provides audio-visual rental solutions from Manimala, Kottayam, Kerala.
          </p>
        </div>
      </section>

      {/* Business Introduction & Capabilities */}
      <section className="py-16 sm:py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-block bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <img
                  src={siteConfig.logoPath}
                  alt={siteConfig.businessName}
                  className="h-14 w-auto object-contain"
                />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Comprehensive Event Audio-Visual Rentals
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                LIVEON CONNECT provides audio-visual rental solutions for events, including LED walls, live streaming, sound systems, stage lighting, and supporting equipment. We help customers explore suitable equipment combinations based on their event requirements, venue, audience, and budget.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Whether you are organizing a corporate conference, a product launch, a wedding reception, or a live concert, our catalogue brings together modular LED walls, digital audio consoles, line-array speaker systems, intelligent stage lighting, multi-camera video switchers, and backup generator power under one roof.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-lg">
                <EquipmentImage
                  src="/img/office.webp"
                  alt="LIVEON CONNECT Stage and Audio-Visual Warehouse Inventory"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </div>
          </div>

          {/* Service Categories & Event Types Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                Equipment Categories We Offer
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                52 rental configurations across 9 specialized AV categories:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRODUCT_CATEGORIES.map((category) => (
                  <Link
                    key={category}
                    to={`/catalogue?category=${encodeURIComponent(category)}`}
                    className="px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 hover:border-blue-600 text-xs font-semibold text-slate-800 hover:text-blue-700 flex items-center justify-between transition-colors"
                  >
                    <span>{category}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                Event Types Served
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>
                  <strong className="text-slate-900">Corporate Conferences &amp; Summits:</strong>{' '}
                  P2 fine-pitch LED screens, confidence displays, digital mixing desks, and wireless presentation cue systems.
                </li>
                <li>
                  <strong className="text-slate-900">Brand Launches &amp; Town Halls:</strong>{' '}
                  Widescreen stage LED walls, multi-cam live video switchers for streaming, profile spots, and PA systems.
                </li>
                <li>
                  <strong className="text-slate-900">Weddings &amp; Receptions:</strong>{' '}
                  Ambient LED par washes, moving beam fixtures, stage LED backdrops, cold spark effects, and full-range sound.
                </li>
                <li>
                  <strong className="text-slate-900">Concerts &amp; Exhibitions:</strong>{' '}
                  JBL VRX and RCF 9007-AS high-output sound rigs, Avolites DMX consoles, lasers, and CPCB IV+ diesel genset power.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold tracking-widest text-blue-700 uppercase">
              Frequently Asked Questions
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              Rental Pricing, Billing &amp; Logistics FAQ
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Clear answers on how daily rates, P2 LED wall square-foot pricing, Genset 5-hour billing, and WhatsApp quote requests work.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={item.question}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <div>
                      <span className="text-[11px] font-semibold text-blue-700">
                        {item.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                        {item.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-150 ${
                        isOpen ? 'rotate-180 text-blue-700' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
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
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Need Help Selecting the Right AV Package?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Reach out to {siteConfig.businessName} in Manimala, Kottayam to discuss your venue layout, audience size, and technical requirements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp {siteConfig.whatsappDisplay}</span>
            </a>
            <Link
              to="/catalogue"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white hover:bg-slate-100 text-slate-900 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>Explore Equipment Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`tel:${siteConfig.phoneDial}`}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-sky-400" />
              <span>Call {siteConfig.phone}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
