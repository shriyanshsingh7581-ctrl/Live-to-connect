export interface SiteSettingsData {
  businessName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  addressFull: string;
  instagramUrl: string;
  logoPath: string;
  heroBadge: string;
  heroTitle: string;
  heroAccent: string;
  heroSubtitle: string;
}

export interface CmsMediaItem {
  id: string;
  mediaType: 'hero_video' | 'production_video' | 'field_photo';
  title: string;
  categoryOrTag: string;
  caption: string;
  src: string;
  poster: string;
  span: string;
  sortOrder: number;
}

export interface CmsEventCategory {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface CmsHighlightStory {
  id: string;
  quote: string;
  author: string;
  role: string;
  photo: string;
}

export interface CmsFaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface CmsQuoteEnquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventType: string;
  eventDate: string;
  venue: string;
  equipmentSummary: string;
  estimatedTotal: string;
  status: 'new' | 'contacted' | 'confirmed' | 'archived';
  createdBy: string;
  createdAtIso: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  businessName: 'LIVEON CONNECT',
  tagline: 'LED WALL, LIVE STREAMING, SOUND COMPANY',
  phone: '+91 8590952476',
  whatsappNumber: '918590952476',
  email: 'Liveonconnect@gmail.com',
  addressFull: 'Manimala, Kottayam, Kerala – 686543, India',
  instagramUrl: 'https://www.instagram.com/liveonconnect?dlrf=MWZmZWphZndxcWN1Yw==',
  logoPath: '/images/liveon-connect-logo.png',
  heroBadge: 'Audio · Lighting · LED · AV Rentals — Kerala',
  heroTitle: 'Complete Audio-Visual Solutions for Events of',
  heroAccent: 'Every Scale',
  heroSubtitle:
    'Sound systems, stage lighting, trussing, LED walls, live streaming, projection and displays from one partner. Delivered to your venue, set up, and picked up after the show.',
};

