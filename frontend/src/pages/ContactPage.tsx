import React, { useState } from 'react';
import {
  Send,
  MapPin,
  Mail,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Phone,
  ArrowUpRight,
  AlertCircle,
} from 'lucide-react';
import { GDP_CONTACT_INFO } from '../data/mockData';
import { api, ApiError } from '../services/apiClient';

interface ContactFormDataWithHp {
  name: string;
  email: string;
  phone: string;
  message: string;
  _hp?: string;
}

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormDataWithHp>({
    name: '',
    email: '',
    phone: '',
    message: '',
    _hp: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [inquiryId, setInquiryId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please enter your full name.';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please enter your message.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      const res = await api.submitContactInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: 'General Inquiry',
        message: formData.message.trim(),
        _hp: formData._hp,
      });

      setInquiryId(res.inquiryId || null);
      setSubmitted(true);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setApiError(err.message);
      } else {
        setApiError('Unable to connect to the studio server. Please try again or reach out on WhatsApp.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left transition-colors duration-300">
      {/* =========================================================================
          1. CONTACT HERO
          ========================================================================= */}
      <section className="space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#1E2761]/80 border border-slate-200 dark:border-[#CADCFC]/25 text-[#1E2761] dark:text-[#CADCFC] text-xs font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
          <span>START YOUR PODCAST JOURNEY</span>
          <span className="text-slate-400 dark:text-slate-500">•</span>
          <span className="text-[#C68A27] dark:text-[#D9A441]">SURAT STUDIO</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] font-serif">
          Your Story Could Be Someone's Inspiration.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E2761] via-[#C68A27] to-[#B8860B] dark:from-white dark:via-[#F2C94C] dark:to-[#D9A441]">
            Don't Postpone It.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-[#CADCFC]/90 leading-relaxed font-light">
          Whether you want to discuss your podcast concept, visit our studio in Surat, or structure your executive narrative, Bhavesh Chudasama and the GDP team are ready to guide you.
        </p>

        {/* WhatsApp & Discovery CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
          <a
            href={GDP_CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp ‘PODCAST’ to Get Started</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <a
            href="#contact-form"
            className="px-6 py-4 rounded-xl font-bold text-xs sm:text-sm text-slate-800 dark:text-white bg-white dark:bg-[#121936] hover:bg-slate-50 dark:hover:bg-[#1E2761] border border-slate-200 dark:border-[#CADCFC]/20 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#C68A27] dark:text-[#D9A441]" />
            <span>Book a Free Discovery Call</span>
          </a>
        </div>
      </section>

      {/* =========================================================================
          2. CONTACT FORM & STUDIO LOCATION
          ========================================================================= */}
      <div id="contact-form" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start scroll-mt-24">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#121936]/90 border border-slate-200 dark:border-[#CADCFC]/15 shadow-xl dark:shadow-2xl backdrop-blur-xl transition-colors">
          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-serif">Inquiry & Session Booking</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#CADCFC]">
              Submit your inquiry below or contact Bhavesh directly on WhatsApp.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 space-y-4">
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <span>Inquiry Submitted Successfully!</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                Thank you, <strong>{formData.name}</strong>. Your inquiry has been received by GDP Studio. Our team will review your message and get back to you shortly.
              </p>
              {inquiryId && (
                <div className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-xs inline-block">
                  Inquiry Reference: <span className="font-bold">{inquiryId}</span>
                </div>
              )}
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={GDP_CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp Bhavesh Now</span>
                </a>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setInquiryId(null);
                    setFormData({ name: '', email: '', phone: '', message: '', _hp: '' });
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Hidden anti-spam honeypot */}
              <input
                type="text"
                name="_hp"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
                value={formData._hp || ''}
                onChange={(e) => setFormData({ ...formData, _hp: e.target.value })}
              />

              {apiError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{apiError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setApiError(null)}
                    className="text-xs underline hover:opacity-80"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Patel"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-[#C68A27] dark:focus:border-[#D9A441] transition-colors"
                  />
                  {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-[#C68A27] dark:focus:border-[#D9A441] transition-colors"
                  />
                  {errors.email && <p className="text-[11px] text-rose-500">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Phone / WhatsApp Number</span>
                  <span className="text-[10px] text-[#C68A27] dark:text-[#D9A441] font-normal">Instant WhatsApp Confirmation</span>
                </label>
                <input
                  type="tel"
                  placeholder="+91 97270 01838"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-[#C68A27] dark:focus:border-[#D9A441] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">What story or topics do you want to share? *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us briefly about your business, journey, or the specific insights you want to record..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-[#C68A27] dark:focus:border-[#D9A441] transition-colors resize-none"
                />
                {errors.message && <p className="text-[11px] text-rose-500">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-bold text-sm text-[#0E1326] bg-[#D9A441] hover:bg-[#F2C94C] shadow-lg shadow-[#D9A441]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Submitting Inquiry...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                * Your inquiry will be sent directly to the GDP Studio team in Surat.
              </p>
            </form>
          )}
        </div>

        {/* Right Column: Studio Coordinates */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#121936]/80 border border-slate-200 dark:border-[#CADCFC]/15 shadow-xl transition-colors space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif">GDP Studio Headquarters</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 flex items-center justify-center text-[#C68A27] dark:text-[#D9A441] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1E2761] dark:text-[#CADCFC] block">Studio Location</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">Surat, Gujarat, India</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Studio sessions by advance appointment</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 flex items-center justify-center text-[#C68A27] dark:text-[#D9A441] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1E2761] dark:text-[#CADCFC] block">Official Email</span>
                  <a
                    href={`mailto:${GDP_CONTACT_INFO.email}`}
                    className="text-sm font-semibold text-slate-900 dark:text-white hover:text-[#C68A27] dark:hover:text-[#D9A441] transition-colors"
                  >
                    {GDP_CONTACT_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 flex items-center justify-center text-[#C68A27] dark:text-[#D9A441] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1E2761] dark:text-[#CADCFC] block">Phone & WhatsApp</span>
                  <a
                    href={`tel:${GDP_CONTACT_INFO.phone}`}
                    className="text-sm font-semibold text-slate-900 dark:text-white hover:text-[#C68A27] dark:hover:text-[#D9A441] transition-colors"
                  >
                    {GDP_CONTACT_INFO.phoneFormatted}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 flex items-center justify-center text-[#C68A27] dark:text-[#D9A441] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1E2761] dark:text-[#CADCFC] block">Production Hours</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">Monday – Saturday</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">10:00 AM – 7:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#1E2761]/60 dark:to-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 shadow-md space-y-2 transition-colors">
            <span className="text-xs font-bold text-[#C68A27] dark:text-[#D9A441] uppercase tracking-wider block">
              Personal Note from Bhavesh:
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
              “If your journey has a lesson, your story has value. Don’t wait for the ‘perfect’ time to start your podcast. We take care of the studio lighting, cameras, and editing — you just bring your experience.”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
