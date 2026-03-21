"use client";
import { useState, useEffect } from "react";

interface Feedback {
  _id: string;
  clientName: string;
  feedbackText: string;
  rating: number;
  approved: boolean;
  createdAt: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width="14" height="14" viewBox="0 0 24 24"
             fill={star <= rating ? "#F59E0B" : "none"}
             stroke={star <= rating ? "#F59E0B" : "rgba(255,255,255,0.15)"}
             strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("/api/clients-feedbacks");
      const data = await res.json();
      if (data.status === "SUCCESS") setFeedbacks(data.feedbacks || []);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleToggleApproval = async (id: string) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/clients-feedbacks/${id}`, { method: "PUT" });
      const data = await res.json();
      if (data.status === "SUCCESS") {
        setFeedbacks((prev) => prev.map((f) => f._id === id ? { ...f, approved: !f.approved } : f));
        showToast(data.feedback?.approved ? "Feedback approved!" : "Feedback unapproved!");
      }
    } catch (err) { console.error("Toggle failed:", err); }
    setTogglingId(null);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/clients-feedbacks/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "SUCCESS") {
        setFeedbacks((prev) => prev.filter((f) => f._id !== id));
        showToast("Feedback deleted!");
      }
    } catch (err) { console.error("Delete failed:", err); }
    setDeleteConfirm(null);
  };

  const filtered = feedbacks.filter((f) => {
    if (filter === "approved") return f.approved;
    if (filter === "pending") return !f.approved;
    return true;
  });

  const counts = {
    all: feedbacks.length,
    approved: feedbacks.filter((f) => f.approved).length,
    pending: feedbacks.filter((f) => !f.approved).length,
  };

  return (
    <div className="max-w-6xl mx-auto">
      {toast && (
        <div className="fixed top-6 right-6 z-[200] px-6 py-4 rounded-xl text-xl font-medium flex items-center gap-2 animate-fade-up"
             style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', backdropFilter: 'blur(12px)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-fade-up">
        <div>
          <h1 className="font-heading text-4xl font-bold text-white mb-1">Client Feedbacks</h1>
          <p className="text-xl" style={{ color: 'rgba(255,255,255,0.4)' }}>Review and manage client testimonials.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        {(["all", "approved", "pending"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
                  className="px-6 py-2 rounded-xl text-xl font-semibold uppercase tracking-wider transition-all"
                  style={filter === f
                    ? { background: 'rgba(37,99,235,0.12)', color: '#2563EB', border: '1px solid rgba(37,99,235,0.25)' }
                    : { background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.06)' }
                  }>
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl p-8 h-32" style={{ background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.06)', animation: 'pulse 2s infinite' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 rounded-2xl" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          <p className="text-xl font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {filter === "all" ? "No feedbacks yet" : `No ${filter} feedbacks`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((feedback, i) => (
            <div key={feedback._id}
                 className="rounded-2xl p-8 md:p-8 transition-all duration-300 group animate-fade-up"
                 style={{ background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.08)', animationDelay: `${i * 0.05}s` }}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 text-xl font-bold"
                     style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', color: '#fff' }}>
                  {feedback.clientName.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h3 className="font-heading text-xl font-semibold text-white">{feedback.clientName}</h3>
                    <StarRating rating={feedback.rating} />
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider w-fit ${feedback.approved ? '' : ''}`}
                          style={feedback.approved
                            ? { background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }
                            : { background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }
                          }>
                      {feedback.approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="text-xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{feedback.feedbackText}</p>
                  <p className="text-[11px] mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    {new Date(feedback.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleToggleApproval(feedback._id)}
                          disabled={togglingId === feedback._id}
                          className="p-2 rounded-lg transition-colors disabled:opacity-50"
                          title={feedback.approved ? "Unapprove" : "Approve"}
                          style={{ color: feedback.approved ? '#F59E0B' : '#10B981' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = feedback.approved ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                    {feedback.approved ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    )}
                  </button>
                  <button onClick={() => setDeleteConfirm(feedback._id)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: 'rgba(255,255,255,0.4)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#EF4444'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative rounded-2xl p-8 w-full max-w-sm animate-fade-up" onClick={(e) => e.stopPropagation()}
               style={{ background: '#0d1d35', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="font-heading text-xl font-bold text-white mb-2">Delete Feedback?</h3>
            <p className="text-xl mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                      className="flex-1 py-4 rounded-xl text-xl font-medium"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)}
                      className="flex-1 py-4 rounded-xl text-xl font-bold text-white" style={{ background: '#EF4444' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
