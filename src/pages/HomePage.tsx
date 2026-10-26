import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MessageCircle,
  Phone,
  Check,
  CheckCircle2,
  ShieldCheck,
  Sliders,
  Truck,
  Headphones,
  Layers,
  Volume2,
  VolumeX,
  Speaker,
  Lightbulb,
  Monitor,
  Tv,
  Projector,
  Star,
  Video,
} from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import { ProductCard } from '../components/ProductCard';
import { EquipmentImage } from '../components/EquipmentImage';

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
    number: 'Step 01',
    title: 'Share Your Event Details',
    description:
      'Select your event date, venue location, event format, and expected audience size so we can evaluate technical requirements.',
    barHeight: 'h-20',
    barColor: 'bg-[#6854fc]',
  },
  {
    number: 'Step 02',
    title: 'Choose the Right Equipment',
    description:
      'Browse our equipment catalogue across 9 categories and add speakers, LED walls, lighting, and accessories to your quote cart.',
    barHeight: 'h-28',
    barColor: 'bg-[#ec792b]',
  },
  {
    number: 'Step 03',
    title: 'Confirm Your Rental Quote',
    description:
      'Submit your equipment list via WhatsApp. LIVEON CONNECT will verify date availability, transportation, setup needs, and confirm final pricing.',
    barHeight: 'h-24',
    barColor: 'bg-[#38bdf8]',
  },
  {
    number: 'Step 04',
    title: 'Coordinate Delivery, Setup and Collection',
    description:
      'Once confirmed by our team, equipment is scheduled for venue delivery, technical installation, and post-show pickup.',
    barHeight: 'h-32',
    barColor: 'bg-[#d946ef]',
  },
];

