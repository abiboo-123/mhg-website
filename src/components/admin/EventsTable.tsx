import React, { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";

type EventRow = {
  id: string;
  slug: string;
  date: string;
  time?: string | null;
  available: boolean;
  highlighted: boolean;
  is_past: boolean;
  title?: string | null;
  attendance?: number | null;
  location?: string | null;
  translations?: { lang: string }[];
};

export default function EventsCards() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<EventRow[]>([]);
  const [q, setQ] = useState("");
  const [modal, setModal] = useState<any>({ show: false });

  function showConfirm(title: string, message: string, onConfirm: () => void) {
    setModal({ show: true, title, message, onConfirm });
  }

  async function handleDelete(id: string) {
    showConfirm("Delete Event", "Are you sure?", async () => {
      const res = await fetch(`/api/admin/events/${id}/delete`, {
        method: "DELETE",
      });
      if (res.ok) load();
      setModal({ show: false });
    });
  }

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/events");
    const data = await res.json();
    setRows(data ?? []);
    setLoading(false);
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
    <div className="p-4 space-y-4">
      {/* Search + Actions */}
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="🔍 Search title or slug"
          className="border border-slate-300 rounded-md px-3 py-2 w-full md:w-72"
        />

        <button
          onClick={load}
          className="bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-800"
        >
          Refresh
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-center text-slate-500 py-10">Loading events…</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-slate-400 py-10">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => {
            const hasEN = event.translations?.some((t) => t.lang === "en");
            const hasDE = event.translations?.some((t) => t.lang === "de");

            return (
              <div
                key={event.id}
                className="bg-white border rounded-xl shadow-sm p-5 flex flex-col justify-between"
              >
                {/* Title */}
                <div>
                  <h2 className="text-xl font-semibold text-slate-800 line-clamp-2">
                    {event.title ?? "(no EN title)"}
                  </h2>
                  <p className="text-sm text-slate-500">{event.slug}</p>

                  {/* Meta */}
                  <div className="mt-3 space-y-1 text-sm">
                    <p>
                      📅 {event.date} {event.time && `• ${event.time}`}
                    </p>
                    <p>📍 {event.location || "—"}</p>
                    <p>
                      🌐 Languages:{" "}
                      <span
                        className={hasEN ? "text-green-600" : "text-red-500"}
                      >
                        EN
                      </span>
                      {" · "}
                      <span
                        className={hasDE ? "text-green-600" : "text-red-500"}
                      >
                        DE
                      </span>
                    </p>
                    <p>
                      📊 Status:{" "}
                      {event.available ? (
                        <span className="text-green-600 font-medium">
                          Published
                        </span>
                      ) : (
                        <span className="text-yellow-600 font-medium">
                          Draft
                        </span>
                      )}
                      {event.is_past && (
                        <span className="text-slate-500 ml-1">(Past)</span>
                      )}
                    </p>
                    <p>👥 Attendance: {event.attendance ?? "—"}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-3">
                  <a
                    href={`/admin/events/${event.id}/view`}
                    className="flex-1 text-center bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 text-sm"
                  >
                    View
                  </a>
                  <a
                    href={`/admin/events/${event.id}/edit`}
                    className="flex-1 text-center bg-slate-600 text-white px-3 py-2 rounded-md hover:bg-slate-700 text-sm"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal.show && (
        <ConfirmModal
          title={modal.title}
          message={modal.message}
          onConfirm={modal.onConfirm}
          onCancel={() => setModal({ show: false })}
          type="confirm"
        />
      )}
    </div>
  );
}
