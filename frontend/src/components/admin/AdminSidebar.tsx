import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  UserCheck,
  Mail,
  ExternalLink,
  LogOut,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
  isMobile?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile, isMobile = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
    if (onCloseMobile) onCloseMobile();
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Episodes",
      path: "/admin/episodes",
      icon: Video,
    },
    {
      name: "Guest Applications",
      path: "/admin/guests",
      icon: UserCheck,
    },
    {
      name: "Contact Messages",
      path: "/admin/messages",
      icon: Mail,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0F1426] border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
        <Link
          to="/admin/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D9A441] via-[#F2C94C] to-[#1E2761] p-[1.5px] shadow-md shadow-[#D9A441]/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0E1326] rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-r from-white to-[#F2C94C]">
                GDP
              </span>
            </div>
          </div>
          <div>
            <div className="font-serif font-black text-white text-base tracking-tight leading-none">
              GDP Studio
            </div>
            <div className="text-[10px] font-semibold text-[#D9A441] uppercase tracking-wider mt-1">
              Admin Console
            </div>
          </div>
        </Link>

        {isMobile && onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#D9A441]/15 text-[#D9A441] border border-[#D9A441]/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Quick Links
        </div>
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>Public Website</span>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
            ↗
          </span>
        </Link>
      </nav>

      {/* Admin Profile Footer */}
      <div className="p-4 border-t border-slate-800 bg-[#0B0F1C]/70">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-4 h-4 text-[#D9A441]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">
              {user?.displayName || "Administrator"}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {user?.email}
            </div>
          </div>
          <span className="text-[9px] font-bold bg-amber-500/15 text-[#D9A441] border border-amber-500/30 px-1.5 py-0.5 rounded uppercase">
            Admin
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out Session</span>
        </button>
      </div>
    </div>
  );
};