export const DEFAULT_MEDIA_ITEMS: CmsMediaItem[] = [
  // Hero Videos (4)
  {
    id: 'hero-auditorium-stream',
    mediaType: 'hero_video',
    title: 'Auditorium LED Wall, Line-Array & OBS Live Stream',
    categoryOrTag: 'Live Streaming + Stage Rig',
    caption: 'Live auditorium broadcast setup with OBS Studio, line-array PA, and moving heads.',
    src: '/assets/aistudio/VID-20261025-WA0042_707f40a7.mp4',
    poster: '/assets/aistudio/IMG-20261025-WA0037_70b34a7b.jpg',
    span: 'col-span-12',
    sortOrder: 1,
  },
  {
    id: 'hero-wedding-led-wall',
    mediaType: 'hero_video',
    title: 'Grand Wedding Reception Stage P2/P3 LED Wall',
    categoryOrTag: 'Wedding Stage LED Wall',
    caption: 'Seamless high-brightness wedding reception LED video wall installation.',
    src: '/assets/aistudio/VID-20261025-WA0044_a553324a.mp4',
    poster: '/assets/aistudio/IMG-20261025-WA0040_6d732744.jpg',
    span: 'col-span-12',
    sortOrder: 2,
  },
  {
    id: 'hero-cultural-dance-led',
    mediaType: 'hero_video',
    title: 'Cultural Dance Stage LED Backdrop & OBS Live Switching',
    categoryOrTag: 'Cultural Show + OBS Control',
    caption: 'Classical dance performance on stage with live OBS Studio LED wall graphics switching.',
    src: '/assets/aistudio/VID-20261025-WA0074_299cd498.mp4',
    poster: '/assets/aistudio/IMG-20261025-WA0039_851e9d5d.jpg',
    span: 'col-span-12',
    sortOrder: 3,
  },
  {
    id: 'hero-indoor-court-concert',
    mediaType: 'hero_video',
    title: 'Indoor Arena Concert — Moving Beams, NovaStar VX1 & PA Rig',
    categoryOrTag: 'Concert Lighting + Sound',
    caption: 'High-energy indoor arena show with moving beam lights, NovaStar VX1 rack, and line-array sound.',
    src: '/assets/aistudio/VID-20261025-WA0071_2406a325.mp4',
    poster: '/assets/aistudio/IMG-20261025-WA0043_7db4c382.jpg',
    span: 'col-span-12',
    sortOrder: 4,
  },

  // Live Production Portfolio Videos (7)
  {
    id: 'prod-vid-01',
    mediaType: 'production_video',
    categoryOrTag: '01. Live Auditorium Broadcast',
    title: 'OBS Live Stream, Line-Array PA & Moving Heads',
    caption:
      'Full auditorium stage rig with flown line-array speakers, 4-head beam lighting bar, and live camera broadcast.',
    src: '/assets/aistudio/VID-20261025-WA0042_707f40a7.mp4',
    poster: '/assets/aistudio/IMG-20261025-WA0037_70b34a7b.jpg',
    span: 'md:col-span-6',
    sortOrder: 1,
  },
  {
    id: 'prod-vid-02',
    mediaType: 'production_video',
    categoryOrTag: '02. Wedding Stage LED Wall',
    title: 'Grand Reception High-Brightness Stage LED Wall',
    caption:
      'Seamless large-format wedding reception LED backdrop delivering vibrant colors alongside floral stage decor.',
    src: '/assets/aistudio/VID-20261025-WA0044_a553324a.mp4',
    poster: '/assets/aistudio/IMG-20261025-WA0040_6d732744.jpg',
    span: 'md:col-span-6',
    sortOrder: 2,
  },
  {
    id: 'prod-vid-03',
    mediaType: 'production_video',
    categoryOrTag: '03. Classical Dance & Stage Visuals',
    title: 'Stage Dance Performance with Live OBS LED Wall Switching',
    caption:
      'Real-time visual backdrop control from our FOH laptop desk during a classical stage dance performance.',
    src: '/assets/aistudio/VID-20261025-WA0074_299cd498.mp4',
    poster: '/assets/aistudio/IMG-20261025-WA0039_851e9d5d.jpg',
    span: 'md:col-span-4',
    sortOrder: 3,
  },
  {
    id: 'prod-vid-04',
    mediaType: 'production_video',
    categoryOrTag: '04. Graduation Ceremony Broadcast',
    title: 'Dual-Laptop OBS Studio Multi-Scene Auditorium Stream',
    caption:
      'Pope John Paul II Indoor Court Graduation Ceremony 2026 with dual-laptop OBS control and stage LED screen.',
    src: '/assets/aistudio/VID-20261025-WA0073_b2b97e51.mp4',
    poster: '/assets/aistudio/IMG-20261025-WA0043_7db4c382.jpg',
    span: 'md:col-span-4',
    sortOrder: 4,
  },
  {
    id: 'prod-vid-05',
    mediaType: 'production_video',
    categoryOrTag: '05. Indoor Arena Concert Rig',
    title: 'NovaStar VX1 Rack, Moving Beam Lights & Column Line-Array',
    caption:
      'High-energy arena production featuring synchronized overhead beam lighting, FOH control desk, and PA sound.',
    src: '/assets/aistudio/VID-20261025-WA0071_2406a325.mp4',
    poster: '/assets/aistudio/IMG-20261025-WA0037_70b34a7b.jpg',
    span: 'md:col-span-4',
    sortOrder: 5,
  },
  {
    id: 'prod-vid-06',
    mediaType: 'production_video',
    categoryOrTag: '06. Live DJ & Crowd Show',
    title: 'Concert Crowd Energy, FOH Sound Engineer & Stage Lighting',
    caption:
      'Live FOH sound & lighting operation with Hollyland monitoring and dynamic beam washes across the crowd.',
    src: '/assets/aistudio/VID-20261025-WA0072_2e6371a0.mp4',
    poster: '/assets/aistudio/IMG-20261025-WA0032_fbbc607c.jpg',
    span: 'md:col-span-6',
    sortOrder: 6,
  },
  {
    id: 'prod-vid-07',
    mediaType: 'production_video',
    categoryOrTag: '07. Wedding Hall Multi-Cam & LED Setup',
    title: 'Auditorium Wedding Mandap, Vertical LED Banner & Camera Rig',
    caption:
      'Complete wedding hall AV coverage with stage lighting, broadcast camera tripod setup, and LED display.',
    src: '/assets/aistudio/VID-20261025-WA0070_2d045f3a.mp4',
    poster: '/assets/aistudio/IMG-20261025-WA0068_830a56a3.jpg',
    span: 'md:col-span-6',
    sortOrder: 7,
  },

  // Field Production Gallery Photos (13)
  {
    id: 'photo-wa0039',
    mediaType: 'field_photo',
    src: '/assets/aistudio/IMG-20261025-WA0039_851e9d5d.jpg',
    poster: '',
    categoryOrTag: 'FOH Control & LED Wall',
    title: 'LIVEON CONNECT Production Desk & Stage LED Wall',
    caption:
      'On-site OBS Studio live switching, stage LED wall graphics, and road-ready LIVEON CONNECT flight cases.',
    span: 'lg:col-span-7',
    sortOrder: 1,
  },
  {
    id: 'photo-wa0065',
    mediaType: 'field_photo',
    src: '/assets/aistudio/IMG-20261025-WA0065_f92ae4c4.jpg',
    poster: '',
    categoryOrTag: 'Outdoor LED Wall Mega Show',
    title: 'Outdoor Stage LED Wall, PA Sound Stacks & Truss Lighting',
    caption:
      'High-brightness outdoor festival LED wall installation with full-range PA speaker stacks and warm stage flood lighting.',
    span: 'lg:col-span-5',
    sortOrder: 2,
  },
  {
    id: 'photo-wa0068',
    mediaType: 'field_photo',
    src: '/assets/aistudio/IMG-20261025-WA0068_830a56a3.jpg',
    poster: '',
    categoryOrTag: 'Wedding FOH & NovaStar Rack',
    title: 'Wedding Reception NovaStar VX1, OBS Control & Mandap LED Wall',
    caption:
      'Complete front-of-house control desk featuring NovaStar VX1 LED processor rack, OBS live camera switching, PA speakers, and stage LED screen.',
    span: 'lg:col-span-6',
    sortOrder: 3,
  },
  {
    id: 'photo-wa0069',
    mediaType: 'field_photo',
    src: '/assets/aistudio/IMG-20261025-WA0069_b0d21777.jpg',
    poster: '',
    categoryOrTag: 'Live Ceremony Projection',
    title: 'Traditional Kerala Wedding Procession on Grand Stage LED Wall',
    caption:
      'Real-time multi-camera wedding coverage projected onto a crystal-clear indoor LED wall right beside the floral wedding stage.',
    span: 'lg:col-span-6',
    sortOrder: 4,
  },
  {
    id: 'photo-wa0027',
    mediaType: 'field_photo',
    src: '/assets/aistudio/IMG-20261025-WA0027_d40569c7.jpg',
    poster: '',
    categoryOrTag: 'Multi-Cam & Wireless RF',
    title: 'Sony Broadcast Camera & 8-Channel Wireless Rack',
    caption:
      'Professional Sachtler tripod camera rig integrated with multi-channel wireless audio receivers and multiview monitor.',
    span: 'lg:col-span-4',
    sortOrder: 5,
  },
  {
    id: 'photo-wa0023',
    mediaType: 'field_photo',
    src: '/assets/aistudio/IMG-20261025-WA0023_0e200ba8.jpg',
    poster: '',
    categoryOrTag: 'Broadcast Switching',
    title: 'ATEM Video Switcher & Dual Hollyland Multiview',
    caption:
      'Dedicated multi-camera live switching console with real-time program/preview monitoring and recording.',
    span: 'lg:col-span-4',
    sortOrder: 6,
  },
  {
    id: 'photo-wa0021',
    mediaType: 'field_photo',
    src: '/assets/aistudio/IMG-20261025-WA0021_07860ad8.jpg',
    poster: '',
    categoryOrTag: 'Live Streaming Rig',
    title: 'YoloLiv Multi-HDMI Encoder & Audio Mixing',
    caption:
      'Portable multi-input HDMI encoder, tactile stream deck macro controller, and laptop audio mixing workstation.',
    span: 'lg:col-span-4',
    sortOrder: 7,
  },
  {
    id: 'photo-wa0040',
    mediaType: 'field_photo',
    src: '/assets/aistudio/IMG-20261025-WA0040_6d732744.jpg',
    poster: '',
    categoryOrTag: 'Wedding Reception LED Wall',
    title: 'Grand Wedding Stage & Live LED Video Wall',
    caption:
      'Seamless large-format LED video wall installed alongside floral wedding mandap stages for live ceremony projection.',
    span: 'lg:col-span-6',
    sortOrder: 8,
  },
  {
    id: 'photo-wa0032',
    mediaType: 'field_photo',
    src: '/assets/aistudio/IMG-20261025-WA0032_fbbc607c.jpg',
    poster: '',
    categoryOrTag: 'Musical & Cultural Concerts',
    title: 'Live Concert Stage LED Wall & Microphone Array',
    caption:
      'Full stage visual backdrop paired with dynamic vocal microphones, instrument pickups, and stage monitors.',
    span: 'lg:col-span-6',
    sortOrder: 9,
  },
  {
    id: 'photo-wa0020',
    mediaType: 'field_photo',
    src: '/assets/aistudio/IMG-20261025-WA0020_ecb653b2.jpg',
    poster: '',
    categoryOrTag: 'Public Ceremonies',
    title: 'Dignitary Felicitation & Award Ceremony LED Wall',
    caption:
      'Bright indoor LED backdrop and stage audio reinforcement for official ceremonies and public gatherings across Kerala.',
    span: 'lg:col-span-4',
    sortOrder: 10,
  },
  {
    id: 'photo-wa0043',
    mediaType: 'field_photo',
    src: '/assets/aistudio/IMG-20261025-WA0043_7db4c382.jpg',
    poster: '',
    categoryOrTag: 'Auditorium Production',
    title: 'Golden Jubilee Auditorium — NovaStar VX1 & OBS Stream',
    caption:
      'NovaStar VX1 LED display video controller rack paired with live graduation ceremony broadcast and stage lighting.',
    span: 'lg:col-span-4',
    sortOrder: 11,
  },
  {
    id: 'photo-wa0037',
    mediaType: 'field_photo',
    src: '/assets/aistudio/IMG-20261025-WA0037_70b34a7b.jpg',
    poster: '',
    categoryOrTag: 'Complete Stage Package',
    title: 'Line-Array PA, Moving-Head T-Bar & LED Wall',
    caption:
      'Synchronized auditorium setup combining flown line-array speakers, 4-head beam lighting bar, and live streaming.',
    span: 'lg:col-span-4',
    sortOrder: 12,
  },
  {
    id: 'photo-wa0038',
    mediaType: 'field_photo',
    src: '/assets/aistudio/IMG-20261025-WA0038_146757e2.jpg',
    poster: '',
    categoryOrTag: 'Reception Backdrop',
    title: 'Indoor Banquet & Wedding Reception LED Screen',
    caption:
      'High-contrast P2/P3 indoor LED wall delivering vibrant wide-angle visuals for wedding receptions and banquets.',
    span: 'lg:col-span-12',
    sortOrder: 13,
  },
];

