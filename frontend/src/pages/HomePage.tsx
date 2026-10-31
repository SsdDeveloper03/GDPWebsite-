import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Play,
  CheckCircle,
  ArrowUpRight,
  ChevronRight,
  Clock,
  Mic,
  Video,
  Repeat,
  Compass,
} from 'lucide-react';
import { GDP_CONTACT_INFO, GDP_SERVICES, GDP_VIDEOS } from '../data/mockData';
import { api, type ApiEpisode } from '../services/apiClient';
import { useReviews } from '../context/ReviewsContext';
import { VideoModal } from '../components/common/VideoModal';
import { ReviewModal } from '../components/common/ReviewModal';
import { useScrollReveal } from '../hooks/useScrollReveal';

// Reusable Section Components
import { TrustStrip } from '../components/sections/TrustStrip';
import { BenefitsSection } from '../components/sections/BenefitsSection';
import { WhyBeAGuestSection } from '../components/sections/WhyBeAGuestSection';
import { AudienceSection } from '../components/sections/AudienceSection';
import { MeetTheHostSection } from '../components/sections/MeetTheHostSection';
import { LessonsSection } from '../components/sections/LessonsSection';
import { ProcessSection } from '../components/sections/ProcessSection';
import { HonestPositioningSection } from '../components/sections/HonestPositioningSection';
import { BecomeGuestSection } from '../components/sections/BecomeGuestSection';
import { ReviewsShowcaseSection } from '../components/sections/ReviewsShowcaseSection';
import { ClosingConversionSection } from '../components/sections/ClosingConversionSection';
import { ContactConversionSection } from '../components/sections/ContactConversionSection';

import type { Video as VideoType } from '../types';

