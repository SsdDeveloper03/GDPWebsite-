import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F1C] text-white">
        <div className="relative flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D9A441] via-[#F2C94C] to-[#1E2761] p-[2px] animate-pulse">
            <div className="w-full h-full bg-[#0E1326] rounded-[14px] flex items-center justify-center">
              <span className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-white to-[#F2C94C]">
                GDP
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-slate-400 text-sm">
            <svg
              className="animate-spin h-4 w-4 text-[#D9A441]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span>Verifying administrator session...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
