import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MessageCircle,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Sliders,
  Truck,
  Headphones,
  Layers,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { siteConfig, getWhatsAppUrl } from '../config/site';
import { useQuote } from '../context/QuoteContext';
import { ProductCard } from '../components/ProductCard';
import { EquipmentImage } from '../components/EquipmentImage';

const EVENT_CATEGORIES = [
  {
    id: 'corporate',
    eyebrow: '01 · CONFERENCES',
    title: 'Corporate Conferences & Summits',
    description:
      'Clear speech reinforcement, P2/P3 LED walls, confidence monitors, short-throw projectors, and wireless presenters.',
    image: '/img/ev-conference.webp',
    link: '/catalogue?event=corporate',
  },
  {
    id: 'launches',
    eyebrow: '02 · LAUNCHES',
    title: 'Brand Launches & Town Halls',
    description:
      'Widescreen LED backdrops, moving-head beams, live video switchers for multi-cam streaming, and line-array sound.',
    image: '/img/ev-launch.webp',
    link: '/catalogue?event=launches',
  },
  {
    id: 'weddings',
    eyebrow: '03 · CELEBRATIONS',
    title: 'Weddings & Receptions',
    description:
      'Stage lighting, Circle Laser effects, Cold Fire spark fountains, LED walls, and full-range QSC & RCF sound systems.',
    image: '/assets/aistudio/l-laser_b77d6f58.webp',
    link: '/catalogue?event=weddings',
  },
  {
    id: 'concerts',
    eyebrow: '04 · LARGE SCALE',
    title: 'Concerts & Exhibitions',
    description:
      'JBL VRX & RCF 9007-AS line-array rigs, Avolites DMX consoles, Sharpy beams, blinders, and CPCB IV+ diesel genset power.',
    image: '/img/ev-outdoor.webp',
    link: '/catalogue?event=concerts',
  },
];

const WHY_CHOOSE_FEATURES = [
  {
    title: 'Quality-Checked Equipment',
    description:
      'Every speaker cabinet, LED module, mixer channel, and lighting fixture is tested prior to dispatch for dependable show operation.',
    icon: ShieldCheck,
  },
  {
    title: 'Event-Focused Solutions',
    description:
      'Equipment combinations tailored around indoor halls, outdoor grounds, stage dimensions, and audience seating layouts.',
    icon: Layers,
  },
  {
    title: 'Competitive Rental Pricing',
    description:
      'Transparent indicative reference rates across daily, square-foot, and five-hour operational units so you can plan your event budget clearly.',
    icon: Sliders,
  },
  {
    title: 'Customer Support',
    description:
      'Direct communication via phone and WhatsApp to help you match the right sound, lighting, and visual gear to your event.',
    icon: Headphones,
  },
  {
    title: 'Delivery and Setup, where available',
    description:
      'Coordinated venue delivery, rigging, signal routing, and post-event dismantling across Kottayam and Kerala venues upon confirmation.',
    icon: Truck,
  },
  {
    title: 'Customized Equipment Packages',
    description:
      'Flexible multi-item rental quotes combining LED walls, live streaming switchers, PA systems, and stage lighting from a single partner.',
    icon: CheckCircle2,
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    number: 'STEP 01',
    title: 'Share Your Event Details',
    description:
      'Select your event date, venue location, event format, and expected audience size so we can evaluate technical requirements.',
  },
  {
    number: 'STEP 02',
    title: 'Choose the Right Equipment',
    description:
      'Browse our 52-item equipment catalogue across 9 categories and add speakers, LED walls, lighting, and accessories to your quote cart.',
  },
  {
    number: 'STEP 03',
    title: 'Confirm Your Rental Quote',
    description:
      'Submit your equipment list via WhatsApp. LIVEON CONNECT will verify date availability, transportation, setup needs, and confirm final pricing.',
  },
  {
    number: 'STEP 04',
    title: 'Coordinate Delivery, Setup and Collection',
    description:
      'Once confirmed by our team, equipment is scheduled for venue delivery, technical installation, and post-show pickup.',
  },
];

