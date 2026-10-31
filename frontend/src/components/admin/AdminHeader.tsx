import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ExternalLink, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenMobileMenu }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/admin/episodes/new")) return "Create New Episode";
    if (path.includes("/admin/episodes") && path.includes("/edit")) return "Edit Episode";
    if (path.includes("/admin/episodes")) return "Episodes Catalog";
    if (path.includes("/admin/guests/")) return "Guest Application Details";
    if (path.includes("/admin/guests")) return "Guest Applications";
    if (path.includes("/admin/messages/")) return "Message Details";
    if (path.includes("/admin/messages")) return "Contact Inquiries";
    return "Executive Dashboard";
  };

  return (
    <header className="h-16 bg-[#0D1222]/80 border-b border-slate-800/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Open navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-white font-serif tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#D9A441] transition-colors bg-slate-800/50 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/50"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Visit Site</span>
        </Link>

        <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 text-xs font-bold">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-white leading-none">
              {user?.displayName || "Admin"}
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <Shield className="w-2.5 h-2.5" />
              <span>Active Session</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
