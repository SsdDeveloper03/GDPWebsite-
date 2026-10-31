import React, { useState } from 'react';
import {
  Sparkles,
  MessageCircle,
  Play,
  CheckCircle2,
  AlertCircle,
  Send,
  Building,
  User,
  Mail,
  Phone,
  BookOpen,
  Briefcase,
  Globe,
  ArrowRight,
} from 'lucide-react';

import { api, ApiError } from '../../services/apiClient';

interface GuestFormData {
  fullName: string;
  companyRole: string;
  email: string;
  phone: string;
  expertiseArea: string;
  topicSummary: string;
  linkedinOrWebsite: string;
  consent: boolean;
  _hp?: string;
}

export const BecomeGuestSection: React.FC = () => {
  const [formData, setFormData] = useState<GuestFormData>({
    fullName: '',
    companyRole: '',
    email: '',
    phone: '',
    expertiseArea: '',
    topicSummary: '',
    linkedinOrWebsite: '',
    consent: false,
    _hp: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate submissions

    setErrorMessage(null);

    // Form validation
    if (
      !formData.fullName.trim() ||
      !formData.companyRole.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.expertiseArea.trim() ||
      !formData.topicSummary.trim()
    ) {
      setErrorMessage('Please complete all required fields (*) marked below.');
      return;
    }

    if (!formData.consent) {
      setErrorMessage('Please check the consent box to proceed.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.submitGuestApplication({
        fullName: formData.fullName.trim(),
        companyRole: formData.companyRole.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        expertiseArea: formData.expertiseArea.trim(),
        topicSummary: formData.topicSummary.trim(),
        linkedinOrWebsite: formData.linkedinOrWebsite.trim() || undefined,
        consent: formData.consent,
        _hp: formData._hp,
      });

      setApplicationId(res.applicationId || null);
      setSubmitted(true);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Unable to connect to the studio server. Please check your connection or contact us via WhatsApp.');
      }
    } finally {
      setLoading(false);
    }
  };

  const createWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Hi Bhavesh, I would like to apply as a guest on GDP Podcast.\n\nName: ${formData.fullName}\nRole/Company: ${formData.companyRole}\nExpertise: ${formData.expertiseArea}\nProposed Topic: ${formData.topicSummary}\nPhone: ${formData.phone}`
    );
    return `https://wa.me/919727001838?text=${text}`;
  };

  return (
    <section id="become-a-guest" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left scroll-mt-20">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-4 mb-16 reveal-on-scroll">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#D9A441]/10 border border-slate-200 dark:border-[#D9A441]/30 text-[#0B1024] dark:text-[#F4CC69] text-xs font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
          <span>GUEST APPLICATION & STORY PROPOSAL</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight font-serif">
          Your Journey Deserves to Be Heard.
        </h2>

        <p className="text-base sm:text-lg text-slate-600 dark:text-[#AAB4CB] leading-relaxed font-light">
          Every founder, professional, and industry expert has lessons worth sharing. Join Growth Ka Digital Partner for a thoughtful conversation about your journey, challenges, insights, and the experiences that shaped your work.
        </p>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CADCFC]/80 italic pt-1">
          Tell us a little about yourself and the conversation you'd love to share.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: 4 Clear Benefits & Reassurance */}
        <div className="lg:col-span-5 space-y-8 reveal-on-scroll">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#121A35]/90 border border-slate-200 dark:border-[#CADCFC]/15 shadow-xl space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-serif">
              Why Join the Conversation?
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-[#C68A27] dark:text-[#D9A441] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Share your expertise and experience
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed font-light">
                    Highlight the strategic principles and specialized insights you have developed over years in your industry.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-[#C68A27] dark:text-[#D9A441] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Tell the story behind your journey
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed font-light">
                    Share the pivotal choices, breakthrough moments, and real setbacks that shaped your enterprise.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-[#C68A27] dark:text-[#D9A441] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Share practical lessons with a wider audience
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed font-light">
                    Inspire Gujarat’s next generation of founders, professionals, and peers through authentic advice.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-[#C68A27] dark:text-[#D9A441] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Take part in a professionally presented conversation
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed font-light">
                    Recorded in our comfortable Surat studio with broadcast condenser mics and cinematic 4K camera angles.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex flex-wrap gap-4">
              <a
                href="#podcasts"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C68A27] dark:text-[#D9A441] hover:underline"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Explore Previous Episodes</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Guest Enquiry Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#121A35]/90 border border-slate-200 dark:border-[#CADCFC]/15 shadow-2xl reveal-on-scroll">
          <div className="space-y-2 mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-serif">
              Guest Proposal & Topic Enquiry
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#CADCFC]">
              Submit your proposed topic below. Bhavesh Chudasama and the GDP production team review every inquiry carefully.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 space-y-4">
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <span>Application Submitted Successfully!</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                Thank you, <strong>{formData.fullName}</strong>. Your guest proposal for <em>"{formData.topicSummary}"</em> has been received by Growth Ka Digital Partner.
              </p>
              {applicationId && (
                <div className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-xs inline-block">
                  Reference ID: <span className="font-bold">{applicationId}</span>
                </div>
              )}
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Our production team reviews incoming applications weekly. If you would like to connect with Bhavesh Sir immediately, you can also send your proposal on WhatsApp.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={createWhatsAppUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Send via WhatsApp to Bhavesh</span>
                </a>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setApplicationId(null);
                    setFormData({
                      fullName: '',
                      companyRole: '',
                      email: '',
                      phone: '',
                      expertiseArea: '',
                      topicSummary: '',
                      linkedinOrWebsite: '',
                      consent: false,
                      _hp: '',
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Submit Another Proposal
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{errorMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setErrorMessage(null)}
                    className="text-xs underline hover:opacity-80"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Row 1: Name and Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Mehta"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0B1024] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#D9A441] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
                    <span>Company / Professional Role *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Founder & MD, Apex Textiles"
                    value={formData.companyRole}
                    onChange={(e) => setFormData({ ...formData, companyRole: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0B1024] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#D9A441] transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Email and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="anand@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0B1024] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#D9A441] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
                    <span>Phone / WhatsApp *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0B1024] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#D9A441] transition-colors"
                  />
                </div>
              </div>

              {/* Row 3: Area of Expertise */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
                  <span>Area of Expertise / Industry *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manufacturing, Healthcare, Real Estate, Legal & Finance, Technology"
                  value={formData.expertiseArea}
                  onChange={(e) => setFormData({ ...formData, expertiseArea: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0B1024] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#D9A441] transition-colors"
                />
              </div>

              {/* Row 4: Proposed Conversation Topic */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
                  <span>Proposed Conversation Topic & Core Story *</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us briefly about the primary insights, milestones, or lessons you would like to discuss..."
                  value={formData.topicSummary}
                  onChange={(e) => setFormData({ ...formData, topicSummary: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0B1024] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#D9A441] transition-colors resize-none"
                />
              </div>

              {/* Row 5: Optional Website or LinkedIn */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
                  <span>Website or LinkedIn Profile (Optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile or company website"
                  value={formData.linkedinOrWebsite}
                  onChange={(e) => setFormData({ ...formData, linkedinOrWebsite: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0B1024] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#D9A441] transition-colors"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="w-4 h-4 rounded mt-0.5 text-[#D9A441] border-slate-300 focus:ring-[#D9A441] cursor-pointer"
                  />
                  <span>
                    I agree to be contacted by Growth Ka Digital Partner regarding this podcast enquiry. *
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-sm text-[#0B1024] bg-gradient-to-r from-[#F4CC69] via-[#D9A441] to-[#C68A27] hover:opacity-95 shadow-lg shadow-[#D9A441]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Submitting Application to Studio...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Apply to Be a Guest on GDP Podcast</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center pt-1">
                * Note: Submissions are reviewed directly by the GDP production team. No spam or commercial selling.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
