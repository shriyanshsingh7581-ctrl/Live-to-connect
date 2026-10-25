import React, { useState } from 'react';
import { Phone, Mail, MapPin, Instagram, MessageCircle, Info, CheckCircle2 } from 'lucide-react';
import { siteConfig, getWhatsAppUrl } from '../config/site';

interface ContactFormState {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  venue: string;
  requiredEquipment: string;
  additionalRequirements: string;
}

const INITIAL_FORM: ContactFormState = {
  name: '',
  phone: '',
  email: '',
  eventType: 'Corporate Conference / Summit',
  eventDate: '',
  venue: '',
  requiredEquipment: '',
  additionalRequirements: '',
};

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormState, string>>>({});
  const [submittedWhatsAppUrl, setSubmittedWhatsAppUrl] = useState<string | null>(null);

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof ContactFormState, string>> = {};
    if (!form.name.trim()) {
      nextErrors.name = 'Please enter your name.';
    }
    const cleanPhone = form.phone.replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      nextErrors.phone = 'Please enter a valid phone or WhatsApp number.';
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!form.requiredEquipment.trim()) {
      nextErrors.requiredEquipment =
        'Please mention the equipment or AV services you are looking for.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const message = [
      `Hello ${siteConfig.businessName},`,
      '',
      'I would like to enquire about audio-visual equipment rentals.',
      '',
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Email: ${form.email.trim() || 'Not provided'}`,
      `Event Type: ${form.eventType}`,
      `Event Date: ${form.eventDate || 'To Be Decided'}`,
      `Venue: ${form.venue.trim() || 'To Be Confirmed'}`,
      '',
      'Required Equipment:',
      form.requiredEquipment.trim(),
      '',
      `Additional Requirements: ${form.additionalRequirements.trim() || 'None'}`,
      '',
      'Please confirm availability and share quotation details.',
      'Thank you.',
    ].join('\n');

    const waUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
    setSubmittedWhatsAppUrl(waUrl);
  };

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 pb-20">
      {/* Header */}
      <section className="relative intellio-grid-bg text-white py-14 sm:py-16 border-b border-white/[0.08] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 20% 35%, rgba(99, 102, 241, 0.22) 0%, transparent 45%), radial-gradient(circle at 80% 30%, rgba(217, 70, 239, 0.18) 0%, transparent 45%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-wider text-indigo-300 font-mono-tabular">
            Get in Touch
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2">
            Contact <span className="led-text-gradient">{siteConfig.businessName}</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
            Reach out via phone, WhatsApp, or email to discuss LED walls, live streaming, sound systems, stage lighting, and event AV setups in Kerala.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Official Contact Information Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="intellio-card rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="bg-white p-2 rounded-xl">
                  <img
                    src={siteConfig.logoPath}
                    alt={siteConfig.businessName}
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {siteConfig.businessName}
                  </h2>
                  <p className="text-xs font-semibold led-text-gradient">
                    {siteConfig.tagline}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400">
                      Business Address
                    </div>
                    <div className="font-semibold text-white mt-0.5">
                      {siteConfig.address.full}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400">
                      Mobile (Click to Call)
                    </div>
                    <a
                      href={`tel:${siteConfig.phoneDial}`}
                      className="font-bold text-white hover:text-indigo-300 font-mono-tabular mt-0.5 inline-block"
                    >
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400">
                      WhatsApp (Click to Chat)
                    </div>
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-white hover:text-emerald-300 font-mono-tabular mt-0.5 inline-block"
                    >
                      {siteConfig.whatsappDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-fuchsia-500/15 border border-fuchsia-400/30 text-fuchsia-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400">
                      Email Address
                    </div>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="font-semibold text-white hover:text-fuchsia-300 break-all mt-0.5 inline-block"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-pink-500/15 border border-pink-400/30 text-pink-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400">
                      Instagram Official Page
                    </div>
                    <a
                      href={siteConfig.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-indigo-300 hover:underline mt-0.5 inline-block"
                    >
                      @liveonconnect
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Real Field Production Preview Card */}
            <div className="intellio-card rounded-2xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl overflow-hidden aspect-[16/10] border border-[#6854fc]/35">
                  <img
                    src="/assets/aistudio/IMG-20261025-WA0021_07860ad8.jpg"
                    alt="YoloLiv Multi-Cam Streaming & Audio Desk"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-xl overflow-hidden aspect-[16/10] border border-[#6854fc]/35">
                  <img
                    src="/assets/aistudio/IMG-20261025-WA0020_ecb653b2.jpg"
                    alt="Official Ceremony LED Backdrop"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-300 px-1">
                On-site LED wall installations, multi-camera live streaming, and concert sound systems across Kottayam &amp; Kerala.
              </p>
            </div>
          </div>

          {/* Right Column: Validated Enquiry Form with WhatsApp Fallback */}
          <div className="lg:col-span-7">
            <div className="intellio-card rounded-2xl p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Send an Event Equipment Enquiry
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Complete the form below to prepare your enquiry message.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#060814] border border-white/10 flex items-start gap-2.5 text-xs text-slate-300">
                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Direct WhatsApp Enquiry Flow:</strong> This website does not store form submissions in an external database. Submitting this form validates your details and generates a direct click-to-chat WhatsApp link to {siteConfig.businessName} ({siteConfig.whatsappDisplay}).
                </span>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#060814] text-white placeholder:text-slate-500 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.name && (
                      <p className="text-xs text-rose-400 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone / WhatsApp <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#060814] text-white placeholder:text-slate-500 border border-white/15 rounded-xl font-mono-tabular focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.phone && (
                      <p className="text-xs text-rose-400 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#060814] text-white placeholder:text-slate-500 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.email && (
                      <p className="text-xs text-rose-400 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Event Type
                    </label>
                    <select
                      value={form.eventType}
                      onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-white/15 rounded-xl bg-[#060814] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Corporate Conference / Summit">
                        Corporate Conference / Summit
                      </option>
                      <option value="Brand Launch / Town Hall">
                        Brand Launch / Town Hall
                      </option>
                      <option value="Wedding / Reception">
                        Wedding / Reception
                      </option>
                      <option value="Concert / Cultural Show">
                        Concert / Cultural Show
                      </option>
                      <option value="Exhibition / Trade Show">
                        Exhibition / Trade Show
                      </option>
                      <option value="Other Event">Other Event</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={form.eventDate}
                      onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#060814] text-white border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Venue Location
                    </label>
                    <input
                      type="text"
                      value={form.venue}
                      onChange={(e) => setForm({ ...form, venue: e.target.value })}
                      placeholder="Venue name & town/district"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#060814] text-white placeholder:text-slate-500 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Required Equipment <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.requiredEquipment}
                      onChange={(e) =>
                        setForm({ ...form, requiredEquipment: e.target.value })
                      }
                      placeholder="e.g. 10x20 ft LED Wall, JBL VRX Sound System, 8 Sharpy Lights, Live Streaming Switcher"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#060814] text-white placeholder:text-slate-500 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.requiredEquipment && (
                      <p className="text-xs text-rose-400 mt-1">
                        {errors.requiredEquipment}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Additional Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={form.additionalRequirements}
                      onChange={(e) =>
                        setForm({ ...form, additionalRequirements: e.target.value })
                      }
                      placeholder="Expected audience size, rental duration, indoor/outdoor stage details, or setup schedule..."
                      className="w-full px-3.5 py-2.5 text-sm bg-[#060814] text-white placeholder:text-slate-500 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl intellio-btn-primary text-white text-sm font-semibold cursor-pointer"
                  >
                    Prepare WhatsApp Enquiry
                  </button>
                </div>
              </form>

              {submittedWhatsAppUrl && (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Enquiry Validated &amp; Ready to Send</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Click the button below to open WhatsApp and send your formatted enquiry directly to {siteConfig.businessName} ({siteConfig.whatsappDisplay}).
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={submittedWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl intellio-btn-primary text-white text-xs font-semibold"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Open WhatsApp &amp; Send Now</span>
                    </a>
                    <a
                      href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(
                        `AV Rental Enquiry — ${form.eventType}`
                      )}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-slate-200 text-xs font-semibold"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Or Send via Email</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
