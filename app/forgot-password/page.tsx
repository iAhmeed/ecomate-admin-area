"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.status === "SUCCESS") {
        setMessage(data.message);
        setSent(true);
      } else {
        setError(data.message || "Request failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
         style={{ background: '#07101f' }}>
      <div className="absolute top-[15%] left-[10%] w-[450px] h-[450px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)' }} />

      <div className="w-full max-w-md relative z-10 animate-fade-up">
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight">
            <span style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Eco</span>
            <span style={{ background: 'linear-gradient(135deg, #2563EB, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Mate</span>
          </h1>
          <p className="text-xl mt-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Admin Area</p>
        </div>

        <div className="rounded-2xl p-8 backdrop-blur-xl"
             style={{ background: 'rgba(10,22,40,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
          
          {!sent ? (
            <>
              <div className="mb-6">
                <h2 className="font-heading text-xl font-bold mb-1 text-white">Forgot Password</h2>
                <p className="text-xl" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              {error && (
                <div className="mb-6 px-6 py-4 rounded-xl text-xl font-medium flex items-center gap-2"
                     style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xl font-semibold uppercase tracking-wider mb-2"
                         style={{ color: 'rgba(255,255,255,0.45)' }}>Email Address</label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@ecomate.com"
                    className="w-full px-6 py-4 rounded-xl text-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/40"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>

                <button
                  id="forgot-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full py-4.5 rounded-xl text-xl font-bold text-white transition-all duration-200 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', boxShadow: '0 0 25px rgba(37,99,235,0.4)' }}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                   style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 className="font-heading text-xl font-bold text-white mb-2">Check Your Email</h2>
              <p className="text-xl mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{message}</p>
              <p className="text-xl" style={{ color: 'rgba(255,255,255,0.28)' }}>
                The link will expire in 30 minutes.
              </p>
            </div>
          )}

          <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <a href="/login" className="flex items-center justify-center gap-2 text-xl font-medium transition-colors hover:text-primary"
               style={{ color: 'rgba(255,255,255,0.45)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              Back to Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