export const HomePage: React.FC = () => {
  useScrollReveal();
  const { addReview } = useReviews();
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [videos, setVideos] = useState<VideoType[]>(GDP_VIDEOS);
  const [videosLoading, setVideosLoading] = useState<boolean>(false);

  React.useEffect(() => {
    let isMounted = true;
    api.getEpisodes()
      .then((res) => {
        if (isMounted && res.success) {
          if (res.data && res.data.length > 0) {
            const mapped: VideoType[] = res.data.map((ep: ApiEpisode) => ({
              id: ep.id,
              title: ep.title,
              description: ep.description || '',
              youtubeVideoId: ep.youtubeVideoId,
              thumbnailUrl: ep.thumbnailUrl || `https://img.youtube.com/vi/${ep.youtubeVideoId}/maxresdefault.jpg`,
              duration: 'Full Episode',
              category: ep.category || 'General',
              publishedDate: ep.publishedAt
                ? new Date(ep.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'GDP Talks',
              views: 'GDP Talks',
              featured: ep.isFeatured,
            }));
            setVideos(mapped);
          } else {
            setVideos(GDP_VIDEOS);
          }
        }
      })
      .catch((err) => {
        console.warn('Could not load episodes from API on HomePage, using verified offline catalog:', err);
        if (isMounted) setVideos(GDP_VIDEOS);
      })
      .finally(() => {
        if (isMounted) setVideosLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePlayVideo = (vid: VideoType) => {
    setSelectedVideo(vid);
    setVideoModalOpen(true);
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Video':
        return <Video className="w-6 h-6 text-[#E9B13F]" />;
      case 'Repeat':
        return <Repeat className="w-6 h-6 text-[#E9B13F]" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-[#CADCFC]" />;
      default:
        return <Mic className="w-6 h-6 text-[#E9B13F]" />;
    }
  };

  return (
    <div className="pb-16 space-y-20 sm:space-y-28 transition-colors duration-300">
      {/* =========================================================================
          1. REBUILT EDITORIAL HERO SECTION (BALANCED TWO-COLUMN DESKTOP LAYOUT)
          ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-[#10172E] text-white pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 min-h-[calc(100vh-80px)] flex flex-col justify-between isolate">
        {/* Subtle Ambient Studio Lighting Glows */}
        <div className="absolute top-1/4 -left-20 w-[500px] h-[400px] bg-[#1E2761]/35 blur-[140px] rounded-full pointer-events-none z-0" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[350px] bg-[#E9B13F]/10 blur-[130px] rounded-full pointer-events-none z-0" />

        {/* Main Two-Column Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* -------------------------------------------------------------
                LEFT COLUMN: Editorial Headline, Copy & Conversion CTAs
                ------------------------------------------------------------- */}
            <div className="lg:col-span-7 space-y-6 text-left max-w-2xl">
              
              {/* Eyebrow Tag (Animated delay 1) */}
              <div className="animate-hero-1 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#E9B13F]/10 border border-[#E9B13F]/30 text-[#E9B13F] text-xs font-semibold tracking-[0.2em] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#E9B13F] animate-pulse" />
                <span>YOUR EXPERTISE. YOUR VOICE. YOUR LEGACY.</span>
              </div>

              {/* Large Editorial Headline (Animated delay 2) */}
              <h1 className="animate-hero-2 text-4xl sm:text-5xl lg:text-[54px] font-black text-white tracking-tight leading-[1.12] font-serif">
                Every Expert Has a<br className="hidden sm:inline" />
                <span className="text-[#E9B13F] underline decoration-[#E9B13F]/40 underline-offset-8"> Story Worth Hearing.</span>
              </h1>

              {/* Supporting Copy (Animated delay 3) */}
              <p className="animate-hero-3 text-base sm:text-lg lg:text-xl text-[#CADCFC]/90 font-light leading-relaxed">
                Real conversations with the people building businesses, shaping industries, and inspiring change.
              </p>

              {/* Hindi Connection Note */}
              <p className="animate-hero-3 text-xs sm:text-sm text-[#CADCFC]/75 italic font-light">
                बातचीत जो सोच को नई दिशा दे — आपके अनुभव और सीख को एक lasting impact में बदलते हैं।
              </p>

              {/* CTAs (Animated delay 4) */}
              <div className="animate-hero-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                {/* Primary CTA */}
                <a
                  href="#become-a-guest"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('become-a-guest')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-7 py-4 rounded-xl font-bold text-sm text-[#10172E] bg-gradient-to-r from-[#F2C45F] via-[#E9B13F] to-[#D8982D] hover:opacity-95 shadow-xl shadow-[#E9B13F]/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mic className="w-4 h-4 fill-current text-[#10172E]" />
                  <span>Become a Guest ↗</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                {/* Secondary CTA: Watch Conversations */}
                <a
                  href="#podcasts"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('podcasts')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-4 rounded-xl font-bold text-sm text-white bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-[#E9B13F]/50 shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current text-[#E9B13F]" />
                  <span>Watch Conversations</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </a>
              </div>

              {/* Follow & Watch Channels Strip (Home Screen) */}
              <div className="animate-hero-3 pt-2 pb-1 flex flex-wrap items-center gap-2.5 sm:gap-3">
                <span className="text-[11px] font-mono tracking-wider uppercase text-[#CADCFC]/80 font-medium">
                  Watch &amp; Follow:
                </span>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@gdppodcast"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/15 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 hover:border-red-500 text-xs font-semibold transition-all duration-200 shadow-sm group"
                  aria-label="GDP Podcast YouTube Channel (@gdppodcast)"
                  title="GDP Podcast YouTube Channel (@gdppodcast)"
                >
                  <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>@gdppodcast</span>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/gdptalks/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600/15 hover:bg-gradient-to-r hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] text-pink-300 hover:text-white border border-pink-500/30 hover:border-pink-500 text-xs font-semibold transition-all duration-200 shadow-sm group"
                  aria-label="GDP Talks Instagram (@gdptalks)"
                  title="GDP Talks Instagram (@gdptalks)"
                >
                  <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>@gdptalks</span>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/bhavesh-chudasama-48280728"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/15 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 hover:border-blue-500 text-xs font-semibold transition-all duration-200 shadow-sm group"
                  aria-label="Bhavesh J. Chudasama on LinkedIn"
                  title="Bhavesh J. Chudasama LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>

              {/* Small Trust Line */}
              <p className="animate-hero-4 text-xs text-[#CADCFC]/80 font-mono tracking-wider pt-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E9B13F]" />
                <span>Real People. Honest Conversations. Lasting Impact.</span>
              </p>

              {/* Reassurance Micro-Pillars */}
              <div className="animate-hero-4 pt-3 flex flex-wrap items-center gap-5 text-xs text-[#CADCFC]/90 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Mic className="w-3.5 h-3.5 text-[#E9B13F]" />
                  <span>Broadcast Condenser Mics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#E9B13F]" />
                  <span>Surat 4K Studio Setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#E9B13F]" />
                  <span>Turnkey Video & Reels</span>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------
                RIGHT COLUMN: Art-Directed Founder Studio Portrait (No Stretching)
                ------------------------------------------------------------- */}
            <div className="lg:col-span-5 relative flex items-center justify-center animate-hero-image">
              <div className="relative w-full max-w-md aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/15 dark:border-[#CADCFC]/20 bg-[#151D38] group">
                
                {/* Founder Photograph with Natural Proportions */}
                <img
                  src="/bhavesh-chudasama-podcast.jpg"
                  alt="Bhavesh Chudasama in GDP Podcast Studio with Broadcast Microphone"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: '70% 18%' }}
                />

                {/* Subtle Layered Gradients to dissolve into Deep Navy */}
                <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#10172E] via-[#10172E]/60 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#10172E]/40 to-transparent pointer-events-none hidden sm:block" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />

                {/* Floating Studio Sound Waveform Badge (Req 7.5) */}
                <div className="absolute bottom-5 left-5 right-5 p-3.5 rounded-2xl bg-[#10172E]/90 backdrop-blur-md border border-white/15 text-left shadow-2xl flex items-center justify-between z-10 transition-transform group-hover:translate-y-[-2px]">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#E9B13F] tracking-widest uppercase">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span>LIVE STUDIO SESSIONS</span>
                    </div>
                    <div className="text-xs font-semibold text-white">
                      Bhavesh J. Chudasama · Sunrise Software Development
                    </div>
                  </div>

                  {/* Delicate Animated Audio Waveform */}
                  <div
                    className="flex items-end gap-1 h-6 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10"
                    aria-label="Audio level indicator"
                  >
                    <span className="w-1 bg-[#E9B13F] rounded-full audio-bar-1" />
                    <span className="w-1 bg-[#E9B13F] rounded-full audio-bar-2" />
                    <span className="w-1 bg-[#E9B13F] rounded-full audio-bar-3" />
                    <span className="w-1 bg-[#E9B13F] rounded-full audio-bar-4" />
                    <span className="w-1 bg-[#E9B13F] rounded-full audio-bar-2" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Hero Status Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 pt-8">
          <div className="border-t border-white/15 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono uppercase tracking-[2px] text-[#CADCFC]/70">
            <span>SURAT, GUJARAT · STORIES WITHOUT BOUNDARIES</span>
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Quick Social Channels */}
              <div className="flex items-center gap-2 border-r border-white/15 pr-3 sm:pr-4">
                <a
                  href="https://www.youtube.com/@gdppodcast"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="YouTube (@gdppodcast)"
                  title="YouTube (@gdppodcast)"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/gdptalks/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-pink-600/20 hover:bg-pink-600 text-pink-400 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Instagram (@gdptalks)"
                  title="Instagram (@gdptalks)"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/bhavesh-chudasama-48280728"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>

              <a
                href="https://share.google/mN8Hwet0sf0dFvcgx"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white text-[#F2C94C] transition-colors flex items-center gap-1 font-semibold"
              >
                <span>FOUNDER PORTFOLIO ↗</span>
              </a>
              <a
                href="#meet-the-host"
                className="hover:text-[#E9B13F] transition-colors flex items-center gap-1.5 font-semibold cursor-pointer"
              >
                <span>MEET THE HOST</span>
                <span>↓</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. TRUST & CREDIBILITY STRIP (SECTION 4)
          ========================================================================= */}
      <TrustStrip />

      {/* =========================================================================
          3. WHY PODCASTING? (SECTION 5)
          ========================================================================= */}
      <BenefitsSection />

      {/* =========================================================================
          4. WHY BE A GUEST? (SECTION 11 - 3-STEP HORIZONTAL/VERTICAL TIMELINE)
          ========================================================================= */}
      <WhyBeAGuestSection />

      {/* =========================================================================
          5. WHO IS THIS FOR? (SECTION 6)
          ========================================================================= */}
      <AudienceSection />

      {/* =========================================================================
          5. MEET THE HOST: EVERY GREAT BUSINESS HAS A STORY
          ========================================================================= */}
      <MeetTheHostSection />

      {/* =========================================================================
          6. OUR SERVICES OVERVIEW & PRODUCTION CAPABILITIES
          ========================================================================= */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-4 border-b border-slate-200/80 dark:border-white/10">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs sm:text-sm font-bold tracking-[0.22em] text-[#C68A27] dark:text-[#E9B13F] uppercase">
              STUDIO CAPABILITIES
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white font-serif leading-tight">
              Turnkey Production for Leaders
            </h2>
            <p className="text-sm text-slate-600 dark:text-[#CADCFC]/85 leading-relaxed font-light">
              From 4K multi-camera studio recording in Surat to high-retention vertical reels and executive personal branding.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-white hover:text-[#C68A27] dark:hover:text-[#E9B13F] border-b-2 border-[#C68A27] dark:border-[#E9B13F] pb-1 transition-colors"
          >
            <span>Explore All Deliverables</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {GDP_SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="p-7 rounded-2xl bg-white dark:bg-[#151D38]/90 border border-slate-200 dark:border-[#CADCFC]/15 hover:border-[#C68A27]/50 dark:hover:border-[#E9B13F]/50 shadow-md hover:shadow-xl dark:shadow-none dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#10172E] border border-slate-200 dark:border-[#CADCFC]/20 flex items-center justify-center">
                  {getServiceIcon(srv.iconName)}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#C68A27] dark:text-[#E9B13F] uppercase tracking-wider block">
                    {srv.tag}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif mt-1">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-light">
                    {srv.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-white/5">
                  {srv.deliverables.slice(0, 3).map((item) => (
                    <div key={item} className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-[#CADCFC]/90">
                      <CheckCircle className="w-3 h-3 text-[#E9B13F] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {srv.subtitle}
                </span>
                <Link
                  to="/services"
                  className="text-xs font-bold text-[#C68A27] dark:text-[#E9B13F] hover:underline flex items-center gap-1"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. HOW WE WORK: 3-STEP PROCESS (SECTION 9)
          ========================================================================= */}
      <ProcessSection />

      {/* =========================================================================
          8. HONEST POSITIONING (SECTION 10)
          ========================================================================= */}
      <HonestPositioningSection />

      {/* =========================================================================
          9. FEATURED PODCAST & YOUTUBE SHOWCASE (SECTION 11)
          ========================================================================= */}
      <section id="podcasts" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left scroll-mt-20">
        <div id="episodes" className="scroll-mt-20" />

        {/* Section Intro: GDP PODCAST & Hindi Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 reveal-on-scroll">
          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-bold tracking-[0.22em] text-[#C68A27] dark:text-[#E9B13F] uppercase">
              GDP PODCAST
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white font-serif leading-tight">
              <span className="block">बातचीत जो सोच को नई दिशा दे।</span>
              <span className="block text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1E2761] via-[#C68A27] to-[#B8860B] dark:from-white dark:via-[#F2C94C] dark:to-[#D9A441] mt-1.5 font-sans">
                Conversations That Give Thought A New Direction.
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={GDP_CONTACT_INFO.youtube}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-white hover:text-red-600 dark:hover:text-red-400 border-b-2 border-[#C68A27] dark:border-[#E9B13F] pb-1 transition-colors group"
            >
              <svg className="w-5 h-5 text-red-600 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>चैनल subscribe करें</span>
              <ArrowUpRight className="w-4 h-4 text-[#C68A27] dark:text-[#E9B13F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <Link
              to="/podcast"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-semibold border border-slate-200 dark:border-white/10 transition-colors"
            >
              <span>All Episodes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Slim Gold Editorial Divider Line */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D9A441]/50 to-transparent mb-10" />

        {/* Featured Podcast Banner Hero Card */}
        <div className="reveal-on-scroll relative rounded-3xl overflow-hidden bg-[#10172E] text-white shadow-2xl min-h-[380px] sm:min-h-[420px] flex items-end sm:items-center p-6 sm:p-12 mb-10 group border border-slate-200/20 dark:border-[#CADCFC]/15">
          {/* Background Image of Studio Microphone */}
          <img
            src="/podcast-studio-banner.webp"
            alt="गर्म रोशनी वाला पेशेवर पॉडकास्ट स्टूडियो"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-65 group-hover:scale-105 transition-transform duration-700"
          />
          {/* Studio Gradient Overlay for Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#10172E]/95 via-[#10172E]/75 to-transparent pointer-events-none" />

          {/* Golden Circular Play Button */}
          <button
            onClick={() => videos.length > 0 && handlePlayVideo(videos[0])}
            aria-label="Play Master Episode"
            className="absolute right-6 top-6 sm:top-[45%] sm:left-[70%] sm:right-auto sm:-translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E9B13F] hover:bg-[#F2C45F] text-[#10172E] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform cursor-pointer z-10"
          >
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current translate-x-0.5" />
          </button>

          {/* Banner Editorial Copy */}
          <div className="relative z-10 max-w-xl space-y-3 sm:space-y-4 text-left">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#E9B13F] uppercase block">
              WATCH · LISTEN · GROW
            </span>

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-serif leading-tight">
              कहानियाँ असली।<br />सीख सबके लिए।
              <span className="block text-sm sm:text-base font-medium text-slate-300 font-sans mt-1.5 tracking-normal">
                Real Stories. Lessons for Everyone.
              </span>
            </h3>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="https://www.youtube.com/@gdppodcast/videos"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/90 hover:text-[#F2C45F] transition-colors"
              >
                <span>हमारे latest episodes YouTube पर देखें</span>
                <ArrowUpRight className="w-4 h-4 text-[#E9B13F]" />
              </a>

              <button
                onClick={() => videos.length > 0 && handlePlayVideo(videos[0])}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-semibold text-white border border-white/20 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#E9B13F]" />
                <span>Play Master Episode</span>
              </button>
            </div>
          </div>
        </div>

        {/* Featured Episode Showcase or Empty State */}
        {videos.length === 0 && !videosLoading ? (
          <div className="reveal-on-scroll rounded-3xl p-8 sm:p-12 bg-white dark:bg-[#121936]/90 border border-slate-200 dark:border-[#CADCFC]/20 text-center space-y-4 mb-8 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-[#E9B13F]/10 text-[#C68A27] dark:text-[#E9B13F] flex items-center justify-center mx-auto">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              Studio Broadcasts in Production
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#CADCFC]/80 max-w-md mx-auto leading-relaxed">
              New business masterclasses and conversations are currently being recorded. Apply now to share your journey on the GDP Podcast.
            </p>
            <div className="pt-2">
              <a
                href="#become-a-guest"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-[#10172E] bg-[#E9B13F] hover:bg-[#F2C45F] shadow transition-all"
              >
                <span>Become a Guest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : videos.length > 0 ? (
          <div
            onClick={() => handlePlayVideo(videos[0])}
            className="reveal-on-scroll group cursor-pointer rounded-3xl overflow-hidden bg-white dark:bg-[#121936]/90 hover:bg-slate-50 dark:hover:bg-[#161F42] border-2 border-slate-200 dark:border-[#CADCFC]/20 hover:border-[#C68A27]/60 dark:hover:border-[#E9B13F]/60 shadow-lg hover:shadow-2xl transition-all duration-300 mb-8 p-6 sm:p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              {/* Left: 16:9 Thumbnail with Overlay & Play Trigger */}
              <div className="lg:col-span-7 relative aspect-video w-full rounded-2xl overflow-hidden bg-black/40">
                <img
                  src={videos[0].thumbnailUrl}
                  alt={videos[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:bg-black/20 transition-colors" />

                {/* Centered Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E9B13F] text-[#10172E] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current translate-x-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-md bg-black/85 backdrop-blur-sm text-xs font-mono text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#E9B13F]" />
                  <span>{videos[0].duration}</span>
                </div>

                {/* Top Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#10172E]/90 backdrop-blur-md border border-white/20 text-[10px] font-bold text-[#E9B13F] tracking-wider uppercase">
                  FLAGSHIP MASTERCLASS · EPISODE 01
                </div>
              </div>

              {/* Right: Editorial Information & Play CTA */}
              <div className="lg:col-span-5 space-y-4 text-left">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C68A27] dark:text-[#E9B13F] uppercase tracking-wider">
                  <span>{videos[0].category}</span>
                  <span className="text-slate-400 dark:text-slate-500">•</span>
                  <span>{videos[0].publishedDate}</span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white font-serif group-hover:text-[#C68A27] dark:group-hover:text-[#F2C45F] transition-colors leading-snug">
                  {videos[0].title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light line-clamp-3">
                  {videos[0].description}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E9B13F] text-[#10172E] font-bold text-xs shadow group-hover:bg-[#F2C45F] transition-all">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Master Episode ({videos[0].duration})</span>
                  </span>
                  <span className="text-xs font-semibold text-[#C68A27] dark:text-[#E9B13F] group-hover:underline flex items-center gap-1">
                    <span>Full Transcript & Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Remaining Verified Episodes Grid (2-Column Balanced) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {videos.slice(1, 3).map((vid, idx) => (
            <div
              key={vid.id}
              onClick={() => handlePlayVideo(vid)}
              className={`reveal-on-scroll reveal-stagger-${idx + 1} group cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-[#151D38]/90 hover:bg-slate-50 dark:hover:bg-[#1C2649] border border-slate-200 dark:border-[#CADCFC]/15 hover:border-[#C68A27]/50 dark:hover:border-[#E9B13F]/50 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                <img
                  src={vid.thumbnailUrl}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#E9B13F] text-[#10172E] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </div>
                </div>

                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[11px] font-mono text-white flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#E9B13F]" />
                  <span>{vid.duration}</span>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#C68A27] dark:text-[#E9B13F] font-bold tracking-wider">
                    <span>{vid.category}</span>
                    <span className="text-slate-400 dark:text-slate-500 font-mono font-normal text-[10px]">{vid.publishedDate}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#C68A27] dark:group-hover:text-[#F2C45F] transition-colors line-clamp-2 leading-snug font-serif">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-light">
                    {vid.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-[#C68A27] dark:text-[#E9B13F] font-semibold">
                  <span>Watch Episode</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-slate-200/60 dark:border-white/5">
          <Link
            to="/podcast"
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-[#10172E] bg-[#E9B13F] hover:bg-[#F2C45F] shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>View All Episodes & Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <a
            href={GDP_CONTACT_INFO.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-800 dark:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-red-600 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>Subscribe @gdppodcast on YouTube</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <a
            href={GDP_CONTACT_INFO.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-800 dark:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-pink-500 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>Follow @gdptalks on Instagram</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <a
            href={GDP_CONTACT_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-800 dark:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            <span>Connect on LinkedIn</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* =========================================================================
          10. LESSONS FROM CONVERSATIONS (REQUIREMENT 6)
          ========================================================================= */}
      <LessonsSection onPlayVideo={handlePlayVideo} />

      {/* =========================================================================
          11. BECOME A PODCAST GUEST & GUEST ENQUIRY FORM (SECTIONS 9 & 10)
          ========================================================================= */}
      <BecomeGuestSection />

      {/* =========================================================================
          12. TRUSTED CONVERSATIONS & TESTIMONIALS CAROUSEL (SECTION 8)
          ========================================================================= */}
      <ReviewsShowcaseSection onWriteReview={() => setReviewModalOpen(true)} />

      {/* =========================================================================
          13. FINAL CLOSING CONVERSION PRE-FOOTER (SECTION 15)
          ========================================================================= */}
      <ClosingConversionSection />

      {/* =========================================================================
          11. CONTACT AND CONVERSION SECTION (SECTION 13)
          ========================================================================= */}
      <ContactConversionSection />

      {/* Video Modal Player */}
      <VideoModal
        video={selectedVideo}
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSubmitReview={(revData) => {
          addReview({
            ...revData,
            verified: true,
          });
          setReviewModalOpen(false);
        }}
      />
    </div>
  );
};
