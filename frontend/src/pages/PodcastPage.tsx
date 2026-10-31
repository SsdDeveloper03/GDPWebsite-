import React, { useState, useMemo, useEffect } from 'react';
import { Play, Clock, Search, Radio, Sparkles, MessageCircle, ArrowUpRight, ArrowRight, X, Filter } from 'lucide-react';
import { GDP_VIDEOS, GDP_CONTACT_INFO } from '../data/mockData';
import { api, type ApiEpisode } from '../services/apiClient';
import { VideoModal } from '../components/common/VideoModal';
import { EmptyState } from '../components/common/EmptyState';
import type { Video } from '../types';

export const PodcastPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [episodes, setEpisodes] = useState<Video[]>(GDP_VIDEOS);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLiveFromDb, setIsLiveFromDb] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function loadEpisodes() {
      setLoading(true);
      try {
        const res = await api.getEpisodes();
        if (isMounted && res.success) {
          if (res.data && res.data.length > 0) {
            const mapped: Video[] = res.data.map((ep: ApiEpisode) => ({
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
            setEpisodes(mapped);
            setIsLiveFromDb(true);
          } else {
            setEpisodes(GDP_VIDEOS);
            setIsLiveFromDb(false);
          }
        }
      } catch (err) {
        console.warn('Could not fetch episodes from API, using verified offline catalog:', err);
        if (isMounted) {
          setEpisodes(GDP_VIDEOS);
          setIsLiveFromDb(false);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadEpisodes();
    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamic Categories from actual episode data
  const categories = useMemo(() => {
    const cats = Array.from(new Set(episodes.map((vid) => vid.category)));
    return ['All', ...cats];
  }, [episodes]);

  // Filter episodes by query (title, description, category, episode number) and category
  const filteredVideos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return episodes.filter((vid) => {
      const matchesCategory = selectedCategory === 'All' || vid.category === selectedCategory;
      const matchesSearch =
        !q ||
        vid.title.toLowerCase().includes(q) ||
        vid.description.toLowerCase().includes(q) ||
        vid.category.toLowerCase().includes(q) ||
        vid.publishedDate.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [episodes, selectedCategory, searchQuery]);

  const handlePlay = (vid: Video) => {
    setActiveVideo(vid);
    setModalOpen(true);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setVisibleCount(6);
  };

  // When browsing all with no search, separate top featured episode
  const isDefaultBrowse = selectedCategory === 'All' && !searchQuery.trim();
  const featuredVideo = isDefaultBrowse && episodes.length > 0 ? episodes[0] : null;
  const displayList = isDefaultBrowse
    ? filteredVideos.slice(1, visibleCount)
    : filteredVideos.slice(0, visibleCount);

  return (
    <div className="pt-28 pb-20 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left transition-colors duration-300">
      {/* =========================================================================
          1. PODCAST HERO & AUTHENTIC GDP HEADER
          ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#1E2761]/80 border border-slate-200 dark:border-[#CADCFC]/25 text-[#1E2761] dark:text-[#CADCFC] text-xs font-semibold shadow-sm">
              <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" />
              <span>THE GDP PODCAST CHANNEL</span>
              <span className="text-slate-400 dark:text-slate-500">•</span>
              <span className="text-[#C68A27] dark:text-[#D9A441]">@GDPPODCAST</span>
              {isLiveFromDb && (
                <>
                  <span className="text-slate-400 dark:text-slate-500">•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">SQL SERVER LIVE</span>
                </>
              )}
              {loading && <span className="text-xs text-slate-400 animate-pulse">syncing...</span>}
            </div>

            <p className="text-xs sm:text-sm font-bold tracking-[0.22em] text-[#C68A27] dark:text-[#D9A441] uppercase">
              GDP PODCAST
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight font-serif">
              <span className="block">बातचीत जो सोच को नई दिशा दे।</span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1E2761] via-[#C68A27] to-[#B8860B] dark:from-white dark:via-[#F2C94C] dark:to-[#D9A441] mt-2 font-sans">
                Conversations That Give Thought A New Direction.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-[#CADCFC]/85 leading-relaxed font-light">
              Conversations on <span className="font-semibold text-slate-900 dark:text-white">Expertise, Story & Scale</span> with Gujarat’s business owners, doctors, consultants, and leaders. We decode how real businesses grow and how founders establish undeniable personal authority.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <a
              href={GDP_CONTACT_INFO.youtube}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-white hover:text-red-600 dark:hover:text-red-400 border-b-2 border-[#C68A27] dark:border-[#D9A441] pb-1 transition-colors group"
            >
              <svg className="w-5 h-5 text-red-600 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>चैनल subscribe करें</span>
              <ArrowUpRight className="w-4 h-4 text-[#C68A27] dark:text-[#D9A441] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. FEATURED PODCAST BANNER HERO CARD (MATCHING REFERENCE DESIGN)
          ========================================================================= */}
      {GDP_VIDEOS.length > 0 && (
        <section className="relative rounded-3xl overflow-hidden bg-[#10182F] text-white shadow-2xl min-h-[380px] sm:min-h-[420px] flex items-end sm:items-center p-6 sm:p-12 group border border-slate-200/20 dark:border-[#CADCFC]/15">
          {/* Background Image of Studio Microphone */}
          <img
            src="/podcast-studio-banner.webp"
            alt="गर्म रोशनी वाला पेशेवर पॉडकास्ट स्टूडियो"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-65 group-hover:scale-105 transition-transform duration-700"
          />
          {/* Studio Gradient Overlay for Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#10182F]/95 via-[#10182F]/75 to-transparent pointer-events-none" />

          {/* Golden Circular Play Button */}
          <button
            onClick={() => handlePlay(GDP_VIDEOS[0])}
            aria-label="Play Master Episode"
            className="absolute right-6 top-6 sm:top-[45%] sm:left-[70%] sm:right-auto sm:-translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#D9A441] hover:bg-[#F2C94C] text-[#0E1326] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform cursor-pointer z-10"
          >
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current translate-x-0.5" />
          </button>

          {/* Banner Editorial Copy */}
          <div className="relative z-10 max-w-xl space-y-3 sm:space-y-4 text-left">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#D9A441] uppercase block">
              WATCH · LISTEN · GROW
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-serif leading-tight">
              कहानियाँ असली।<br />सीख सबके लिए।
              <span className="block text-sm sm:text-base font-medium text-slate-300 font-sans mt-1.5 tracking-normal">
                Real Stories. Lessons for Everyone.
              </span>
            </h2>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={GDP_CONTACT_INFO.youtube}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/90 hover:text-[#F2C94C] transition-colors"
              >
                <span>हमारे latest episodes YouTube पर देखें</span>
                <ArrowUpRight className="w-4 h-4 text-[#D9A441]" />
              </a>

              <button
                onClick={() => handlePlay(GDP_VIDEOS[0])}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-semibold text-white border border-white/20 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#D9A441]" />
                <span>Watch Flagship Episode</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          3. EPISODE DISCOVERY DIRECTORY WITH SEARCH & FILTERS
          ========================================================================= */}
      <section className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
              <span>Category:</span>
            </div>
            {categories.map((cat) => {
              const count =
                cat === 'All'
                  ? GDP_VIDEOS.length
                  : GDP_VIDEOS.filter((v) => v.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setVisibleCount(6);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-[#D9A441] text-[#0E1326] font-bold shadow-md'
                      : 'bg-white dark:bg-[#121936] text-slate-700 dark:text-[#CADCFC] hover:bg-slate-100 dark:hover:bg-[#1E2761] border border-slate-200 dark:border-[#CADCFC]/15'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedCategory === cat
                        ? 'bg-[#0E1326]/20 text-[#0E1326]'
                        : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Live Search Input with Clear Button */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, guest, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-[#121936] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-[#C68A27] dark:focus:border-[#D9A441] shadow-sm transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5 rounded cursor-pointer"
                aria-label="Clear search input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results Summary or Active Filter Bar */}
        {(searchQuery || selectedCategory !== 'All') && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
            <span className="text-slate-700 dark:text-[#CADCFC]">
              Showing <strong>{filteredVideos.length}</strong> {filteredVideos.length === 1 ? 'episode' : 'episodes'}
              {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
              {searchQuery && <span> matching <strong>"{searchQuery}"</strong></span>}
            </span>
            <button
              onClick={resetFilters}
              className="text-[#C68A27] dark:text-[#D9A441] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Reset Filters</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-3xl bg-slate-200 dark:bg-white/5 h-80 border border-slate-200 dark:border-white/10 p-5 space-y-4">
                <div className="aspect-video bg-slate-300 dark:bg-white/10 rounded-2xl" />
                <div className="h-4 bg-slate-300 dark:bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-slate-300 dark:bg-white/10 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredVideos.length === 0 ? (
          <EmptyState
            title={episodes.length === 0 ? "No Episodes Published Yet" : "No Episodes Match Your Criteria"}
            description={
              episodes.length === 0
                ? "New conversations from GDP Studio are currently in post-production. Check back soon or apply to become our next featured guest."
                : `We couldn't find any recorded conversations matching "${searchQuery}". Try searching for another topic or clear filters.`
            }
            actionLabel={episodes.length === 0 ? "Apply to Be a Guest" : "Reset Search & Filters"}
            onAction={episodes.length === 0 ? () => { window.location.href = '/contact'; } : resetFilters}
          />
        ) : (
          <div className="space-y-8">
            {/* Top Featured Episode Spotlight (When browsing all without search) */}
            {featuredVideo && (
              <div
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePlay(featuredVideo);
                  }
                }}
                onClick={() => handlePlay(featuredVideo)}
                className="group cursor-pointer rounded-3xl overflow-hidden bg-white dark:bg-[#121936]/90 hover:bg-slate-50 dark:hover:bg-[#161F42] border-2 border-slate-200 dark:border-[#CADCFC]/20 hover:border-[#C68A27]/60 dark:hover:border-[#D9A441]/60 shadow-lg hover:shadow-2xl transition-all duration-300 p-6 sm:p-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                  <div className="lg:col-span-7 relative aspect-video w-full rounded-2xl overflow-hidden bg-black/40">
                    <img
                      src={featuredVideo.thumbnailUrl}
                      alt={featuredVideo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:bg-black/20 transition-colors" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#D9A441] text-[#0E1326] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current translate-x-0.5" />
                      </div>
                    </div>

                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-md bg-black/85 backdrop-blur-sm text-xs font-mono text-white flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D9A441]" />
                      <span>{featuredVideo.duration}</span>
                    </div>

                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#10182F]/90 backdrop-blur-md border border-white/20 text-[10px] font-bold text-[#D9A441] tracking-wider uppercase">
                      FEATURED SPOTLIGHT · EPISODE 01
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-4 text-left">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#C68A27] dark:text-[#D9A441] uppercase tracking-wider">
                      <span>{featuredVideo.category}</span>
                      <span className="text-slate-400 dark:text-slate-500">•</span>
                      <span>{featuredVideo.publishedDate}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white font-serif group-hover:text-[#C68A27] dark:group-hover:text-[#F2C94C] transition-colors leading-snug">
                      {featuredVideo.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light line-clamp-3">
                      {featuredVideo.description}
                    </p>

                    <div className="pt-2 flex items-center gap-3">
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D9A441] text-[#0E1326] font-bold text-xs shadow group-hover:bg-[#F2C94C] transition-all">
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch Episode ({featuredVideo.duration})</span>
                      </span>
                      <span className="text-xs font-semibold text-[#C68A27] dark:text-[#D9A441] group-hover:underline flex items-center gap-1">
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayList.map((vid) => (
                <div
                  key={vid.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`Play episode ${vid.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handlePlay(vid);
                    }
                  }}
                  onClick={() => handlePlay(vid)}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-[#121936]/80 hover:bg-slate-50 dark:hover:bg-[#1E2761]/70 border border-slate-200 dark:border-[#CADCFC]/15 hover:border-[#C68A27]/50 dark:hover:border-[#D9A441]/50 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
                >
                  {/* 16:9 Thumbnail Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-[#D9A441]/90 group-hover:bg-[#F2C94C] text-[#0E1326] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-current translate-x-0.5" />
                      </div>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[11px] font-mono text-white flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#D9A441]" />
                      <span>{vid.duration}</span>
                    </div>

                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[10px] font-mono font-bold text-[#D9A441] uppercase">
                      {vid.category}
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3 text-left">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#CADCFC]/80 font-mono">
                        <span>{vid.publishedDate}</span>
                        {vid.views && <span>• {vid.views}</span>}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#C68A27] dark:group-hover:text-[#F2C94C] transition-colors line-clamp-2 leading-snug font-serif">
                        {vid.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-light">
                        {vid.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-[#C68A27] dark:text-[#D9A441] font-semibold">
                      <span>Watch Full Episode</span>
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Action (if list exceeds visible count) */}
            {filteredVideos.length > visibleCount && (
              <div className="text-center pt-6">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-900 dark:text-white text-xs font-bold border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                >
                  Load More Episodes ({filteredVideos.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* =========================================================================
          4. BE A GUEST / SHOW PROPOSAL CTA
          ========================================================================= */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#1E2761] via-[#161F4D] to-[#0E1326] border border-[#CADCFC]/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl text-white text-left">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2C94C] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#F2C94C]" />
            <span>Call for Visionary Guests</span>
          </div>
          <h3 className="text-2xl font-bold text-white font-serif">Have a 10x Business Story to Share?</h3>
          <p className="text-xs sm:text-sm text-[#CADCFC] leading-relaxed">
            We feature high-conviction founders, doctors, and innovators building enduring enterprises in Gujarat.
          </p>
        </div>
        <a
          href={GDP_CONTACT_INFO.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-[#0E1326] bg-[#D9A441] hover:bg-[#F2C94C] shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Propose an Episode Topic</span>
        </a>
      </section>

      {/* Video Modal Player */}
      <VideoModal
        video={activeVideo}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

