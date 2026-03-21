"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/home", icon: "home" },
  { label: "Services", href: "/services", icon: "services" },
  { label: "Partners", href: "/partners", icon: "partners" },
  { label: "Feedbacks", href: "/feedbacks", icon: "feedbacks" },
  { label: "Settings", href: "/settings", icon: "settings" },
];

function NavIcon({ icon, size = 24 }: { icon: string; size?: number }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8 };
  switch (icon) {
    case "home":
      return <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case "services":
      return <svg {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>;
    case "partners":
      return <svg {...props}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
    case "feedbacks":
      return <svg {...props}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
    case "settings":
      return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
    default:
      return null;
  }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "DELETE" });
      router.push("/login");
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#07101f' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
             onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-[280px] flex flex-col
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `} style={{ background: '#0a1628', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Logo */}
        <div className="h-[68px] px-6 flex items-center justify-between shrink-0"
             style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight">
            <span style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Eco</span>
            <span style={{ background: 'linear-gradient(135deg, #2563EB, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Mate</span>
          </h1>
          <button className="lg:hidden p-1" style={{ color: 'rgba(255,255,255,0.4)' }}
                  onClick={() => setSidebarOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a key={item.href} href={item.href}
                 className={`flex items-center gap-3 px-6 py-4 rounded-xl text-base font-medium transition-all duration-200 group ${
                   isActive ? 'text-white' : ''
                 }`}
                 style={isActive
                   ? { background: 'rgba(37,99,235,0.12)', color: '#fff' }
                   : { color: 'rgba(255,255,255,0.4)' }
                 }
                 onMouseEnter={(e) => { if (!isActive) {
                   e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                   e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                 }}}
                 onMouseLeave={(e) => { if (!isActive) {
                   e.currentTarget.style.background = 'transparent';
                   e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                 }}}
              >
                <span style={isActive ? { color: '#2563EB' } : {}}>
                  <NavIcon icon={item.icon} />
                </span>
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#2563EB', boxShadow: '0 0 8px rgba(37,99,235,0.6)' }} />
                )}
              </a>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={handleLogout} disabled={loggingOut}
                  className="flex items-center gap-3 w-full px-6 py-4 rounded-xl text-base font-medium transition-all duration-200"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#EF4444'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-[68px] px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 backdrop-blur-xl"
                style={{ background: 'rgba(7,16,31,0.8)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button className="lg:hidden p-2 -ml-2 rounded-lg transition-colors"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                  onClick={() => setSidebarOpen(true)}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>
            </svg>
          </button>

          <div className="hidden lg:block">
            <h2 className="font-heading text-xl font-semibold text-white capitalize">
              {pathname === "/home" ? "Dashboard" : pathname.replace("/", "")}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold"
                 style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', color: '#fff' }}>
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