export const DEFAULT_EVENT_CATEGORIES: CmsEventCategory[] = [
  {
    id: 'corporate',
    eyebrow: '01. Conferences & Summits',
    title: 'Auditorium Conferences & Convocations',
    description:
      'NovaStar VX1 LED wall processing, OBS multi-scene live streaming, stage moving-head lighting, and clear speech reinforcement.',
    image: '/assets/aistudio/IMG-20261025-WA0043_7db4c382.jpg',
    link: '/catalogue?event=corporate',
  },
  {
    id: 'launches',
    eyebrow: '02. Multi-Cam Broadcast',
    title: 'Live Streaming & Broadcast Control',
    description:
      'Blackmagic ATEM live switchers, Hollyland multiview monitors, YoloLiv encoders, Sony camcorders, and wireless RF audio racks.',
    image: '/assets/aistudio/IMG-20261025-WA0023_0e200ba8.jpg',
    link: '/catalogue?event=launches',
  },
  {
    id: 'weddings',
    eyebrow: '03. Celebrations',
    title: 'Weddings & Grand Receptions',
    description:
      'High-brightness stage LED walls, live camera feed projection, warm stage wash lighting, Cold Fire sparks, and QSC/RCF sound.',
    image: '/assets/aistudio/IMG-20261025-WA0069_b0d21777.jpg',
    link: '/catalogue?event=weddings',
  },
  {
    id: 'concerts',
    eyebrow: '04. Live Concerts & Mega Shows',
    title: 'Outdoor Mega Shows, Concerts & Stage Programs',
    description:
      'Custom widescreen outdoor & indoor LED backdrops, stage vocal & instrument microphone kits, digital mixing consoles, and line-array PA systems.',
    image: '/assets/aistudio/IMG-20261025-WA0065_f92ae4c4.jpg',
    link: '/catalogue?event=concerts',
  },
];

