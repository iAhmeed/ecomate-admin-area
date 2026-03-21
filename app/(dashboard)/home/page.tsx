"use client";
import { useState, useEffect } from "react";

interface StatsData {
  services: number;
  partners: number;
  feedbacks: number;
  approvedFeedbacks: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<StatsData>({ services: 0, partners: 0, feedbacks: 0, approvedFeedbacks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [servicesRes, partnersRes, feedbacksRes] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/partners"),
          fetch("/api/clients-feedbacks"),
        ]);
        const [servicesData, partnersData, feedbacksData] = await Promise.all([
          servicesRes.json(),
          partnersRes.json(),
          feedbacksRes.json(),
        ]);
        setStats({
          services: servicesData.services?.length || 0,
          partners: partnersData.brands?.length || 0,
          feedbacks: feedbacksData.feedbacks?.length || 0,
          approvedFeedbacks: feedbacksData.feedbacks?.filter((f: { approved: boolean }) => f.approved).length || 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Services",
      value: stats.services,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
        </svg>
      ),
      color: "#2563EB",
      bg: "rgba(37,99,235,0.1)",
      border: "rgba(37,99,235,0.2)",
    },
    {
      label: "Trusted Partners",
      value: stats.partners,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      ),
      color: "#10B981",
      bg: "rgba(16,185,129,0.1)",
      border: "rgba(16,185,129,0.2)",
    },
    {
      label: "Client Feedbacks",
      value: stats.feedbacks,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      ),
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.2)",
    },
    {
      label: "Approved Feedbacks",
      value: stats.approvedFeedbacks,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
      color: "#10B981",
      bg: "rgba(16,185,129,0.1)",
      border: "rgba(16,185,129,0.2)",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome header */}
      <div className="mb-8 animate-fade-up">
        <h1 className="font-heading text-4xl md:text-4xl font-bold text-white mb-2">
          Welcome to <span style={{ color: '#2563EB' }}>Eco</span><span style={{ color: '#10B981' }}>Mate</span> Admin
        </h1>
        <p className="text-xl" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Here&apos;s an overview of your agency&apos;s data.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <div key={card.label}
               className="rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 animate-fade-up"
               style={{
                 background: 'rgba(255,255,255,0.028)',
                 border: '1px solid rgba(255,255,255,0.08)',
                 animationDelay: `${i * 0.1}s`,
               }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center"
                   style={{ background: card.bg, color: card.color, border: `1px solid ${card.border}` }}>
                {card.icon}
              </div>
            </div>
            <div className="font-heading text-4xl font-bold text-white mb-1">
              {loading ? (
                <div className="w-12 h-7 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', animation: 'pulse 2s infinite' }} />
              ) : card.value}
            </div>
            <div className="text-xl font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="font-heading text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Manage Services", href: "/services", color: "#2563EB" },
            { label: "Manage Partners", href: "/partners", color: "#10B981" },
            { label: "Review Feedbacks", href: "/feedbacks", color: "#F59E0B" },
          ].map((action) => (
            <a key={action.href} href={action.href}
               className="flex items-center gap-3 px-6 py-4 rounded-xl text-xl font-medium transition-all duration-200 group hover:-translate-y-0.5"
               style={{ background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = action.color; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
              <div className="w-2 h-2 rounded-full" style={{ background: action.color }} />
              {action.label}
              <svg className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