export const HomePage: React.FC = () => {
  const {
    products,
    siteSettings,
    mediaItems,
    eventCategories,
    highlightStories,
  } = useQuote();

  const featuredmarked = products.filter((p) => p.featured);
  const featuredProducts =
    featuredmarked.length >= 4 ? featuredmarked.slice(0, 8) : products.slice(0, 8);

  const heroVideos = mediaItems.filter((m) => m.mediaType === 'hero_video');
  const productionVideos = mediaItems.filter((m) => m.mediaType === 'production_video');
  const fieldPhotos = mediaItems.filter((m) => m.mediaType === 'field_photo');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const currentVideo = heroVideos[activeVideoIndex] || heroVideos[0];
  const currentStory = highlightStories[activeStoryIndex] || highlightStories[0];

  const kpiCards = [
    {
      metric: `${products.length}+`,
      description: 'Complete sound, lighting, LED wall & AV equipment packages in our catalogue',
      icon: Speaker,
    },
    {
      metric: '9',
      description: 'Specialized AV rental categories for corporate, wedding & concert stages',
      icon: Star,
    },
    {
      metric: '100%',
      description: 'Quality-checked equipment organized in road-ready flight cases before dispatch',
      icon: ShieldCheck,
    },
    {
      metric: '4 Steps',
      description: 'Streamlined WhatsApp quote, venue delivery, technical setup & post-show collection',
      icon: Truck,
    },
  ];

  const toggleSound = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
    if (!vid.muted && vid.paused) {
      vid.play().catch(() => {});
    }
  };

  const handleSelectVideo = (idx: number) => {
    setActiveVideoIndex(idx);
    setIsMuted(true);
  };

  const whatsappUrl = `https://wa.me/${siteSettings.whatsappNumber}?text=${encodeURIComponent(
    `Hello ${siteSettings.businessName}, I would like to enquire about audio-visual equipment rentals for an upcoming event.`
  )}`;
  const dialPhone = siteSettings.phone.replace(/[^0-9+]/g, '');

  return (
    <div className="overflow-x-hidden bg-[#060216] text-white">
      {/* =====================================================================
          1. HERO SECTION — Controlled dynamically via Admin Panel
         ===================================================================== */}
      <section className="relative overflow-hidden intellio-hero-beams pt-14 pb-20 sm:pt-20 sm:pb-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div>
              <span className="intellio-pill-badge">{siteSettings.heroBadge}</span>
            </div>

            <h1
              className="font-display text-4xl sm:text-6xl lg:text-[4.25rem] font-bold tracking-tight text-white leading-[1.06]"
              style={{ textWrap: 'balance' }}
            >
              {siteSettings.heroTitle}{' '}
              <span className="text-[#6854fc]">{siteSettings.heroAccent}</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {siteSettings.heroSubtitle}
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/catalogue"
                className="w-full sm:w-auto px-9 py-4 intellio-outline-btn text-base sm:text-lg flex items-center justify-center gap-3 whitespace-nowrap"
              >
                <span>Browse the Catalogue</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 intellio-solid-btn text-base sm:text-lg flex items-center justify-center gap-2.5 whitespace-nowrap"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp {siteSettings.phone}</span>
              </a>
            </div>
          </div>

          {/* Framed Intellio Showcase Cards Below Hero */}
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Live Event Video Showcase Card with Multi-Video Switcher */}
            {currentVideo && (
              <div className="lg:col-span-8 rounded-[28px] border-2 border-[#6854fc]/45 bg-[#0a0422] p-3.5 sm:p-5 shadow-[0_25px_70px_-15px_rgba(104,84,252,0.35)] flex flex-col justify-between gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2 px-2">
                  <div>
                    <span className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#8c7bff] block">
                      {currentVideo.categoryOrTag}
                    </span>
                    <span className="font-display text-lg sm:text-xl font-bold text-white">
                      {currentVideo.title}
                    </span>
                  </div>

                  {/* Switch between Hero Video Reels */}
                  <div className="flex flex-wrap items-center gap-2">
                    {heroVideos.map((vid, idx) => (
                      <button
                        key={vid.id}
                        type="button"
                        onClick={() => handleSelectVideo(idx)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-display font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                          activeVideoIndex === idx
                            ? 'bg-[#6854fc] text-white shadow-[0_0_16px_rgba(104,84,252,0.6)]'
                            : 'bg-white/5 text-slate-300 border border-[#6854fc]/35 hover:text-white'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Live Reel 0{idx + 1}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative rounded-[20px] overflow-hidden bg-[#060216] aspect-video border border-[#6854fc]/35">
                  <video
                    key={currentVideo.src}
                    ref={videoRef}
                    src={currentVideo.src}
                    poster={currentVideo.poster}
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    preload="metadata"
                    className="block w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={toggleSound}
                    className="absolute right-3.5 bottom-3.5 inline-flex items-center gap-2 rounded-full px-4 py-2 bg-[#08031d]/90 hover:bg-[#6854fc] border border-[#6854fc]/60 text-white text-xs font-bold backdrop-blur-md transition-colors cursor-pointer"
                    aria-label={isMuted ? 'Unmute video sound' : 'Mute video sound'}
                  >
                    {isMuted ? (
                      <>
                        <VolumeX className="w-4 h-4 text-[#8c7bff]" />
                        <span>Tap for sound</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-white" />
                        <span>Sound on</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Solid Periwinkle Purple Feature Card with Concentric Rings */}
            <div className="lg:col-span-4 rounded-[28px] border-2 border-[#6854fc]/45 bg-[#0a0422] p-3.5 sm:p-5 flex flex-col">
              <div className="relative flex-1 rounded-[22px] bg-[#6854fc] overflow-hidden p-6 flex flex-col justify-between min-h-[320px]">
                <div
                  className="pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full border border-white/20"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full border border-white/15"
                  aria-hidden="true"
                />

                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white text-[#6854fc] flex items-center justify-center shadow-md shrink-0">
                    <Sliders className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="font-display text-3xl font-bold text-white leading-none">
                      {products.length} Products
                    </div>
                    <div className="text-sm font-medium text-white/90 mt-1">
                      {siteSettings.businessName} Rig
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-5 space-y-2">
                  <div className="rounded-2xl overflow-hidden border border-white/25 shadow-lg">
                    <EquipmentImage
                      src={fieldPhotos[0]?.src || '/assets/aistudio/IMG-20261025-WA0039_851e9d5d.jpg'}
                      alt="LIVEON CONNECT FOH Control & Stage LED Wall"
                      className="w-full h-44 object-cover"
                    />
                  </div>
                  <p className="text-xs text-white/90 font-medium">
                    On-Site LED Wall, OBS Live Streaming &amp; Stage Lighting Control
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. KPI METRIC CARDS SECTION
         ===================================================================== */}
      <section className="py-12 sm:py-16 bg-[#060216]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={card.metric}
                  className="intellio-card intellio-card-hover rounded-[28px] p-7 sm:p-8 flex flex-col justify-between min-h-[210px]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-display text-5xl sm:text-6xl font-bold text-white tracking-tight">
                      {card.metric}
                    </span>
                    <div className="w-14 h-14 rounded-full border border-[#6854fc]/55 bg-[#6854fc]/10 flex items-center justify-center text-[#7c6aff] shrink-0">
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mt-6">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. GLOWING BEAM BANNER & EVENT CATEGORIES
         ===================================================================== */}
      <section className="py-16 sm:py-24 relative overflow-hidden" id="events">
        <div className="relative py-6 mb-12 border-y border-[#6854fc]/35 bg-gradient-to-r from-[#180c4a] via-[#5842f4] to-[#180c4a] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-8 overflow-x-auto whitespace-nowrap">
            <span className="font-display text-3xl sm:text-5xl font-bold tracking-wider text-white/40 uppercase">
              LED WALLS &amp; SOUND
            </span>
            <span className="font-display text-3xl sm:text-5xl font-bold tracking-wider text-white uppercase">
              {siteSettings.businessName}
            </span>
            <span className="font-display text-3xl sm:text-5xl font-bold tracking-wider text-white/40 uppercase">
              LIVE STREAMING
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <div>
              <span className="intellio-pill-badge">Built for Every Occasion</span>
            </div>
            <h2
              className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight"
              style={{ textWrap: 'balance' }}
            >
              One Partner for Every Audio-Visual Need
            </h2>
            <p className="text-base text-slate-300">
              Select an event category below to explore tailored combinations of sound systems, stage lighting, live streaming switchers, and modular LED walls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventCategories.map((eventCat) => (
              <Link
                key={eventCat.id}
                to={eventCat.link}
                className="group intellio-card intellio-card-hover rounded-[28px] p-6 sm:p-7 flex flex-col justify-between gap-5"
              >
                <div className="space-y-2">
                  <span className="font-mono-tabular text-xs font-semibold text-[#8c7bff]">
                    {eventCat.eyebrow}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-[#8c7bff] transition-colors">
                    {eventCat.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {eventCat.description}
                  </p>
                </div>

                <div className="relative rounded-[20px] overflow-hidden aspect-[16/9] border border-[#6854fc]/40 bg-[#060216]">
                  <img
                    src={eventCat.image}
                    alt={eventCat.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060216]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 right-3 px-4 py-1.5 rounded-full bg-[#6854fc] text-white text-xs font-display font-bold flex items-center gap-1.5">
                    <span>Explore Gear</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. FEATURED EQUIPMENT CATALOGUE
         ===================================================================== */}
      <section className="py-16 sm:py-24 bg-[#07021a] border-t border-[#6854fc]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <div>
              <span className="intellio-pill-badge">Rental Catalogue Highlights</span>
            </div>
            <h2
              className="font-display text-3xl sm:text-5xl font-bold text-white"
              style={{ textWrap: 'balance' }}
            >
              Find the Right Gear for <span className="text-[#6854fc]">Your Event</span>
            </h2>
            <p className="text-base text-slate-300">
              Explore professional sound, lighting, LED walls, displays, projection, and AV equipment for your next event.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 max-w-xl mx-auto">
            <Link
              to="/catalogue"
              className="w-full py-4 px-8 intellio-solid-btn text-xl flex items-center justify-center gap-3"
            >
              <span>View Full Catalogue (All {products.length} Products)</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. REAL EVENT PRODUCTIONS & FIELD GALLERY — Dynamic Videos & Photos
         ===================================================================== */}
      <section className="py-16 sm:py-24 bg-[#060216] border-t border-[#6854fc]/20" id="productions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <div>
              <span className="intellio-pill-badge">Live Production Portfolio</span>
            </div>
            <h2
              className="font-display text-3xl sm:text-5xl font-bold text-white"
              style={{ textWrap: 'balance' }}
            >
              On-Site LED Walls, Live Streaming &amp; Stage Setups by{' '}
              <span className="text-[#6854fc]">{siteSettings.businessName}</span>
            </h2>
            <p className="text-base text-slate-300">
              Real field installations from auditoriums, wedding receptions, concerts, and multi-camera broadcast control desks across Kerala.
            </p>
          </div>

          {/* Live Production Video Reels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
            {productionVideos.map((vid) => (
              <div
                key={vid.id}
                className={`${vid.span} intellio-card intellio-card-hover rounded-[28px] p-4 sm:p-5 flex flex-col justify-between gap-3`}
              >
                <div className="flex items-start justify-between gap-2 px-1">
                  <div>
                    <span className="text-xs font-mono-tabular text-[#8c7bff] font-semibold block">
                      {vid.categoryOrTag}
                    </span>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug">
                      {vid.title}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#6854fc]/20 border border-[#6854fc]/50 text-[11px] font-semibold text-white shrink-0">
                    Live Video
                  </span>
                </div>
                <div className="rounded-[20px] overflow-hidden border border-[#6854fc]/35 bg-[#050112] aspect-video">
                  <video
                    src={vid.src}
                    poster={vid.poster}
                    controls
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-slate-300 px-1 leading-relaxed">
                  {vid.caption}
                </p>
              </div>
            ))}
          </div>

          {/* Real Field Photos Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {fieldPhotos.map((item) => (
              <div
                key={item.id}
                className={`${item.span} group intellio-card intellio-card-hover rounded-[28px] p-4 sm:p-5 flex flex-col justify-between gap-4`}
              >
                <div className="relative rounded-[20px] overflow-hidden aspect-[16/10] border border-[#6854fc]/35 bg-[#050112]">
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-3.5 py-1 rounded-full bg-[#08031d]/90 border border-[#6854fc]/60 text-[11px] font-mono-tabular font-semibold text-[#a594ff] backdrop-blur-md">
                    {item.categoryOrTag}
                  </div>
                </div>
                <div className="px-1 space-y-1">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. CONCENTRIC ORBIT RINGS & AV CAPABILITIES
         ===================================================================== */}
      <section className="py-16 sm:py-24 bg-[#07021a] border-t border-[#6854fc]/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative flex flex-col items-center justify-center py-6">
              <div
                className="w-44 h-2.5 rounded-full bg-[#7c6aff] shadow-[0_14px_55px_16px_rgba(104,84,252,0.85)] mb-6"
                aria-hidden="true"
              />

              <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
                <div className="absolute inset-2 rounded-full border border-[#6854fc]/35 bg-[radial-gradient(circle_at_50%_20%,rgba(104,84,252,0.22),transparent_70%)]" />
                <div className="absolute inset-14 rounded-full border border-[#6854fc]/45 bg-[radial-gradient(circle_at_50%_50%,rgba(104,84,252,0.18),transparent_75%)]" />
                <div className="relative z-10 w-24 h-24 rounded-full border-2 border-[#6854fc] bg-[#0b0426] shadow-[0_0_40px_rgba(104,84,252,0.6)] flex items-center justify-center p-3">
                  <div className="bg-white p-2 rounded-xl">
                    <img
                      src={siteSettings.logoPath}
                      alt={siteSettings.businessName}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>

                <Link
                  to="/catalogue?category=Sound%20Systems"
                  title="Sound Systems"
                  className="absolute top-3 left-10 w-16 h-16 rounded-full border border-dashed border-[#6854fc] bg-[#0b0426] hover:bg-[#6854fc] text-[#8c7bff] hover:text-white flex items-center justify-center shadow-[0_0_25px_rgba(104,84,252,0.45)] transition-colors"
                >
                  <Speaker className="w-7 h-7" />
                </Link>
                <Link
                  to="/catalogue?category=Lighting"
                  title="Stage Lighting"
                  className="absolute top-3 right-10 w-16 h-16 rounded-full border border-[#6854fc]/60 bg-[#0b0426] hover:bg-[#6854fc] text-amber-400 hover:text-white flex items-center justify-center shadow-[0_0_25px_rgba(104,84,252,0.35)] transition-colors"
                >
                  <Lightbulb className="w-7 h-7" />
                </Link>
                <Link
                  to="/catalogue?category=LED%20Walls"
                  title="LED Walls"
                  className="absolute top-1/2 -translate-y-1/2 left-0 w-16 h-16 rounded-full border border-[#6854fc]/60 bg-[#0b0426] hover:bg-[#6854fc] text-rose-400 hover:text-white flex items-center justify-center shadow-[0_0_25px_rgba(104,84,252,0.35)] transition-colors"
                >
                  <Monitor className="w-7 h-7" />
                </Link>
                <Link
                  to="/catalogue?category=TVs%20%26%20Displays"
                  title="TVs & Displays"
                  className="absolute top-1/2 -translate-y-1/2 right-0 w-16 h-16 rounded-full border border-[#6854fc]/60 bg-[#0b0426] hover:bg-[#6854fc] text-cyan-400 hover:text-white flex items-center justify-center shadow-[0_0_25px_rgba(104,84,252,0.35)] transition-colors"
                >
                  <Tv className="w-7 h-7" />
                </Link>
                <Link
                  to="/catalogue?category=Projectors"
                  title="Projectors"
                  className="absolute bottom-4 left-12 w-16 h-16 rounded-full border border-[#6854fc]/60 bg-[#0b0426] hover:bg-[#6854fc] text-emerald-400 hover:text-white flex items-center justify-center shadow-[0_0_25px_rgba(104,84,252,0.35)] transition-colors"
                >
                  <Projector className="w-7 h-7" />
                </Link>
                <Link
                  to="/catalogue?category=Mixers%20%26%20Mics"
                  title="Mixers & Mics"
                  className="absolute bottom-4 right-12 w-16 h-16 rounded-full border border-[#6854fc]/60 bg-[#0b0426] hover:bg-[#6854fc] text-fuchsia-400 hover:text-white flex items-center justify-center shadow-[0_0_25px_rgba(104,84,252,0.35)] transition-colors"
                >
                  <Sliders className="w-7 h-7" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="intellio-pill-badge">Complete AV Ecosystem</span>
              </div>

              <h2
                className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight"
                style={{ textWrap: 'balance' }}
              >
                Foundation for High Performance Event Production
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                {siteSettings.businessName} brings together 9 specialized equipment categories—from 500W portable speakers and P2 fine-pitch LED walls to JBL VRX &amp; RCF 9007-AS line arrays, Avolites consoles, and CPCB IV+ diesel genset power.
              </p>

              <ul className="space-y-3.5 pt-1">
                <li className="flex items-center gap-3 text-base sm:text-lg text-slate-100">
                  <Check className="w-5 h-5 text-[#6854fc] stroke-[3] shrink-0" />
                  <span>Daily, Square-Foot (P2 LED), and 5-Hour (Genset) Rental Options</span>
                </li>
                <li className="flex items-center gap-3 text-base sm:text-lg text-slate-100">
                  <Check className="w-5 h-5 text-[#6854fc] stroke-[3] shrink-0" />
                  <span>Direct WhatsApp Quote Builder with Instant Estimate</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  to="/catalogue"
                  className="inline-flex items-center gap-3 px-9 py-4 intellio-solid-btn text-lg"
                >
                  <span>Explore More</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. WHY CHOOSE US & 2x2 BENTO GRID
         ===================================================================== */}
      <section className="py-16 sm:py-24 bg-[#060216] border-t border-[#6854fc]/20" id="why">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="intellio-pill-badge">Why Choose Us</span>
              </div>

              <h2
                className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight"
                style={{ textWrap: 'balance' }}
              >
                All in One Partner For Modern Event Technology and Premium AV Gear
              </h2>

              <p className="text-base text-slate-300 leading-relaxed">
                Every unit is organised, tagged, and quality-checked in road-ready flight cases before dispatch to your venue across Kottayam and Kerala.
              </p>

              <div className="space-y-4 pt-2 border-b border-white/10 pb-6">
                {WHY_CHOOSE_FEATURES.slice(0, 3).map((feat) => {
                  const IconComp = feat.icon;
                  return (
                    <div key={feat.title} className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl border border-[#6854fc]/50 bg-[#6854fc]/15 text-[#7c6aff] flex items-center justify-center shrink-0 mt-0.5">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-white">
                          {feat.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                          {feat.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-1">
                <Link
                  to="/quote"
                  className="inline-flex items-center gap-3 px-9 py-4 intellio-solid-btn text-lg"
                >
                  <span>Build Rental Quote</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-[28px] border border-[#6854fc]/50 bg-[#0b0524] p-4 sm:p-6 shadow-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-[22px] p-5 bg-gradient-to-br from-[#99f6e4] via-[#e0f2fe] to-[#ddd6fe] text-slate-900 flex flex-col justify-between min-h-[215px]">
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-semibold text-slate-800 leading-snug">
                        Quality-Checked
                        <br />
                        AV Inventory
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center text-slate-800 shadow-xs">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <div className="font-display text-5xl font-bold text-slate-950">
                        100%
                      </div>
                      <div className="text-xs font-medium text-slate-700 mt-0.5">
                        Tested Prior to Dispatch
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[22px] p-5 bg-[#6854fc] text-white flex flex-col justify-between min-h-[215px] relative overflow-hidden">
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-white text-[#6854fc] flex items-center justify-center shrink-0">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-display text-2xl font-bold leading-none">
                          9 Categories
                        </div>
                        <div className="text-xs text-white/90 mt-0.5">
                          Live Stream &amp; AV Rigs
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 rounded-xl overflow-hidden border border-white/25 relative z-10">
                      <EquipmentImage
                        src="/assets/aistudio/IMG-20261025-WA0021_07860ad8.jpg"
                        alt="YoloLiv Multi-HDMI Live Streaming & Audio Mixing Rig"
                        className="w-full h-28 object-cover"
                      />
                    </div>
                  </div>

                  <div className="rounded-[22px] p-6 bg-[#130b36] border border-[#6854fc]/35 flex flex-col items-center justify-center text-center min-h-[215px]">
                    <div className="w-14 h-14 rounded-full bg-[#6854fc] text-white flex items-center justify-center shadow-[0_0_30px_rgba(104,84,252,0.75)] mb-4">
                      <Check className="w-7 h-7 stroke-[3]" />
                    </div>
                    <div className="font-display text-2xl font-bold text-white">
                      Confirmed Setup
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Venue Delivery, Setup &amp; Pickup
                    </p>
                  </div>

                  <div className="rounded-[22px] p-5 bg-gradient-to-br from-[#e0e7ff] via-[#f3e8ff] to-[#fce7f3] text-slate-900 flex flex-col justify-between min-h-[215px]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        4-Step Rental Flow
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white/80 text-[10px] font-semibold text-slate-700">
                        WhatsApp
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">+{products.length} Items</div>
                    <div className="flex items-end justify-between gap-2 pt-2 px-1">
                      {HOW_IT_WORKS_STEPS.map((st, idx) => (
                        <div key={st.number} className="flex flex-col items-center gap-1.5 flex-1">
                          <div className={`w-full rounded-t-full ${st.barHeight} ${st.barColor}`} />
                          <span className="text-[10px] font-mono-tabular font-bold text-slate-700">
                            0{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div
                key={step.number}
                className="intellio-card rounded-[24px] p-6 space-y-2"
              >
                <span className="font-mono-tabular text-xs font-bold text-[#8c7bff]">
                  {step.number}
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          8. CURVED HORIZON ARC & ABOUT / TESTIMONIAL CARD
         ===================================================================== */}
      {currentStory && (
        <section className="py-16 sm:py-24 bg-[#060216] relative overflow-hidden" id="about">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative pt-14 text-center space-y-4 mb-12">
              <div
                className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[340px] sm:w-[540px] h-44 rounded-t-full border-t-[3px] border-[#6854fc] shadow-[0_-18px_45px_rgba(104,84,252,0.35)]"
                aria-hidden="true"
              />
              <div className="relative z-10">
                <span className="intellio-pill-badge">About {siteSettings.businessName}</span>
              </div>
              <h2
                className="relative z-10 font-display text-3xl sm:text-5xl font-bold text-white"
                style={{ textWrap: 'balance' }}
              >
                Your AV Partner for Memorable Events Across Kerala
              </h2>
            </div>

            <div className="intellio-card rounded-[32px] p-7 sm:p-12 space-y-6">
              <div className="font-display text-7xl sm:text-8xl font-bold text-[#6854fc] leading-none select-none">
                &ldquo;
              </div>

              <p className="text-lg sm:text-2xl text-slate-100 leading-relaxed font-medium">
                &ldquo;{currentStory.quote}&rdquo;
              </p>

              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-5 h-5 fill-amber-400" />
                <Star className="w-5 h-5 fill-amber-400" />
                <Star className="w-5 h-5 fill-amber-400" />
                <Star className="w-5 h-5 fill-amber-400" />
                <Star className="w-5 h-5 fill-amber-400" />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-[#6854fc] overflow-hidden shrink-0 bg-[#08031d]">
                    <img
                      src={currentStory.photo}
                      alt={currentStory.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold text-white">
                      {currentStory.author}
                    </div>
                    <div className="text-sm text-slate-300">{currentStory.role}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/about"
                    className="px-6 py-3 intellio-outline-btn text-sm whitespace-nowrap"
                  >
                    Read Full FAQ →
                  </Link>
                  <a
                    href={`tel:${dialPhone}`}
                    className="px-6 py-3 intellio-solid-btn text-sm flex items-center gap-2 whitespace-nowrap"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call {siteSettings.phone}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              {highlightStories.map((story, index) => (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => setActiveStoryIndex(index)}
                  aria-label={`Show highlight ${index + 1}`}
                  className={`w-4 h-4 rounded-full border border-[#6854fc] transition-colors cursor-pointer ${
                    activeStoryIndex === index ? 'bg-[#6854fc]' : 'bg-transparent hover:bg-[#6854fc]/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