export const DEFAULT_HIGHLIGHT_STORIES: CmsHighlightStory[] = [
  {
    id: 'story-1',
    quote:
      'LIVEON CONNECT provides complete audio-visual rental solutions for events, including modular LED walls, multi-cam live streaming, line-array sound systems, and intelligent stage lighting across Kerala.',
    author: 'LIVEON CONNECT Production Team',
    role: 'Manimala, Kottayam, Kerala – 686543',
    photo: '/assets/aistudio/IMG-20261025-WA0039_851e9d5d.jpg',
  },
  {
    id: 'story-2',
    quote:
      'Our live streaming and broadcast control desks feature NovaStar VX1 LED processors, Blackmagic ATEM switchers, YoloLiv encoders, and multi-channel wireless RF audio for seamless auditorium and wedding coverage.',
    author: 'Live Broadcast & LED Wall Desk',
    role: 'LED Wall, Live Streaming & Sound Company',
    photo: '/assets/aistudio/IMG-20261025-WA0023_0e200ba8.jpg',
  },
  {
    id: 'story-3',
    quote:
      'From grand wedding reception LED walls and felicitation ceremonies to RCF 9007-AS concert line-arrays and stage lighting rigs, we deliver, set up, and pick up after your show.',
    author: 'Event Rental Desk',
    role: 'WhatsApp +91 8590952476',
    photo: '/assets/aistudio/IMG-20261025-WA0040_6d732744.jpg',
  },
];

