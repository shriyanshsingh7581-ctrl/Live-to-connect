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
    topBar: 'from-cyan-400 via-blue-500 to-indigo-600',
    badgeClass: 'text-cyan-300',
    scrim: 'linear-gradient(to top, rgba(15,23,42,0.95), rgba(30,58,138,0.45) 55%, rgba(15,23,42,0.1))',
  },
  {
    id: 'launches',
    eyebrow: '02 · LAUNCHES',
    title: 'Brand Launches & Town Halls',
    description:
      'Widescreen LED backdrops, moving-head beams, live video switchers for multi-cam streaming, and line-array sound.',
    image: '/img/ev-launch.webp',
    link: '/catalogue?event=launches',
    topBar: 'from-rose-500 via-fuchsia-500 to-purple-600',
    badgeClass: 'text-pink-300',
    scrim: 'linear-gradient(to top, rgba(35,10,45,0.95), rgba(131,24,67,0.45) 55%, rgba(15,23,42,0.1))',
  },
  {
    id: 'weddings',
    eyebrow: '03 · CELEBRATIONS',
    title: 'Weddings & Receptions',
    description:
      'Stage lighting, Circle Laser effects, Cold Fire spark fountains, LED walls, and full-range QSC & RCF sound systems.',
    image: '/assets/aistudio/l-laser_b77d6f58.webp',
    link: '/catalogue?event=weddings',
    topBar: 'from-amber-400 via-rose-500 to-fuchsia-600',
    badgeClass: 'text-amber-300',
    scrim: 'linear-gradient(to top, rgba(28,12,48,0.95), rgba(112,26,117,0.45) 55%, rgba(15,23,42,0.1))',
  },
  {
    id: 'concerts',
    eyebrow: '04 · LARGE SCALE',
    title: 'Concerts & Exhibitions',
    description:
      'JBL VRX & RCF 9007-AS line-array rigs, Avolites DMX consoles, Sharpy beams, blinders, and CPCB IV+ diesel genset power.',
    image: '/img/ev-outdoor.webp',
    link: '/catalogue?event=concerts',
    topBar: 'from-emerald-400 via-teal-500 to-cyan-600',
    badgeClass: 'text-emerald-300',
    scrim: 'linear-gradient(to top, rgba(6,32,38,0.95), rgba(15,118,110,0.45) 55%, rgba(15,23,42,0.1))',
  },
];

