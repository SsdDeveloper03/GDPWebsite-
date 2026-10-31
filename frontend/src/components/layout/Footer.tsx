import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle, Briefcase, ExternalLink } from 'lucide-react';
import { GDP_CONTACT_INFO } from '../../data/mockData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050810] border-t border-[#CADCFC]/15 text-left text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Column 1: Brand Wordmark & Vision */}
          <div className="lg:col-span-5 space-y-5">
            <Link
              to="/"
              className="inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E9B13F] rounded-xl"
            >
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#070E22] border border-[#CADCFC]/20 shadow-lg flex items-center justify-center p-0.5 group-hover:scale-105 group-hover:border-[#D9A441]/50 transition-all duration-300 shrink-0">
                <img
                  src="/gdp-emblem.png"
                  alt="Growth Ka Digital Partner Mic Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col text-left leading-none space-y-1">
                <div className="text-xl font-black tracking-tight font-sans text-white group-hover:text-[#F4CC69] transition-colors">
                  <span>Growth </span>
                  <span className="text-[#38BDF8]">Ka</span>
                </div>
                <div className="text-sm font-extrabold tracking-wide font-sans text-[#E9B13F]">
                  <span>Digital Partner</span>
                </div>
                <span className="text-[11px] text-[#CADCFC]/70 font-mono tracking-wider pt-0.5">
                  CONVERSATIONS THAT DRIVE GROWTH
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              We turn the hard-won expertise of Gujarat’s business owners, doctors, and professionals into an authoritative personal brand — one strategic podcast conversation at a time.
            </p>

            {/* Verified Social Media Channels */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase block">
                Official Channels &amp; Profiles:
              </span>
              <div className="flex items-center gap-2.5">
                {/* YouTube */}
                <a
                  href={GDP_CONTACT_INFO.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#121936] hover:bg-red-600/20 text-slate-300 hover:text-red-400 flex items-center justify-center border border-[#CADCFC]/15 hover:border-red-500/50 transition-all duration-200 shadow-sm group"
                  aria-label="GDP YouTube Channel (@gdppodcast)"
                  title="GDP YouTube Channel (@gdppodcast)"
                >
                  <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href={GDP_CONTACT_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#121936] hover:bg-pink-600/20 text-slate-300 hover:text-pink-400 flex items-center justify-center border border-[#CADCFC]/15 hover:border-pink-500/50 transition-all duration-200 shadow-sm group"
                  aria-label="GDP Instagram (@gdptalks)"
                  title="GDP Instagram (@gdptalks)"
                >
                  <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href={GDP_CONTACT_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#121936] hover:bg-blue-600/20 text-slate-300 hover:text-blue-400 flex items-center justify-center border border-[#CADCFC]/15 hover:border-blue-500/50 transition-all duration-200 shadow-sm group"
                  aria-label="Bhavesh J. Chudasama LinkedIn"
                  title="Bhavesh J. Chudasama LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>

                {/* Founder Portfolio */}
                <a
                  href={GDP_CONTACT_INFO.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#121936] hover:bg-[#D9A441]/20 text-slate-300 hover:text-[#F2C94C] flex items-center justify-center border border-[#CADCFC]/15 hover:border-[#D9A441]/50 transition-all duration-200 shadow-sm group"
                  aria-label="Bhavesh J. Chudasama Personal Portfolio"
                  title="Explore My Journey (Bhavesh J. Chudasama Portfolio)"
                >
                  <Briefcase className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>

                {/* WhatsApp */}
                <a
                  href={GDP_CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#121936] hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-400 flex items-center justify-center border border-[#CADCFC]/15 hover:border-emerald-500/50 transition-all duration-200 shadow-sm group"
                  aria-label="Chat on WhatsApp"
                  title="WhatsApp Direct Contact"
                >
                  <MessageCircle className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block font-serif">
              Explore GDP
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-slate-400 hover:text-[#E9B13F] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-[#E9B13F] transition-colors">
                  About &amp; Founder Story
                </Link>
              </li>
              <li>
                <a
                  href={GDP_CONTACT_INFO.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F2C94C] hover:text-white transition-colors flex items-center gap-1 font-semibold"
                >
                  <span>Explore My Journey</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link to="/services" className="text-slate-400 hover:text-[#E9B13F] transition-colors">
                  Production Services
                </Link>
              </li>
              <li>
                <a href="/#our-process" className="text-slate-400 hover:text-[#E9B13F] transition-colors">
                  Our 3-Step Process
                </a>
              </li>
              <li>
                <a
                  href={GDP_CONTACT_INFO.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <span>YouTube Channel (@gdppodcast)</span>
                  <ExternalLink className="w-3 h-3 text-red-500/70" />
                </a>
              </li>
              <li>
                <a
                  href={GDP_CONTACT_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-pink-400 transition-colors flex items-center gap-1"
                >
                  <span>Instagram (@gdptalks)</span>
                  <ExternalLink className="w-3 h-3 text-pink-500/70" />
                </a>
              </li>
              <li>
                <a
                  href={GDP_CONTACT_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <span>LinkedIn (Bhavesh Chudasama)</span>
                  <ExternalLink className="w-3 h-3 text-blue-500/70" />
                </a>
              </li>
              <li>
                <Link to="/reviews" className="text-slate-400 hover:text-[#E9B13F] transition-colors">
                  Reviews &amp; Ratings (4.9 ★)
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-[#E9B13F] transition-colors">
                  Contact Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Verified Contact & Studio Details */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block font-serif">
              Studio Coordinates
            </span>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D9A441] shrink-0 mt-0.5" />
                <span className="text-slate-300">Surat, Gujarat, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D9A441] shrink-0" />
                <a
                  href={`mailto:${GDP_CONTACT_INFO.email}`}
                  className="text-slate-300 hover:text-[#D9A441] transition-colors"
                >
                  {GDP_CONTACT_INFO.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D9A441] shrink-0" />
                <a
                  href={`tel:${GDP_CONTACT_INFO.phone}`}
                  className="text-slate-300 hover:text-[#D9A441] transition-colors"
                >
                  {GDP_CONTACT_INFO.phoneFormatted}
                </a>
              </div>
              <div className="pt-2">
                <a
                  href={GDP_CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[11px] hover:bg-emerald-500/25 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp ‘PODCAST’</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Growth Ka Digital Partner (GDP). All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted for Bhavesh J. Chudasama (Founder &amp; CEO – Sunrise Software Development) in Surat, Gujarat</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
