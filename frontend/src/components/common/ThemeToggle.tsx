import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Radio, Check, ChevronDown } from 'lucide-react';
import { useTheme, THEME_OPTIONS, type Theme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getThemeIcon = (themeId: Theme, sizeClass = 'w-4 h-4') => {
    switch (themeId) {
      case 'ivory-editorial':
        return <Sun className={`${sizeClass} text-[#C68A27]`} />;
      case 'modern-studio':
        return <Radio className={`${sizeClass} text-[#4E80EE]`} />;
      case 'midnight-gold':
      default:
        return <Moon className={`${sizeClass} text-[#E9B13F]`} />;
    }
  };

  const currentOption = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-label={`Current visual theme: ${currentOption.label}. Click to select theme.`}
        aria-expanded={dropdownOpen}
        aria-haspopup="listbox"
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-[#CADCFC]/20 bg-white/90 dark:bg-[#151D38]/90 hover:border-[#E9B13F]/50 shadow-sm backdrop-blur-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E9B13F]"
        title="Change Visual Theme (Ivory Editorial, Midnight Gold, Modern Studio)"
      >
        <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-slate-100 dark:bg-[#10172E]">
          {getThemeIcon(theme, 'w-3.5 h-3.5')}
        </span>
        <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200">
          {currentOption.label}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            dropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div
          role="listbox"
          aria-label="Theme Selection"
          className="absolute right-0 mt-2 w-64 p-2 rounded-2xl bg-white dark:bg-[#151D38] border border-slate-200 dark:border-[#CADCFC]/20 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150 text-left"
        >
          <div className="px-3 py-1.5 mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#CADCFC]/70 border-b border-slate-100 dark:border-white/5">
            Select Visual Theme
          </div>

          <div className="space-y-1">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = opt.id === theme;
              return (
                <button
                  key={opt.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setTheme(opt.id);
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-[#10172E] text-slate-900 dark:text-white font-semibold'
                      : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full border border-black/15 dark:border-white/20 shrink-0"
                      style={{ backgroundColor: opt.bgPreview }}
                    />
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span>{opt.label}</span>
                        {opt.id === 'ivory-editorial' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#C68A27]/20 text-[#C68A27] dark:bg-[#C68A27]/30 dark:text-[#E0A745] font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        {opt.id === 'midnight-gold'
                          ? 'Cinematic Navy & Warm Gold'
                          : opt.id === 'ivory-editorial'
                          ? 'Ivory Prestige & Dark Navy Text'
                          : 'Charcoal & Electric Blue'}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check
                      className="w-4 h-4 shrink-0"
                      style={{ color: opt.accentColor }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
