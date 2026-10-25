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
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <section className="bg-slate-950 text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-widest text-sky-400 uppercase">
            Get in Touch
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2">
            Contact {siteConfig.businessName}
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
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <img
                  src={siteConfig.logoPath}
                  alt={siteConfig.businessName}
                  className="h-12 w-auto object-contain"
                />
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {siteConfig.businessName}
                  </h2>
                  <p className="text-xs font-semibold text-rose-600">
                    {siteConfig.tagline}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500">
                      Business Address
                    </div>
                    <div className="font-semibold text-slate-900 mt-0.5">
                      {siteConfig.address.full}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500">
                      Mobile (Click to Call)
                    </div>
                    <a
                      href={`tel:${siteConfig.phoneDial}`}
                      className="font-bold text-slate-900 hover:text-blue-700 font-mono-tabular mt-0.5 inline-block"
                    >
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500">
                      WhatsApp (Click to Chat)
                    </div>
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-slate-900 hover:text-blue-700 font-mono-tabular mt-0.5 inline-block"
                    >
                      {siteConfig.whatsappDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500">
                      Email Address
                    </div>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="font-semibold text-slate-900 hover:text-blue-700 break-all mt-0.5 inline-block"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500">
                      Instagram Official Page
                    </div>
                    <a
                      href={siteConfig.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-700 hover:underline mt-0.5 inline-block"
                    >
                      @liveonconnect
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Validated Enquiry Form with WhatsApp Fallback */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Send an Event Equipment Enquiry
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Complete the form below to prepare your enquiry message.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
                <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Direct WhatsApp Enquiry Flow:</strong> This website does not store form submissions in an external database. Submitting this form validates your details and generates a direct click-to-chat WhatsApp link to {siteConfig.businessName} ({siteConfig.whatsappDisplay}).
                </span>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    {errors.name && (
                      <p className="text-xs text-rose-600 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone / WhatsApp <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg font-mono-tabular focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    {errors.phone && (
                      <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    {errors.email && (
                      <p className="text-xs text-rose-600 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Event Type
                    </label>
                    <select
                      value={form.eventType}
                      onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={form.eventDate}
                      onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Venue Location
                    </label>
                    <input
                      type="text"
                      value={form.venue}
                      onChange={(e) => setForm({ ...form, venue: e.target.value })}
                      placeholder="Venue name & town/district"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Required Equipment <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.requiredEquipment}
                      onChange={(e) =>
                        setForm({ ...form, requiredEquipment: e.target.value })
                      }
                      placeholder="e.g. 10x20 ft LED Wall, JBL VRX Sound System, 8 Sharpy Lights, Live Streaming Switcher"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    {errors.requiredEquipment && (
                      <p className="text-xs text-rose-600 mt-1">
                        {errors.requiredEquipment}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Additional Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={form.additionalRequirements}
                      onChange={(e) =>
                        setForm({ ...form, additionalRequirements: e.target.value })
                      }
                      placeholder="Expected audience size, rental duration, indoor/outdoor stage details, or setup schedule..."
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold cursor-pointer transition-colors"
                  >
                    Prepare WhatsApp Enquiry
                  </button>
                </div>
              </form>

              {submittedWhatsAppUrl && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Enquiry Validated &amp; Ready to Send</span>
                  </div>
                  <p className="text-xs text-emerald-800">
                    Click the button below to open WhatsApp and send your formatted enquiry directly to {siteConfig.businessName} ({siteConfig.whatsappDisplay}).
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={submittedWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Open WhatsApp &amp; Send Now</span>
                    </a>
                    <a
                      href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(
                        `AV Rental Enquiry — ${form.eventType}`
                      )}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-semibold"
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
