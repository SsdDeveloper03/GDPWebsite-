import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { GDP_CONTACT_INFO } from '../../data/mockData';
import { api, ApiError } from '../../services/apiClient';

interface ContactState {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  _hp?: string;
}

export const ContactConversionSection: React.FC = () => {
  const [formData, setFormData] = useState<ContactState>({
    name: '',
    email: '',
    phone: '',
    subject: 'Podcast Inquiry',
    message: '',
    _hp: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please enter your name, email, and message to proceed.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.submitContactInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject || 'Podcast Inquiry',
        message: formData.message.trim(),
        _hp: formData._hp,
      });

      setInquiryId(res.inquiryId || null);
      setSubmitted(true);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Unable to connect to the studio server. Please check your network or message us on WhatsApp.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 dark:bg-[#070A14] border-t border-slate-200 dark:border-[#CADCFC]/15 text-left scroll-mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dramatic Section Heading */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-[#D9A441]/10 border border-slate-300 dark:border-[#D9A441]/30 text-[#1E2761] dark:text-[#F2C94C] text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
            <span>START YOUR PODCAST JOURNEY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight font-serif">
            Your Story Could Be Someone's Inspiration.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E2761] via-[#C68A27] to-[#B8860B] dark:from-white dark:via-[#F2C94C] dark:to-[#D9A441]">
              Don't Postpone It.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-[#CADCFC]/80 leading-relaxed font-light">
            Whether you want to launch a premier business podcast or build an undisputed personal brand, our team in Surat is ready to guide you from blueprint to broadcast.
          </p>
        </div>

        {/* Primary Action Buttons Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {/* Primary CTA: WhatsApp */}
          <a
            href={GDP_CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-500/20 group transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 block">
                  FASTEST RESPONSE
                </span>
                <span className="text-base sm:text-lg font-extrabold font-serif">
                  WhatsApp ‘PODCAST’ to Get Started
                </span>
              </div>
            </div>
            <span className="text-xs font-bold bg-white/20 px-3 py-1.5 rounded-xl group-hover:scale-105 transition-transform">
              Chat Now →
            </span>
          </a>

          {/* Secondary CTA: Discovery Call */}
          <a
            href="#contact-form"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('contact-form');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center justify-between p-6 rounded-2xl bg-white dark:bg-[#1E2761]/60 hover:bg-slate-50 dark:hover:bg-[#1E2761] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white shadow-md dark:shadow-xl group transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-[#C68A27] dark:text-[#D9A441]">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#CADCFC] block">
                  FREE STUDIO CONSULTATION
                </span>
                <span className="text-base sm:text-lg font-extrabold font-serif">
                  Book a Free Discovery Call
                </span>
              </div>
            </div>
            <span className="text-xs font-bold bg-slate-100 dark:bg-white/10 text-[#C68A27] dark:text-[#D9A441] px-3 py-1.5 rounded-xl group-hover:scale-105 transition-transform">
              Book Call →
            </span>
          </a>
        </div>

        {/* Contact Form & Studio Details Grid */}
        <div id="contact-form" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start scroll-mt-24">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#121936]/90 border border-slate-200 dark:border-[#CADCFC]/15 shadow-xl dark:shadow-2xl backdrop-blur-xl">
            <div className="space-y-2 mb-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-serif">Send an Inquiry to Bhavesh</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#CADCFC]/80">
                Share a few details about your journey, and we’ll reach out to schedule your recording session.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 space-y-4">
                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold text-base">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <span>Inquiry Submitted Successfully!</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  Thank you, <strong>{formData.name}</strong>. Your message has been received and recorded by GDP Studio.
                </p>
                {inquiryId && (
                  <div className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-xs inline-block">
                    Inquiry Reference: <span className="font-bold">{inquiryId}</span>
                  </div>
                )}
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Our team typically responds within 24 hours. For urgent studio appointments, feel free to connect directly via WhatsApp.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={GDP_CONTACT_INFO.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>WhatsApp Bhavesh Now</span>
                  </a>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setInquiryId(null);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        subject: 'Podcast Inquiry',
                        message: '',
                        _hp: '',
                      });
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
                  value={formData._hp}
                  onChange={(e) => setFormData({ ...formData, _hp: e.target.value })}
                />

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{errorMsg}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setErrorMsg(null)}
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
                      placeholder="e.g. Rajesh Patel"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-[#C68A27] dark:focus:border-[#D9A441] transition-colors"
                    />
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
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">What story or topic do you want to share? *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us briefly about your business, journey, or the specific lessons you want to talk about in the podcast..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-[#C68A27] dark:focus:border-[#D9A441] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-sm text-[#0E1326] bg-gradient-to-r from-[#F2C94C] via-[#D9A441] to-[#E5A93B] hover:opacity-95 shadow-lg shadow-[#D9A441]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span>Submitting Inquiry to Studio...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry to GDP Studio</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                  * Note: This is an interactive frontend prototype. Submissions will connect to the backend API in the next phase.
                </p>
              </form>
            )}
          </div>

          {/* Right Column: Studio & Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#121936]/80 border border-slate-200 dark:border-[#CADCFC]/15 shadow-md dark:shadow-xl space-y-6">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white font-serif">GDP Studio Headquarters</h4>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 flex items-center justify-center text-[#C68A27] dark:text-[#D9A441] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1E2761] dark:text-[#CADCFC] block">Location</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Surat, Gujarat, India</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">In-studio recording by advance appointment</p>
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
                    <span className="text-xs font-bold text-[#1E2761] dark:text-[#CADCFC] block">Studio Timings</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Monday – Saturday</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">10:00 AM – 7:00 PM IST</p>
                  </div>
                </div>

                {/* Social Media Channels */}
                <div className="pt-3 border-t border-slate-200 dark:border-white/10">
                  <span className="text-xs font-bold text-[#1E2761] dark:text-[#CADCFC] block mb-2">
                    Official Social Channels
                  </span>
                  <div className="flex items-center gap-2.5">
                    <a
                      href="https://www.youtube.com/@gdppodcast"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-red-600/15 hover:bg-red-600 text-red-500 hover:text-white flex items-center justify-center transition-colors border border-red-500/25"
                      aria-label="GDP YouTube Channel (@gdppodcast)"
                      title="GDP YouTube Channel (@gdppodcast)"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                    <a
                      href="https://www.instagram.com/gdptalks/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-pink-600/15 hover:bg-pink-600 text-pink-500 hover:text-white flex items-center justify-center transition-colors border border-pink-500/25"
                      aria-label="GDP Talks on Instagram (@gdptalks)"
                      title="GDP Talks on Instagram (@gdptalks)"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/bhavesh-chudasama-48280728"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-blue-600/15 hover:bg-blue-600 text-blue-500 hover:text-white flex items-center justify-center transition-colors border border-blue-500/25"
                      aria-label="Bhavesh J. Chudasama LinkedIn"
                      title="Bhavesh J. Chudasama LinkedIn"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E2761] to-[#0E1326] text-white border border-[#CADCFC]/20 space-y-2 shadow-lg">
              <span className="text-[11px] font-bold text-[#D9A441] uppercase tracking-wider block">
                Bhavesh Chudasama’s Personal Note:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                “Every day you delay starting your podcast, someone with half your experience is taking the stage. Let us handle the cameras, microphones, and editing — you just bring your truth.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
