"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters!");
      return;
    }
    if (oldPassword === newPassword) {
      setError("New password must be different from old password!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (data.status === "SUCCESS") {
        setSuccess(data.message);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "Failed to change password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const PasswordToggle = ({ show, toggle }: { show: boolean; toggle: () => void }) => (
    <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
      {show ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      )}
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <h1 className="font-heading text-4xl font-bold text-white mb-1">Settings</h1>
        <p className="text-xl" style={{ color: 'rgba(255,255,255,0.4)' }}>Manage your account security.</p>
      </div>

      <div className="rounded-2xl p-8 md:p-8 animate-fade-up"
           style={{ background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.08)', animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 mb-6 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-16 h-16 rounded-xl flex items-center justify-center"
               style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold text-white">Change Password</h2>
            <p className="text-xl" style={{ color: 'rgba(255,255,255,0.35)' }}>Update your admin account password</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 px-6 py-4 rounded-xl text-xl font-medium flex items-center gap-2"
               style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 px-6 py-4 rounded-xl text-xl font-medium flex items-center gap-2"
               style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xl font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Current Password</label>
            <div className="relative">
              <input type={showOld ? "text" : "password"} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required
                     placeholder="Enter current password"
                     className="w-full px-6 py-4 rounded-xl text-xl text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-primary/40 pr-12"
                     style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
              <PasswordToggle show={showOld} toggle={() => setShowOld(!showOld)} />
            </div>
          </div>

          <div>
            <label className="block text-xl font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>New Password</label>
            <div className="relative">
              <input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                     minLength={8} placeholder="Min 8 characters"
                     className="w-full px-6 py-4 rounded-xl text-xl text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-primary/40 pr-12"
                     style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
              <PasswordToggle show={showNew} toggle={() => setShowNew(!showNew)} />
            </div>
          </div>

          <div>
            <label className="block text-xl font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                   minLength={8} placeholder="Re-enter new password"
                   className="w-full px-6 py-4 rounded-xl text-xl text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-primary/40"
                   style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>

          <div className="pt-2">
            <button type="submit" disabled={loading}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl text-xl font-bold text-white transition-all duration-200 disabled:opacity-50 hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', boxShadow: '0 0 20px rgba(37,99,235,0.3)' }}>
              {loading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
