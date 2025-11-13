import React, { useEffect, useState } from "react";

interface LogEntry {
  id: string;
  action: string;
  entity: string;
  entity_id: string;
  diff: any;
  created_at: string;
  actor?: {
    email?: string;
    role?: string;
  };
}

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch(`/api/admin/logs?page=1&limit=50`, {
          credentials: "include",
        });

        const data = await res.json();
        setLogs(data.logs || []);
      } catch (err) {
        console.error("Failed to load logs:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLogs();
  }, []);

  if (loading) {
    return <p className="text-slate-500">Loading logs...</p>;
  }

  // 🎨 Action Colors
  const getActionClass = (action: string) => {
    if (action.startsWith("create")) return "bg-green-100 text-green-700";
    if (action.startsWith("update")) return "bg-blue-100 text-blue-700";
    if (action.startsWith("delete")) return "bg-red-100 text-red-700";
    if (action.startsWith("auth") || action.includes("login"))
      return "bg-purple-100 text-purple-700";
    return "bg-gray-100 text-gray-700";
  };

  // 🎨 Role Colors
  const getRoleClass = (role?: string) => {
    if (role === "super_admin") return "bg-red-100 text-red-700";
    if (role === "admin") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Audit Log</h2>

      <div className="overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 text-sm">
              <th className="p-3 border-b">Action</th>
              <th className="p-3 border-b">Entity</th>
              <th className="p-3 border-b">User</th>
              <th className="p-3 border-b">Details</th>
              <th className="p-3 border-b">Date</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition">
                {/* Action */}
                <td className="p-3 border-b">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getActionClass(
                      log.action
                    )}`}
                  >
                    {log.action}
                  </span>
                </td>

                {/* Entity */}
                <td className="p-3 border-b">
                  <span className="font-medium text-slate-800">
                    {log.entity}
                  </span>
                  <p className="text-xs text-slate-500">{log.entity_id}</p>
                </td>

                {/* User */}
                <td className="p-3 border-b">
                  <div>
                    <p className="text-sm">{log.actor?.email ?? "Unknown"}</p>
                    <span
                      className={`mt-1 inline-block px-2 py-0.5 rounded text-xs ${getRoleClass(
                        log.actor?.role
                      )}`}
                    >
                      {log.actor?.role ?? "unknown"}
                    </span>
                  </div>
                </td>

                {/* Diff */}
                <td className="p-3 border-b text-xs">
                  {log.diff ? (
                    <pre className="bg-slate-100 p-2 rounded max-h-32 overflow-auto">
                      {JSON.stringify(log.diff, null, 2)}
                    </pre>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>

                {/* Timestamp */}
                <td className="p-3 border-b text-sm text-slate-500">
                  {new Date(log.created_at).toLocaleString()}
                </td>
              </tr>
            ))}

            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-500">
                  No logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