export const HomePage: React.FC = () => {
  const { products } = useQuote();
  const featuredProducts = products.slice(0, 8);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
    if (!vid.muted && vid.paused) {
      vid.play().catch(() => {});
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* HERO SECTION — Exact Required Copy + Reference Promo Video Player */}
      <section className="relative bg-white text-slate-900 py-12 sm:py-16 lg:py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Exact Copy & CTAs */}
            <div className="lg:col-span-6 text-left space-y-6">
              <p className="text-xs sm:text-sm font-bold tracking-widest text-blue-700 font-mono-tabular uppercase">
                AUDIO · LIGHTING · LED · AV RENTALS — KERALA
              </p>

              <h1
                className="text-3xl sm:text-5xl lg:text-[3.4rem] font-bold tracking-tight text-slate-950 leading-[1.08]"
                style={{ textWrap: 'balance' }}
              >
                Complete Audio-Visual Solutions for Events of{' '}
                <span className="text-blue-700">Every Scale.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Sound systems, stage lighting, trussing, LED walls, projection and displays from one partner. Delivered to your venue, set up, and picked up after the show.
              </p>

              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  to="/catalogue"
                  className="px-6 py-3.5 rounded-full bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 shadow-sm"
                >
                  <span>Browse the Catalogue →</span>
                </Link>

                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp +91 8590952476</span>
                </a>
              </div>

              <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                <span>Manimala, Kottayam, Kerala</span>
                <span aria-hidden="true">·</span>
                <span>LED Walls &amp; Live Streaming</span>
                <span aria-hidden="true">·</span>
                <span>Line Array Sound &amp; Stage Lighting</span>
              </div>
            </div>

            {/* Right Column: Promo Video Player (.promo style matching EventWave) */}
            <div className="lg:col-span-6">
              <div className="relative rounded-[18px] overflow-hidden bg-[#0B1238] border border-slate-200 shadow-[0_40px_80px_-36px_rgba(31,43,143,0.45)] aspect-video">
                <video
                  ref={videoRef}
                  src="/assets/aistudio/eventwave-promo_d7ba0152.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="block w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={toggleSound}
                  className="absolute right-3 bottom-3 inline-flex items-center gap-2 rounded-full px-3.5 py-2 bg-[#0A0F2E]/75 hover:bg-[#0A0F2E]/90 text-white text-xs font-semibold backdrop-blur-md transition-colors cursor-pointer"
                  aria-label={isMuted ? 'Unmute video sound' : 'Mute video sound'}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-sky-300" />
                      <span>Tap for sound</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      <span>Sound on</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION A — Event Categories (4 Full-Bleed Image Cards matching EventWave .events) */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200" id="events">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <p className="text-xs font-bold tracking-widest text-blue-700 font-mono-tabular uppercase">
              BUILT FOR EVERY OCCASION
            </p>
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mt-2"
              style={{ textWrap: 'balance' }}
            >
              One Partner for Every Audio-Visual Need
            </h2>
            <p className="text-base text-slate-600 mt-2.5">
              Select an event category below to explore tailored combinations of sound systems, stage lighting, displays, and modular LED walls.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EVENT_CATEGORIES.map((eventCat) => (
              <Link
                key={eventCat.id}
                to={eventCat.link}
                className="group relative rounded-2xl overflow-hidden min-h-[340px] flex items-end text-white isolate border border-slate-200/20"
              >
                <img
                  src={eventCat.image}
                  alt={eventCat.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-[center_40%] -z-20 transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 -z-10"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(8,11,30,0.92), rgba(8,11,30,0.15) 65%)',
                  }}
                />
                <div className="p-5 sm:p-6 w-full">
                  <small className="block font-mono-tabular text-[11px] font-medium tracking-widest uppercase text-indigo-200">
                    {eventCat.eyebrow}
                  </small>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-2 mb-1.5 leading-snug">
                    {eventCat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {eventCat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION B — Featured Equipment */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-widest text-blue-700 font-mono-tabular uppercase">
                RENTAL CATALOGUE
              </p>
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mt-2"
                style={{ textWrap: 'balance' }}
              >
                Find the Right Gear for Your Event
              </h2>
              <p className="text-base text-slate-600 mt-2.5">
                Explore professional sound, lighting, LED walls, displays, projection, and AV equipment for your next event.
              </p>
            </div>

            <Link
              to="/catalogue"
              className="self-start md:self-auto px-5 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <span>View Full Catalogue (52 Products)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors"
            >
              <span>View Full Catalogue (All 52 Items)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION C — Why Choose LIVEON CONNECT & How It Works (matching EventWave .why + .steps) */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200" id="why">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <p className="text-xs font-bold tracking-widest text-blue-700 font-mono-tabular uppercase">
                WHY CHOOSE LIVEON CONNECT
              </p>
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900"
                style={{ textWrap: 'balance' }}
              >
                Reliable Equipment. Professional Event Solutions.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Every unit is organised, tagged, and quality-checked in road-ready flight cases before dispatch to your venue.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
              {WHY_CHOOSE_FEATURES.map((feat) => {
                const IconComponent = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="bg-white p-6 flex flex-col gap-2.5"
                  >
                    <IconComponent className="w-7 h-7 text-blue-700" />
                    <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4-Step Process Bar */}
          <div className="mt-16 pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {HOW_IT_WORKS_STEPS.map((step) => (
                <div
                  key={step.number}
                  className="relative pt-6 border-t-2 border-slate-200"
                >
                  <span className="absolute -top-6 left-0 text-[11px] font-bold tracking-widest text-blue-700 font-mono-tabular">
                    {step.number}
                  </span>
                  <span className="absolute -top-[5px] left-0 w-2.5 h-2.5 rounded-full bg-blue-700" />
                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-slate-500">
              Note: Equipment availability, transportation, installation, and final pricing require direct confirmation from {siteConfig.businessName}.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION E — About LIVEON CONNECT (with Real Warehouse Flight-Case Image) */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <figure className="lg:col-span-6 m-0">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-md">
                <EquipmentImage
                  src="/img/office.webp"
                  alt="LIVEON CONNECT Road-Ready Flight Cases and AV Equipment Warehouse"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
              <figcaption className="text-xs font-mono-tabular text-slate-500 mt-2.5 tracking-wide">
                ROAD-READY FLIGHT CASES &amp; QUALITY-CHECKED AV INVENTORY
              </figcaption>
            </figure>

            <div className="lg:col-span-6 space-y-5">
              <p className="text-xs font-bold tracking-widest text-blue-700 font-mono-tabular uppercase">
                ABOUT {siteConfig.businessName}
              </p>
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900"
                style={{ textWrap: 'balance' }}
              >
                Your AV Partner for Memorable Events
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                LIVEON CONNECT provides audio-visual rental solutions for events, including LED walls, live streaming, sound systems, stage lighting, and supporting equipment. We help customers explore suitable equipment combinations based on their event requirements, venue, audience, and budget.
              </p>

              <div className="grid grid-cols-2 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <div className="p-4 sm:p-5 border-r border-b border-slate-200">
                  <b className="block text-2xl font-bold text-slate-900 font-mono-tabular">52</b>
                  <span className="text-[11px] font-mono-tabular uppercase tracking-wider text-slate-500">
                    Rental Products
                  </span>
                </div>
                <div className="p-4 sm:p-5 border-b border-slate-200">
                  <b className="block text-2xl font-bold text-slate-900 font-mono-tabular">9</b>
                  <span className="text-[11px] font-mono-tabular uppercase tracking-wider text-slate-500">
                    AV Categories
                  </span>
                </div>
                <div className="p-4 sm:p-5 border-r border-slate-200">
                  <b className="block text-lg font-bold text-slate-900">Kottayam</b>
                  <span className="text-[11px] font-mono-tabular uppercase tracking-wider text-slate-500">
                    Manimala, Kerala
                  </span>
                </div>
                <div className="p-4 sm:p-5">
                  <b className="block text-lg font-bold text-slate-900">Full Service</b>
                  <span className="text-[11px] font-mono-tabular uppercase tracking-wider text-slate-500">
                    Delivery &amp; Setup
                  </span>
                </div>
              </div>

              <div className="pt-1 flex flex-wrap items-center gap-3">
                <Link
                  to="/about"
                  className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                >
                  Learn More &amp; Read FAQ
                </Link>
                <Link
                  to="/contact"
                  className="px-5 py-2.5 rounded-full border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold transition-colors"
                >
                  Contact Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION F — Contact CTA */}
      <section className="py-16 sm:py-20 bg-[#0A0F2E] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2
            className="text-2xl sm:text-4xl font-bold tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            Let&apos;s Bring Your Event to Life
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Tell us about your event, venue, date, and equipment requirements. Contact LIVEON CONNECT to discuss a suitable AV setup.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 text-sm font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>

            <Link
              to="/catalogue"
              className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 text-sm font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Browse Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`tel:${siteConfig.phoneDial}`}
              className="px-6 py-3.5 rounded-full bg-blue-700 hover:bg-blue-600 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <Phone className="w-4 h-4" />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
