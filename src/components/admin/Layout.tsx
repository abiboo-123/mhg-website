import React, { useState } from "react";

export default function AdminLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "admin" | "super_admin" | "user";
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  const navItem = (href: string, label: string) => {
    const active = pathname.startsWith(href);
    return (
      <a
        href={href}
        className={`
          block px-4 py-2 rounded-md transition
          ${active ? "bg-slate-200 font-semibold" : "text-slate-700"}
          hover:bg-slate-100
        `}
        onClick={() => setMenuOpen(false)}
      >
        {label}
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* ---------- NAVBAR ---------- */}
      <nav className="w-full bg-white shadow-sm border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-slate-800">Admin Panel</span>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center space-x-4">
          {navItem("/admin", "📊 Dashboard")}
          {navItem("/admin/events", "📅 Events")}

          {role === "super_admin" && navItem("/admin/logs", "📝 System Logs")}
          {role === "super_admin" && navItem("/admin/users", "👥 Admin Users")}
          {role === "super_admin" && navItem("/admin/partners", "🤝 Partners")}
          {role === "super_admin" &&
            navItem("/admin/resources", "📚 Resources")}

          {navItem("/admin/profile", "👤 Profile")}

          <form method="POST" action="/api/auth/signout">
            <button className="px-3 py-2 text-red-600 hover:bg-red-50 rounded">
              🚪 Logout
            </button>
          </form>

          <a
            href="/"
            target="_blank"
            className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            🌐 View Website
          </a>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden p-2 rounded-md border"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
      </nav>

      {/* ---------- MOBILE DROPDOWN MENU ---------- */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-md py-2">
          <div className="flex flex-col space-y-1">
            {navItem("/admin", "📊 Dashboard")}
            {navItem("/admin/events", "📅 Events")}

            {role === "super_admin" && navItem("/admin/logs", "📝 System Logs")}
            {role === "super_admin" &&
              navItem("/admin/users", "👥 Admin Users")}
            {role === "super_admin" &&
              navItem("/admin/partners", "🤝 Partners")}
            {role === "super_admin" &&
              navItem("/admin/resources", "📚 Resources")}

            {navItem("/admin/profile", "👤 Profile")}

            <form method="POST" action="/api/auth/signout">
              <button className="w-full text-left px-4 py-2 rounded text-red-600 hover:bg-red-50">
                🚪 Logout
              </button>
            </form>

            <a
              href="/"
              target="_blank"
              className="block px-4 py-2 rounded text-blue-600 hover:bg-blue-50"
            >
              🌐 View Website
            </a>
          </div>
        </div>
      )}

      {/* ---------- MAIN CONTENT ---------- */}
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
