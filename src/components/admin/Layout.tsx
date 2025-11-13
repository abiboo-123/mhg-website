import React from "react";

export default function AdminLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "admin" | "super_admin" | "user";
}) {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  const navItem = (href: string, label: string) => {
    const active = pathname.startsWith(href);
    return (
      <a
        href={href}
        className={`block px-4 py-2 rounded hover:bg-slate-100 ${
          active ? "bg-slate-200 font-medium" : "text-slate-600"
        }`}
      >
        {label}
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-slate-200 p-4">
        <h2 className="text-lg font-bold mb-4 text-slate-800">Admin Panel</h2>

        <nav className="space-y-1">
          {navItem("/admin", "📊 Dashboard")}
          {navItem("/admin/events", "📅 Events")}

          {/* SUPER ADMIN ONLY */}
          {role === "super_admin" && navItem("/admin/logs", "📝 Audit Logs")}
          {role === "super_admin" && navItem("/admin/users", "👥 Admin Users")}

          {/* Optional sections */}
          {/* Hide from admin unless you tell me otherwise */}
          {role === "super_admin" && navItem("/admin/partners", "🤝 Partners")}
          {role === "super_admin" &&
            navItem("/admin/resources", "📚 Resources")}

          {/* Profile (everyone) */}
          {navItem("/admin/profile", "👤 Profile")}

          {/* Logout */}
          <form method="POST" action="/api/auth/signout">
            <button className="w-full text-left px-4 py-2 rounded text-red-600 hover:bg-red-50">
              🚪 Logout
            </button>
          </form>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
