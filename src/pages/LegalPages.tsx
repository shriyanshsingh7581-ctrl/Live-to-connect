import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { siteConfig } from '../config/site';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 space-y-6">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Editable Legal Template Notice:</strong> This Privacy Policy is an editable template prepared for {siteConfig.businessName} and should be reviewed by the business owner or legal counsel prior to commercial publication.
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {siteConfig.businessName} · {siteConfig.address.full}
            </p>
          </div>

          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900">
              1. Information You Provide
            </h2>
            <p>
              When you build an equipment rental quote or prepare an enquiry on the {siteConfig.businessName} website, you may enter details such as your name, phone number, email address, event date, venue location, audience size, and equipment selections.
            </p>

            <h2 className="text-base font-bold text-slate-900">
              2. Browser Local Storage &amp; WhatsApp Communication
            </h2>
            <p>
              Your quote cart selections and draft event details are stored locally in your web browser&apos;s storage so that your selections remain available as you navigate across pages. When you click to send a quotation or enquiry via WhatsApp, your formatted message is passed to WhatsApp to initiate a direct conversation with {siteConfig.businessName} ({siteConfig.whatsappDisplay}).
            </p>

            <h2 className="text-base font-bold text-slate-900">
              3. How We Use Enquiry Details
            </h2>
            <p>
              Contact and event information shared with {siteConfig.businessName} via phone, WhatsApp, or email is used solely to verify equipment availability, discuss technical event requirements, estimate transportation and setup logistics, and provide rental quotations.
            </p>

            <h2 className="text-base font-bold text-slate-900">
              4. Contact for Privacy Enquiries
            </h2>
            <p>
              For questions regarding this policy, please contact {siteConfig.businessName} at{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-blue-700 font-semibold">
                {siteConfig.email}
              </a>{' '}
              or call{' '}
              <a href={`tel:${siteConfig.phoneDial}`} className="text-blue-700 font-semibold">
                {siteConfig.phone}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TermsAndConditionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 space-y-6">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Editable Legal Template Notice:</strong> These Terms and Conditions are an editable template prepared for {siteConfig.businessName} and must be reviewed and customized with specific booking, payment, and operational terms before publication.
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Terms and Conditions
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {siteConfig.businessName} · {siteConfig.address.full}
            </p>
          </div>

          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900">
              1. Indicative Catalogue Reference Rates
            </h2>
            <p>
              All rental prices and price ranges displayed on this website (including daily rates, per-square-foot LED wall rates, and per-five-hour Genset rates) are indicative reference figures only. Submitting an online quote list or WhatsApp message does not create a binding rental contract or confirm final rates.
            </p>

            <h2 className="text-base font-bold text-slate-900">
              2. Availability, Transportation &amp; Installation
            </h2>
            <p>
              Equipment availability, venue transportation charges, rigging structures, power distribution, and technical crew deployment are subject to written or direct confirmation by {siteConfig.businessName} after reviewing your event date, venue access, and schedule.
            </p>

            <h2 className="text-base font-bold text-slate-900">
              3. Site Requirements &amp; Equipment Care
            </h2>
            <p>
              Event organizers and clients are responsible for coordinating safe venue access, adequate stage space, weather protection for outdoor installations, and appropriate venue permissions unless otherwise agreed in writing with {siteConfig.businessName}.
            </p>

            <h2 className="text-base font-bold text-slate-900">
              4. Business Contact Details
            </h2>
            <p>
              {siteConfig.businessName}, {siteConfig.address.full}. Phone / WhatsApp:{' '}
              {siteConfig.whatsappDisplay} · Email: {siteConfig.email}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
