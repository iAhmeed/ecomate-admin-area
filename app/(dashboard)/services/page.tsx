"use client";
import { useState, useEffect, useRef } from "react";

interface ServiceImage {
  url: string;
  publicId: string;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  icon?: ServiceImage;
  createdAt: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (data.status === "SUCCESS") setServices(data.services || []);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const openAdd = () => {
    setEditing(null);
    setTitle("");
    setDescription("");
    setIconFile(null);
    setIconPreview("");
    setError("");
    setModalOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    setTitle(service.title);
    setDescription(service.description);
    setIconFile(null);
    setIconPreview(service.icon?.url || "");
    setError("");
    setModalOpen(true);
  };

  const uploadImage = async (file: File): Promise<ServiceImage | null> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.status === "SUCCESS") {
      return { url: data.result.secure_url, publicId: data.result.public_id };
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      let icon = editing?.icon;
      if (iconFile) {
        const uploaded = await uploadImage(iconFile);
        if (!uploaded) { setError("Image upload failed"); setSubmitting(false); return; }
        icon = uploaded;
      }

      const body: Record<string, unknown> = { title, description };
      if (icon) body.icon = icon;

      const url = editing ? `/api/services/${editing._id}` : "/api/services";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.status === "SUCCESS") {
        setModalOpen(false);
        fetchServices();
        showToast(editing ? "Service updated!" : "Service added!");
      } else {
        setError(data.message || "Operation failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "SUCCESS") {
        setServices((prev) => prev.filter((s) => s._id !== id));
        showToast("Service deleted!");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
    setDeleteConfirm(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[200] px-6 py-4 rounded-xl text-xl font-medium flex items-center gap-2 animate-fade-up"
             style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', backdropFilter: 'blur(12px)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-up">
        <div>
          <h1 className="font-heading text-4xl font-bold text-white mb-1">Services</h1>
          <p className="text-xl" style={{ color: 'rgba(255,255,255,0.4)' }}>Manage the services your agency offers.</p>
        </div>
        <button onClick={openAdd}
                className="flex items-center gap-2 px-6 py-4 rounded-xl text-xl font-bold text-white transition-all duration-200 hover:-translate-y-0.5 shrink-0"
                style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', boxShadow: '0 0 20px rgba(37,99,235,0.3)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Service
        </button>
      </div>

      {/* Services grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl p-8 h-48" style={{ background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.06)', animation: 'pulse 2s infinite' }} />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 rounded-2xl" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
          <p className="text-xl font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>No services yet</p>
          <button onClick={openAdd} className="mt-4 text-xl font-semibold text-primary hover:underline">Add your first service</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => (
            <div key={service._id}
                 className="rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 group animate-fade-up"
                 style={{ background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.08)', animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-start justify-between mb-4">
                {service.icon?.url ? (
                  <img src={service.icon.url} alt={service.title} className="w-16 h-16 rounded-xl object-cover"
                       style={{ border: '1px solid rgba(255,255,255,0.08)' }} />
                ) : (
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center"
                       style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
                  </div>
                )}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(service)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: 'rgba(255,255,255,0.4)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(37,99,235,0.1)'; e.currentTarget.style.color = '#2563EB'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={() => setDeleteConfirm(service._id)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: 'rgba(255,255,255,0.4)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#EF4444'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </div>
              </div>
              <h3 className="font-heading text-xl font-semibold text-white mb-2">{service.title}</h3>
              <p className="text-xl leading-relaxed line-clamp-3" style={{ color: 'rgba(255,255,255,0.4)' }}>{service.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative rounded-2xl p-8 w-full max-w-sm animate-fade-up" onClick={(e) => e.stopPropagation()}
               style={{ background: '#0d1d35', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="font-heading text-xl font-bold text-white mb-2">Delete Service?</h3>
            <p className="text-xl mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                      className="flex-1 py-4 rounded-xl text-xl font-medium transition-colors"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                      className="flex-1 py-4 rounded-xl text-xl font-bold text-white transition-colors"
                      style={{ background: '#EF4444' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative rounded-2xl p-8 w-full max-w-lg animate-fade-up overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}
               style={{ background: '#0d1d35', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl font-bold text-white">{editing ? "Edit Service" : "Add Service"}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {error && (
              <div className="mb-5 px-6 py-4 rounded-xl text-xl font-medium"
                   style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xl font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required
                       className="w-full px-6 py-4 rounded-xl text-xl text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-primary/40"
                       style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                       placeholder="e.g. Web Development" />
              </div>
              <div>
                <label className="block text-xl font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4}
                          className="w-full px-6 py-4 rounded-xl text-xl text-white placeholder-gray-500 outline-none resize-none transition-all focus:ring-2 focus:ring-primary/40"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                          placeholder="Describe the service..." />
              </div>
              <div>
                <label className="block text-xl font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Icon Image</label>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                {iconPreview ? (
                  <div className="relative inline-block">
                    <img src={iconPreview} alt="Preview" className="w-20 h-20 rounded-xl object-cover"
                         style={{ border: '1px solid rgba(255,255,255,0.1)' }} />
                    <button type="button" onClick={() => { setIconFile(null); setIconPreview(""); if (fileRef.current) fileRef.current.value = ""; }}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white"
                            style={{ background: '#EF4444' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileRef.current?.click()}
                          className="w-full py-8 rounded-xl text-xl font-medium flex flex-col items-center gap-2 transition-all hover:border-primary/40"
                          style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.35)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Click to upload icon
                  </button>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)}
                        className="flex-1 py-4 rounded-xl text-xl font-medium transition-colors"
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                        className="flex-1 py-4 rounded-xl text-xl font-bold text-white transition-all disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', boxShadow: '0 0 20px rgba(37,99,235,0.3)' }}>
                  {submitting ? "Saving..." : editing ? "Update" : "Add Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