export const DEFAULT_FAQ_ITEMS: CmsFaqItem[] = [
  {
    id: 'faq-1',
    category: 'Rental Products',
    question: 'What types of audio-visual equipment can I rent from LIVEON CONNECT?',
    answer:
      'LIVEON CONNECT provides 52 equipment configurations across 9 categories: Sound Systems (500W Bluetooth speakers up to JBL VRX and RCF 12 & 9007-AS line array stacks), Stage Lighting (LED Par Cans, Sharpy beams, Blinders, Profile/Follow spots, Avolites consoles, and Circle Lasers), Modular LED Walls (8×6 ft up to 10×30 ft and fine-pitch P2 walls), TVs & Displays (43" to 75" and Touch Screen TVs), Projectors, Mixers & Microphones (Soundcraft LX7, Allen & Heath SQ7, Drum Mic Sets), AV Accessories (Live Video Switchers, Clear-Com Intercoms, Cue Commanders), Special Effects, and Acoustic Diesel Gensets.',
  },
  {
    id: 'faq-2',
    category: 'Daily Rates',
    question: 'How do daily rental rates work in the equipment catalogue?',
    answer:
      'Most sound, lighting, projector, mixer, display, and accessory items are listed with an indicative per-day reference price or price range in INR (₹/day). In the Quote Builder, daily equipment estimates are calculated as Selected Rate × Quantity × Rental Days. All displayed rates are reference figures and require confirmation from LIVEON CONNECT based on your specific event requirements.',
  },
  {
    id: 'faq-3',
    category: 'LED Wall Pricing',
    question: 'How is LED wall pricing calculated for fixed sizes versus the P2 LED Wall?',
    answer:
      'Standard modular stage sizes (8×6 ft, 10×12 ft, 10×20 ft, and 10×30 ft) have indicative daily package reference ranges. The fine-pitch P2 LED Wall is priced per square foot (₹120–₹150/sq ft reference rate). In our catalogue and Quote Builder, you can enter your required Width (ft) and Height (ft) to calculate the total square footage and indicative estimate.',
  },
  {
    id: 'faq-4',
    category: 'Genset Billing',
    question: 'How is the Diesel Genset billed for events?',
    answer:
      'Unlike standard daily AV items, the DEC DE63 CPCB IV+ soundproof diesel generator set is billed in 5-hour operational blocks (₹7,000 per 5 hours reference rate). You can select the required number of 5-hour blocks directly in the Catalogue or Quote Builder.',
  },
  {
    id: 'faq-5',
    category: 'Transportation',
    question: 'Is venue transportation included in the indicative equipment estimate?',
    answer:
      'Transportation is calculated separately and shown as "To Be Confirmed" in your quote summary. Transport charges depend on the venue distance from Manimala, Kottayam, the total volume/weight of LED wall structures, sound stacks, or gensets, and local venue access conditions.',
  },
  {
    id: 'faq-6',
    category: 'Availability',
    question: 'Does adding equipment to the Quote Cart reserve it for my event date?',
    answer:
      'Adding items to your Quote Cart generates an indicative enquiry list and does not automatically reserve inventory. Equipment availability for your specific event date must be verified directly with LIVEON CONNECT via WhatsApp or phone.',
  },
  {
    id: 'faq-7',
    category: 'Delivery and Setup',
    question: 'Do you provide delivery, on-site setup, and technical operation?',
    answer:
      'Yes, where available and confirmed as part of your quotation, LIVEON CONNECT coordinates equipment delivery to your venue, stage rigging, signal setup, and post-event collection after the show.',
  },
  {
    id: 'faq-8',
    category: 'Quote Requests',
    question: 'How do I request a final confirmed quotation?',
    answer:
      'Select your required gear in the Catalogue, open the Rental Quote Builder (/quote), enter your event date, venue, and audience size, and click "Send Quote Request via WhatsApp". This opens a pre-formatted WhatsApp message addressed to +91 8590952476 so our team can confirm availability and provide your final quotation.',
  },
];

