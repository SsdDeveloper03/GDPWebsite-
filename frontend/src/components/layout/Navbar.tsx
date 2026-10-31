import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { GDP_CONTACT_INFO } from '../../data/mockData';
import { ThemeToggle } from '../common/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { useReviews } from '../../context/ReviewsContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isDark } = useTheme();
  const { ratingSummary } = useReviews();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change or Escape key
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Meet The Host', path: '/#meet-the-host' },
    { label: 'Why Podcasting', path: '/#why-podcasting' },
    { label: 'Our Process', path: '/#our-process' },
    { label: 'Episodes', path: '/podcast' },
    { label: 'Reviews', path: '/reviews', badge: `${ratingSummary.average} ★` },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string, e: React.MouseEvent) => {
    if (path.startsWith('/#')) {
      const targetId = path.replace('/#', '');
      if (location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' && !location.hash;
    if (path.startsWith('/#')) return location.hash === path.replace('/', '');
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  const isDarkHeader = isDark || (!isScrolled && location.pathname === '/');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? isDark
            ? 'bg-[#10172E]/95 backdrop-blur-xl border-b border-[#CADCFC]/15 shadow-2xl py-3'
            : 'bg-[#F7F4ED]/95 backdrop-blur-xl border-b border-slate-200/90 shadow-md py-3'
          : isDarkHeader
          ? 'bg-transparent py-4 sm:py-5'
          : 'bg-[#F7F4ED]/80 backdrop-blur-md border-b border-slate-200/60 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Official Mic Emblem + Bold Written Brand Name */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E9B13F] rounded-xl transition-all"
            aria-label="Growth Ka Digital Partner - Home"
          >
            {/* The Left-Side Mic Emblem */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-gradient-to-br from-[#0c152c] to-[#040814] border border-[#CADCFC]/25 shadow-md flex items-center justify-center p-1 group-hover:scale-105 group-hover:border-[#E9B13F]/60 transition-all duration-300 shrink-0">
              <img
                src="/gdp-emblem.png"
                alt="Growth Ka Digital Partner Mic Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Written Brand Typography: Bold, Prominent, Matching Reference Hierarchy */}
            <div className="flex flex-col text-left leading-none space-y-0.5">
              <div className="text-base sm:text-lg lg:text-[19px] font-black tracking-tight font-sans">
                <span className={isDarkHeader ? 'text-white' : 'text-slate-900'}>Growth </span>
                <span className="text-[#38BDF8]">Ka</span>
              </div>
              <div className="text-xs sm:text-sm lg:text-[13.5px] font-extrabold tracking-wide font-sans">
                <span className="text-[#E9B13F]">Digital </span>
                <span className={isDarkHeader ? 'text-slate-200' : 'text-slate-700'}>Partner</span>
              </div>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links (No wrapping, animated underline, consistent spacing) */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-5 whitespace-nowrap">
            {navLinks.map((item) => {
              const active = isActive(item.path);
              return (
                <a
                  key={item.label}
                  href={item.path}
                  onClick={(e) => handleNavClick(item.path, e)}
                  className={`relative py-1 text-[12px] xl:text-[13.5px] font-medium tracking-normal transition-colors duration-200 cursor-pointer flex items-center gap-1.5 nav-underline ${
                    active
                      ? isDarkHeader
                        ? 'text-[#E9B13F] font-semibold active'
                        : 'text-[#C68A27] font-semibold active'
                      : isDarkHeader
                      ? 'text-[#CADCFC]/80 hover:text-white'
                      : 'text-slate-600 hover:text-[#10172E]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold border ${
                        isDarkHeader
                          ? 'bg-[#E9B13F]/20 text-[#E9B13F] border-[#E9B13F]/35'
                          : 'bg-[#C68A27]/10 text-[#C68A27] border-[#C68A27]/25'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right: Theme Toggle & Book a Discovery Call CTA */}
          <div className="hidden md:flex items-center gap-3 shrink-0 whitespace-nowrap">
            {/* 3-Theme Selector */}
            <ThemeToggle />

            {/* Gold "Become a Guest ↗" CTA */}
            <a
              href={location.pathname === '/' ? '#become-a-guest' : '/#become-a-guest'}
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  const el = document.getElementById('become-a-guest');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="relative group overflow-hidden px-4.5 py-2.5 rounded-xl font-bold text-xs text-[#0B1024] bg-gradient-to-r from-[#F4CC69] via-[#D9A441] to-[#C68A27] hover:opacity-95 shadow-lg shadow-[#D9A441]/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Become a Guest</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Trigger & Theme Toggle */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E9B13F] transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#151D38]/80 text-white border-[#CADCFC]/20 hover:border-[#E9B13F]/50'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 shadow-sm'
              }`}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#E9B13F]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Accessible Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
          className={`lg:hidden fixed inset-x-0 top-[64px] sm:top-[72px] bottom-0 backdrop-blur-2xl border-b shadow-2xl p-6 overflow-y-auto transition-all duration-300 text-left ${
            isDark
              ? 'bg-[#10172E]/98 border-[#CADCFC]/20 text-slate-100'
              : 'bg-[#F7F4ED]/98 border-slate-200 text-slate-900 shadow-xl'
          }`}
        >
          <div className="flex flex-col space-y-2 max-w-md mx-auto">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.path}
                onClick={(e) => {
                  handleNavClick(item.path, e);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? isDark
                      ? 'bg-[#E9B13F]/15 text-[#E9B13F] border border-[#E9B13F]/30 font-semibold'
                      : 'bg-[#C68A27]/15 text-[#8c6008] border border-[#C68A27]/30 font-semibold'
                    : isDark
                    ? 'text-slate-200 hover:bg-white/5 hover:text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-black'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                      isDark
                        ? 'bg-[#E9B13F]/20 text-[#E9B13F] border-[#E9B13F]/30'
                        : 'bg-[#C68A27]/15 text-[#8c6008] border-[#C68A27]/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </a>
            ))}

            <div className="pt-4 border-t border-slate-200/20 space-y-3">
              <a
                href={location.pathname === '/' ? '#become-a-guest' : '/#become-a-guest'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm text-[#0B1024] bg-gradient-to-r from-[#F4CC69] via-[#D9A441] to-[#C68A27] shadow-md shadow-[#D9A441]/30"
              >
                <span>Become a Guest</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href={GDP_CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-colors"
              >
                <span>WhatsApp: {GDP_CONTACT_INFO.phoneFormatted}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              {/* Social Channels in Mobile Menu */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <a
                  href="https://www.youtube.com/@gdppodcast"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white flex items-center justify-center border border-red-500/30 transition-colors"
                  aria-label="YouTube (@gdppodcast)"
                  title="YouTube (@gdppodcast)"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/gdptalks/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-pink-600/20 hover:bg-pink-600 text-pink-400 hover:text-white flex items-center justify-center border border-pink-500/30 transition-colors"
                  aria-label="Instagram (@gdptalks)"
                  title="Instagram (@gdptalks)"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/bhavesh-chudasama-48280728"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white flex items-center justify-center border border-blue-500/30 transition-colors"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>

              <div
                className={`flex items-center justify-center gap-4 pt-2 text-xs ${
                  isDark ? 'text-[#CADCFC]' : 'text-slate-500'
                }`}
              >
                <span>Surat, Gujarat</span>
                <span>•</span>
                <span>Broadcast 4K Studio</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
