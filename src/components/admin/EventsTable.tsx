import React, { useEffect, useState } from "react";
import LanguageBadges from "./LanguageBadges";
import ConfirmModal from "./ConfirmModal";

type EventRow = {
  id: string;
  slug: string;
  date: string;
  time?: string | null;
  available: boolean;
  highlighted: boolean;
  is_past: boolean;
  title?: string | null; // from EN translation join
  attendance?: number | null;
  location?: string | null;
  translations?: { lang: string }[];
};

export default function EventsTable() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<EventRow[]>([]);
  const [q, setQ] = useState("");
  const [modal, setModal] = useState<{
    show: boolean;
    title?: string;
    message?: string;
    type?: "info" | "success" | "error" | "confirm";
    onConfirm?: () => void;
  }>({ show: false });

  function showConfirm(
    title: string,
    message: string,
    onConfirm: () => void,
    type?: "info" | "success" | "error" | "confirm"
  ) {
    setModal({ show: true, type, title, message, onConfirm });
  }

  async function handleDelete(eventId: string) {
    showConfirm(
      "Delete Event",
      "Are you sure you want to delete this event and all its data?",
      async () => {
        const res = await fetch(`/api/admin/events/${eventId}/delete`, {
          method: "DELETE",
        });
        if (res.ok) {
          showConfirm(
            "Event Deleted",
            "The event was successfully deleted.",
            () => {},
            "success"
          );
          await load();
        } else {
          showConfirm("Error", "Failed to delete event.", () => {}, "error");
        }
      },
      "confirm"
    );
  }

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRows(data ?? []);
    } catch (err) {
      console.error(err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = rows.filter(
    (r) =>
      r.title?.toLowerCase().includes(q.toLowerCase()) ||
      r.slug.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
        {/* Search Input */}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="🔍 Search title or slug"
          className="border border-slate-300 rounded-md px-3 py-2 w-full md:w-72 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        {/* Right Side Buttons */}
        <div className="flex gap-2">
          <button
            onClick={load}
            className="bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition"
          >
            Refresh
          </button>

          <button
            onClick={() => (window.location.href = "/admin")}
            className="border border-slate-400 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-50 transition"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm text-slate-800">
          <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
            <tr>
              <th className="p-3 text-left w-1/4">Title (EN)</th>
              <th className="p-3 text-center">Date</th>
              <th className="p-3 text-center">Location</th>
              <th className="p-3 text-center">Languages</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Attendance</th>
              <th className="p-3 text-center w-28">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">
                  No events found
                </td>
              </tr>
            ) : (
              filtered.map((row) => {
                const hasDE = row.translations?.some((t) => t.lang === "de");
                const hasEN = row.translations?.some((t) => t.lang === "en");

                return (
                  <tr
                    key={row.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="p-3 align-top">
                      <div className="font-medium text-slate-800">
                        {row.title ?? (
                          <span className="text-slate-500 italic">
                            (no EN title)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {row.slug}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      {row.date}
                      {row.time ? ` ${row.time}` : ""}
                    </td>
                    <td className="p-3 text-center text-slate-600">
                      {row.location || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      <LanguageBadges
                        hasEN={hasEN}
                        hasDE={hasDE}
                        eventId={row.id}
                      />
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          row.available
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {row.available ? "Published" : "Draft"}
                      </span>
                      {row.is_past && (
                        <span className="ml-2 text-xs text-slate-500">
                          (Past)
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">{row.attendance ?? "—"}</td>
                    <td className="p-3 text-center space-x-2">
                      <a
                        href={`/admin/events/${row.id}/view`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </a>
                      <a
                        href={`/admin/events/${row.id}/edit`}
                        className="text-slate-600 hover:underline"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-600 hover:underline "
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {modal.show && (
        <ConfirmModal
          title={modal.title!}
          message={modal.message!}
          onConfirm={() => {
            modal.onConfirm?.();
            setModal({ show: false });
          }}
          onCancel={() => setModal({ show: false })}
          type={modal.type}
        />
      )}
    </div>
  );
}