export const BUILT_IN_PHOTO_ASSETS: { label: string; path: string }[] = [
  { label: 'FOH Control & Stage LED Wall (WA0039)', path: '/assets/aistudio/IMG-20261025-WA0039_851e9d5d.jpg' },
  { label: 'Outdoor LED Wall Mega Show (WA0065)', path: '/assets/aistudio/IMG-20261025-WA0065_f92ae4c4.jpg' },
  { label: 'Wedding FOH NovaStar VX1 + OBS (WA0068)', path: '/assets/aistudio/IMG-20261025-WA0068_830a56a3.jpg' },
  { label: 'Wedding Procession Live LED Wall (WA0069)', path: '/assets/aistudio/IMG-20261025-WA0069_b0d21777.jpg' },
  { label: 'Sony Camera & 8-Ch Wireless RF Rack (WA0027)', path: '/assets/aistudio/IMG-20261025-WA0027_d40569c7.jpg' },
  { label: 'ATEM Switcher & Dual Hollyland Monitors (WA0023)', path: '/assets/aistudio/IMG-20261025-WA0023_0e200ba8.jpg' },
  { label: 'YoloLiv Multi-HDMI Streaming Rig (WA0021)', path: '/assets/aistudio/IMG-20261025-WA0021_07860ad8.jpg' },
  { label: 'Grand Wedding Stage LED Wall (WA0040)', path: '/assets/aistudio/IMG-20261025-WA0040_6d732744.jpg' },
  { label: 'Live Concert Stage LED Wall (WA0032)', path: '/assets/aistudio/IMG-20261025-WA0032_fbbc607c.jpg' },
  { label: 'Award Ceremony LED Backdrop (WA0020)', path: '/assets/aistudio/IMG-20261025-WA0020_ecb653b2.jpg' },
  { label: 'Auditorium NovaStar VX1 & OBS Stream (WA0043)', path: '/assets/aistudio/IMG-20261025-WA0043_7db4c382.jpg' },
  { label: 'Line-Array PA & Moving Heads (WA0037)', path: '/assets/aistudio/IMG-20261025-WA0037_70b34a7b.jpg' },
  { label: 'Banquet Reception LED Screen (WA0038)', path: '/assets/aistudio/IMG-20261025-WA0038_146757e2.jpg' },
];

export const BUILT_IN_VIDEO_ASSETS: { label: string; path: string }[] = [
  { label: '01. Auditorium OBS Stream & Line-Array (WA0042)', path: '/assets/aistudio/VID-20261025-WA0042_707f40a7.mp4' },
  { label: '02. Grand Wedding Reception LED Wall (WA0044)', path: '/assets/aistudio/VID-20261025-WA0044_a553324a.mp4' },
  { label: '03. Cultural Dance LED Backdrop & OBS (WA0074)', path: '/assets/aistudio/VID-20261025-WA0074_299cd498.mp4' },
  { label: '04. Graduation Ceremony Dual-Laptop Stream (WA0073)', path: '/assets/aistudio/VID-20261025-WA0073_b2b97e51.mp4' },
  { label: '05. Indoor Arena Concert Rig & Beams (WA0071)', path: '/assets/aistudio/VID-20261025-WA0071_2406a325.mp4' },
  { label: '06. Live DJ & Crowd Show FOH (WA0072)', path: '/assets/aistudio/VID-20261025-WA0072_2e6371a0.mp4' },
  { label: '07. Wedding Hall Multi-Cam & LED Banner (WA0070)', path: '/assets/aistudio/VID-20261025-WA0070_2d045f3a.mp4' },
];