const WHY_CHOOSE_FEATURES = [
  {
    title: 'Quality-Checked Equipment',
    description:
      'Every speaker cabinet, LED module, mixer channel, and lighting fixture is tested prior to dispatch for dependable show operation.',
    icon: ShieldCheck,
    iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white',
    cardBorder: 'border-rose-200/80 bg-gradient-to-br from-white to-rose-50/40',
  },
  {
    title: 'Event-Focused Solutions',
    description:
      'Equipment combinations tailored around indoor halls, outdoor grounds, stage dimensions, and audience seating layouts.',
    icon: Layers,
    iconBg: 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white',
    cardBorder: 'border-purple-200/80 bg-gradient-to-br from-white to-purple-50/40',
  },
  {
    title: 'Competitive Rental Pricing',
    description:
      'Transparent indicative reference rates across daily, square-foot, and five-hour operational units so you can plan your event budget clearly.',
    icon: Sliders,
    iconBg: 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white',
    cardBorder: 'border-blue-200/80 bg-gradient-to-br from-white to-blue-50/40',
  },
  {
    title: 'Customer Support',
    description:
      'Direct communication via phone and WhatsApp to help you match the right sound, lighting, and visual gear to your event.',
    icon: Headphones,
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
    cardBorder: 'border-emerald-200/80 bg-gradient-to-br from-white to-emerald-50/40',
  },
  {
    title: 'Delivery and Setup, where available',
    description:
      'Coordinated venue delivery, rigging, signal routing, and post-event dismantling across Kottayam and Kerala venues upon confirmation.',
    icon: Truck,
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white',
    cardBorder: 'border-amber-200/80 bg-gradient-to-br from-white to-amber-50/40',
  },
  {
    title: 'Customized Equipment Packages',
    description:
      'Flexible multi-item rental quotes combining LED walls, live streaming switchers, PA systems, and stage lighting from a single partner.',
    icon: CheckCircle2,
    iconBg: 'bg-gradient-to-br from-fuchsia-600 to-rose-600 text-white',
    cardBorder: 'border-fuchsia-200/80 bg-gradient-to-br from-white to-fuchsia-50/40',
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    number: 'STEP 01',
    title: 'Share Your Event Details',
    description:
      'Select your event date, venue location, event format, and expected audience size so we can evaluate technical requirements.',
    accent: 'border-rose-500 text-rose-600 bg-rose-50',
    dot: 'bg-rose-500',
  },
  {
    number: 'STEP 02',
    title: 'Choose the Right Equipment',
    description:
      'Browse our 52-item equipment catalogue across 9 categories and add speakers, LED walls, lighting, and accessories to your quote cart.',
    accent: 'border-fuchsia-600 text-fuchsia-700 bg-fuchsia-50',
    dot: 'bg-fuchsia-600',
  },
  {
    number: 'STEP 03',
    title: 'Confirm Your Rental Quote',
    description:
      'Submit your equipment list via WhatsApp. LIVEON CONNECT will verify date availability, transportation, setup needs, and confirm final pricing.',
    accent: 'border-blue-600 text-blue-700 bg-blue-50',
    dot: 'bg-blue-600',
  },
  {
    number: 'STEP 04',
    title: 'Coordinate Delivery, Setup and Collection',
    description:
      'Once confirmed by our team, equipment is scheduled for venue delivery, technical installation, and post-show pickup.',
    accent: 'border-emerald-600 text-emerald-700 bg-emerald-50',
    dot: 'bg-emerald-500',
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
      {/* HERO SECTION — Rich Stage-Light Colourful Backdrop + Promo Video Player */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#090D24] via-[#17113A] to-[#2A0C38] text-white py-12 sm:py-16 lg:py-20 border-b border-fuchsia-900/40">
        {/* Ambient Stage Lighting Glow Orbs */}
        <div
          className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-rose-600/25 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-fuchsia-600/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 right-10 w-96 h-96 rounded-full bg-cyan-500/25 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Exact Copy & Vibrant CTAs */}
            <div className="lg:col-span-6 text-left space-y-6">
              <p className="inline-block text-xs sm:text-sm font-bold tracking-widest text-cyan-300 font-mono-tabular uppercase">
                AUDIO · LIGHTING · LED · AV RENTALS — KERALA
              </p>

              <h1
                className="text-3xl sm:text-5xl lg:text-[3.4rem] font-bold tracking-tight text-white leading-[1.08]"
                style={{ textWrap: 'balance' }}
              >
                Complete Audio-Visual Solutions for Events of{' '}
                <span className="led-text-gradient">Every Scale.</span>
              </h1>

              <p className="text-base sm:text-lg text-indigo-100/90 leading-relaxed max-w-2xl">
                Sound systems, stage lighting, trussing, LED walls, projection and displays from one partner. Delivered to your venue, set up, and picked up after the show.
              </p>

              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  to="/catalogue"
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-fuchsia-600 to-blue-600 hover:from-rose-500 hover:via-fuchsia-500 hover:to-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0 shadow-lg shadow-fuchsia-950/50"
                >
                  <span>Browse the Catalogue →</span>
                </Link>

                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0 shadow-lg shadow-emerald-950/40"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp +91 8590952476</span>
                </a>
              </div>

              <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-indigo-200/80">
                <span className="text-rose-300 font-semibold">Manimala, Kottayam, Kerala</span>
                <span aria-hidden="true">·</span>
                <span className="text-fuchsia-300 font-semibold">LED Walls &amp; Live Streaming</span>
                <span aria-hidden="true">·</span>
                <span className="text-cyan-300 font-semibold">Line Array Sound &amp; Stage Lighting</span>
              </div>
            </div>

            {/* Right Column: Promo Video Player framed in LED Spectrum Border */}
            <div className="lg:col-span-6">
              <div className="p-1 rounded-[22px] bg-gradient-to-r from-rose-500 via-fuchsia-500 via-blue-500 to-cyan-400 shadow-[0_30px_80px_-20px_rgba(217,70,239,0.45)]">
                <div className="relative rounded-[18px] overflow-hidden bg-[#0B1238] aspect-video">
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
                    className="absolute right-3 bottom-3 inline-flex items-center gap-2 rounded-full px-4 py-2 bg-gradient-to-r from-rose-600/90 via-purple-700/90 to-blue-700/90 hover:from-rose-500 hover:to-blue-600 text-white text-xs font-bold backdrop-blur-md transition-all cursor-pointer shadow-md"
                    aria-label={isMuted ? 'Unmute video sound' : 'Mute video sound'}
                  >
                    {isMuted ? (
                      <>
                        <VolumeX className="w-4 h-4 text-cyan-300" />
                        <span>Tap for sound</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-emerald-300" />
                        <span>Sound on</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION A — Event Categories (4 Vibrant Colour-Coded Photo Cards) */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-fuchsia-50/30 to-indigo-50/40 border-b border-indigo-100" id="events">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <p className="text-xs font-bold tracking-widest text-rose-600 font-mono-tabular uppercase">
              BUILT FOR EVERY OCCASION
            </p>
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mt-2"
              style={{ textWrap: 'balance' }}
            >
              One Partner for <span className="led-heading-gradient">Every Audio-Visual Need</span>
            </h2>
            <p className="text-base text-slate-600 mt-2.5">
              Select an event category below to explore tailored combinations of sound systems, stage lighting, displays, and modular LED walls.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {EVENT_CATEGORIES.map((eventCat) => (
              <Link
                key={eventCat.id}
                to={eventCat.link}
                className="group relative rounded-2xl overflow-hidden min-h-[350px] flex flex-col justify-between text-white isolate shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Top Colorful Bar */}
                <div className={`h-2 w-full bg-gradient-to-r ${eventCat.topBar}`} />

                <img
                  src={eventCat.image}
                  alt={eventCat.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-[center_40%] -z-20 transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 -z-10"
                  style={{ background: eventCat.scrim }}
                />
                <div className="p-5 sm:p-6 mt-auto w-full">
                  <small className={`block font-mono-tabular text-[11px] font-bold tracking-widest uppercase ${eventCat.badgeClass}`}>
                    {eventCat.eyebrow}
                  </small>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-2 mb-1.5 leading-snug">
                    {eventCat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                    {eventCat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION B — Featured Equipment */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-indigo-50/60 via-white to-rose-50/60 border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-widest text-fuchsia-700 font-mono-tabular uppercase">
                RENTAL CATALOGUE HIGHLIGHTS
              </p>
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mt-2"
                style={{ textWrap: 'balance' }}
              >
                Find the Right Gear for <span className="led-heading-gradient">Your Event</span>
              </h2>
              <p className="text-base text-slate-600 mt-2.5">
                Explore professional sound, lighting, LED walls, displays, projection, and AV equipment for your next event.
              </p>
            </div>

            <Link
              to="/catalogue"
              className="self-start md:self-auto px-5 py-3 rounded-full bg-gradient-to-r from-rose-600 via-fuchsia-600 to-blue-600 hover:from-rose-700 hover:to-blue-700 text-white text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap shrink-0 shadow-sm"
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
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-purple-600 to-blue-600 hover:from-rose-700 hover:to-blue-700 text-white text-sm font-bold transition-all shadow-md"
            >
              <span>View Full Catalogue (All 52 Items)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION C — Why Choose LIVEON CONNECT & How It Works */}
      <section className="py-16 sm:py-20 bg-white border-b border-indigo-100" id="why">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-4">
              <p className="text-xs font-bold tracking-widest text-rose-600 font-mono-tabular uppercase">
                WHY CHOOSE LIVEON CONNECT
              </p>
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900"
                style={{ textWrap: 'balance' }}
              >
                Reliable Equipment. <span className="led-heading-gradient">Professional Event Solutions.</span>
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Every unit is organised, tagged, and quality-checked in road-ready flight cases before dispatch to your venue.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WHY_CHOOSE_FEATURES.map((feat) => {
                const IconComponent = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className={`p-6 rounded-2xl border ${feat.cardBorder} flex flex-col gap-3 shadow-2xs`}
                  >
                    <div className={`w-11 h-11 rounded-xl ${feat.iconBg} flex items-center justify-center shadow-sm`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4-Step Process Bar with Colourful Accents */}
          <div className="mt-16 pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {HOW_IT_WORKS_STEPS.map((step) => (
                <div
                  key={step.number}
                  className={`p-5 rounded-2xl border-t-4 ${step.accent} shadow-2xs`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${step.dot}`} />
                    <span className="text-xs font-bold tracking-widest font-mono-tabular">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">{step.title}</h3>
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
      <section className="py-16 sm:py-20 bg-gradient-to-r from-rose-50/50 via-purple-50/40 to-cyan-50/50 border-b border-indigo-100" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <figure className="lg:col-span-6 m-0">
              <div className="p-1 rounded-2xl bg-gradient-to-r from-rose-500 via-fuchsia-500 to-cyan-500 shadow-lg">
                <div className="rounded-xl overflow-hidden bg-slate-950">
                  <EquipmentImage
                    src="/img/office.webp"
                    alt="LIVEON CONNECT Road-Ready Flight Cases and AV Equipment Warehouse"
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
              </div>
              <figcaption className="text-xs font-mono-tabular font-semibold text-purple-800 mt-2.5 tracking-wide">
                ROAD-READY FLIGHT CASES &amp; QUALITY-CHECKED AV INVENTORY
              </figcaption>
            </figure>

            <div className="lg:col-span-6 space-y-5">
              <p className="text-xs font-bold tracking-widest text-fuchsia-700 font-mono-tabular uppercase">
                ABOUT {siteConfig.businessName}
              </p>
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900"
                style={{ textWrap: 'balance' }}
              >
                Your AV Partner for <span className="led-heading-gradient">Memorable Events</span>
              </h2>
              <p className="text-base text-slate-700 leading-relaxed">
                LIVEON CONNECT provides audio-visual rental solutions for events, including LED walls, live streaming, sound systems, stage lighting, and supporting equipment. We help customers explore suitable equipment combinations based on their event requirements, venue, audience, and budget.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-sm">
                  <b className="block text-2xl font-bold font-mono-tabular">52</b>
                  <span className="text-[11px] font-mono-tabular uppercase tracking-wider text-rose-100">
                    Rental Products
                  </span>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-sm">
                  <b className="block text-2xl font-bold font-mono-tabular">9</b>
                  <span className="text-[11px] font-mono-tabular uppercase tracking-wider text-purple-100">
                    AV Categories
                  </span>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-sm">
                  <b className="block text-lg font-bold">Kottayam</b>
                  <span className="text-[11px] font-mono-tabular uppercase tracking-wider text-cyan-100">
                    Manimala, Kerala
                  </span>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
                  <b className="block text-lg font-bold">Full Service</b>
                  <span className="text-[11px] font-mono-tabular uppercase tracking-wider text-emerald-100">
                    Delivery &amp; Setup
                  </span>
                </div>
              </div>

              <div className="pt-1 flex flex-wrap items-center gap-3">
                <Link
                  to="/about"
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-600 via-fuchsia-600 to-blue-600 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Learn More &amp; Read FAQ
                </Link>
                <Link
                  to="/contact"
                  className="px-5 py-2.5 rounded-full bg-white border border-purple-300 hover:border-purple-500 text-purple-900 text-xs font-bold transition-colors"
                >
                  Contact Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION F — Contact CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#1A0B2E] via-[#0F1738] to-[#0A2239] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2
            className="text-2xl sm:text-4xl font-bold tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            Let&apos;s Bring Your <span className="led-text-gradient">Event to Life</span>
          </h2>
          <p className="text-base sm:text-lg text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            Tell us about your event, venue, date, and equipment requirements. Contact LIVEON CONNECT to discuss a suitable AV setup.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-slate-950 text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0 shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>

            <Link
              to="/catalogue"
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-fuchsia-600 to-blue-600 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0 shadow-lg"
            >
              <span>Browse Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`tel:${siteConfig.phoneDial}`}
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0 shadow-lg"
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
