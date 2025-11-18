import React, { useEffect, useState } from "react";

interface LogEntry {
  id: string;
  action: string;
  entity: string;
  entity_id: string;
  diff: any;
  created_at: string;
  email: string;
  role: string;
}

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(50);

  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const [role, setRole] = useState("");

  const [totalPages, setTotalPages] = useState(1);

  const [entityOptions, setEntityOptions] = useState<string[]>([]);
  const [actionOptions, setActionOptions] = useState<string[]>([]);

  async function loadFilters() {
    const res = await fetch("/api/admin/logs/filters");
    const data = await res.json();
    setEntityOptions(data.entities);
    setActionOptions(data.actions);
  }

  async function loadLogs() {
    setLoading(true);

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append("search", search);
    if (action) params.append("action", action);
    if (entity) params.append("entity", entity);
    if (role) params.append("role", role);

    const res = await fetch(`/api/admin/logs?${params.toString()}`);
    const data = await res.json();

    setLogs(Array.isArray(data.logs) ? data.logs : []);
    setTotalPages(data.totalPages || 1);

    setLoading(false);
  }

  useEffect(() => {
    loadLogs();
    loadFilters();
  }, [page, action, entity, role]);

  function getActionClass(action: string) {
    if (action.startsWith("create")) return "bg-green-100 text-green-700";
    if (action.startsWith("update")) return "bg-blue-100 text-blue-700";
    if (action.startsWith("delete")) return "bg-red-100 text-red-700";
    if (action.includes("login") || action.includes("auth"))
      return "bg-purple-100 text-purple-700";
    return "bg-gray-100 text-gray-700";
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
      <h2 className="text-xl font-semibold">System Logs</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          className="border rounded px-3 py-2"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadLogs()}
        />

        <select
          className="border rounded px-3 py-2"
          value={action}
          onChange={(e) => {
            setPage(1);
            setAction(e.target.value);
          }}
        >
          <option value="">All Actions</option>
          {actionOptions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2"
          value={entity}
          onChange={(e) => {
            setPage(1);
            setEntity(e.target.value);
          }}
        >
          <option value="">All Entities</option>
          {entityOptions.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2"
          value={role}
          onChange={(e) => {
            setPage(1);
            setRole(e.target.value);
          }}
        >
          <option value="">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading logs...</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="p-3">Action</th>
                <th className="p-3">Entity</th>
                <th className="p-3">User</th>
                <th className="p-3">Details</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t hover:bg-slate-50">
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getActionClass(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td className="p-3">
                    <p className="font-semibold">{log.entity}</p>
                    <p className="text-xs text-slate-500">{log.entity_id}</p>
                  </td>

                  <td className="p-3">
                    <p>{log.email || "Unknown"}</p>
                    <p className="text-xs text-gray-500">{log.role}</p>
                  </td>

                  <td className="p-3 text-xs w-64">
                    {log.diff ? (
                      <details className="bg-slate-100 p-2 rounded">
                        <summary className="cursor-pointer text-slate-600">
                          View
                        </summary>
                        <pre className="text-xs overflow-auto max-h-40">
                          {JSON.stringify(log.diff, null, 2)}
                        </pre>
                      </details>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="p-3">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <button
          className="px-4 py-2 bg-slate-200 rounded disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>

        <span className="text-sm text-slate-600">
          Page {page} of {totalPages}
        </span>

        <button
          className="px-4 py-2 bg-slate-200 rounded disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
