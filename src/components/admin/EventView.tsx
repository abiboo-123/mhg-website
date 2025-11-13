import React, { useEffect, useState } from "react";

export default function EventView({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/admin/events/${eventId}`);
        if (!res.ok) throw new Error("Failed to load event");
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  if (loading) return <div>Loading event…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!event) return <div>No event found.</div>;

  const { en, de, media } = event;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b pb-4 flex flex-col md:flex-row justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">
            {en?.title || "(Untitled Event)"}
          </h1>
          <p className="text-slate-500 text-sm">
            {event.date} • {event.time || "No time"} • {event.location}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
          <a
            href="/admin/events"
            className="border border-slate-400 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-50 transition"
          >
            ← Back
          </a>
          <a
            href={`/admin/events/${eventId}/edit`}
            className="border border-blue-500 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-50 transition"
          >
            ✏️ Edit
          </a>
          {!de?.title && (
            <a
              href={`/admin/events/${eventId}/add-translation?lang=de`}
              className="border border-green-500 text-green-600 px-3 py-1.5 rounded-md hover:bg-green-50 transition"
            >
              ➕ Add German
            </a>
          )}
          {!en?.title && (
            <a
              href={`/admin/events/${eventId}/add-translation?lang=en`}
              className="border border-green-500 text-green-600 px-3 py-1.5 rounded-md hover:bg-green-50 transition"
            >
              ➕ Add English
            </a>
          )}
        </div>
      </div>

      {/* Event Info */}
      <section className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-3xl font-semibold mb-3 border-b pb-2">
          📋 Event Info
        </h3>
        {/* 🔹 Banner Preview */}
        {event.banner_url && (
          <div className="mb-4">
            <img
              src={event.banner_url}
              alt="Event banner"
              className="w-full rounded-lg border max-h-72 object-cover"
            />
          </div>
        )}
        <ul className="text-lg space-y-2 leading-relaxed">
          <li>
            <b>Slug:</b> {event.slug}
          </li>
          <li>
            <b>Available:</b>{" "}
            {event.available ? (
              <span className="text-green-600">✅ Yes</span>
            ) : (
              <span className="text-red-600">❌ No</span>
            )}
          </li>
          <li>
            <b>Highlighted:</b>{" "}
            {event.highlighted ? (
              "⭐ Yes"
            ) : (
              <span className="text-slate-500">—</span>
            )}
          </li>
          <li>
            <b>Past:</b> {event.is_past ? "✅" : "—"}
          </li>
          <li>
            <b>Register Available:</b>{" "}
            {event.register_available ? "✅ Yes" : "❌ No"}
          </li>
          <li>
            <b>Attendance:</b> {event.attendance ?? "—"}
          </li>
        </ul>
        {media.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Gallery</h2>
            {!event.is_past ? (
              <p className="text-gray-500">
                Gallery is available for past events only.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {media.map((m: any) =>
                  m.type === "video" ? (
                    <div key={m.id} className="relative w-full h-32">
                      <video
                        src={m.url}
                        muted
                        loop
                        playsInline
                        className="rounded-lg w-full h-32 object-cover border"
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                      />
                      <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                        🎬 Video
                      </div>
                    </div>
                  ) : (
                    <img
                      key={m.id}
                      src={m.url}
                      alt=""
                      className="rounded-lg w-full h-32 object-cover border"
                    />
                  )
                )}
              </div>
            )}
          </section>
        )}
      </section>

      {/* English Translation */}
      <section className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-3xl font-semibold mb-3 border-b pb-2">
          🇬🇧 English Translation
        </h3>
        {event.en?.card_image_url && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2 text-lg">Card Image (EN)</h3>
            <img
              src={`${event.en.card_image_url}?v=${Date.now()}`}
              alt="EN Card Image"
              className="rounded-lg shadow-md max-w-full"
            />
          </div>
        )}
        {en?.title ? (
          <div className="space-y-4">
            <p className="text-xl leading-relaxed">
              <b className="text-2xl">Title:</b> {en.title}
            </p>
            <p className="text-lg leading-relaxed whitespace-pre-line">
              <b className="text-xl">Description:</b> {en.description}
            </p>
            <p className="text-sm leading-relaxed">
              <b className="text-lg">Tags:</b>{" "}
              <span className="text-slate-700">
                {(en.tags || []).join(", ") || "—"}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-slate-500 text-sm italic">
            No English translation found.
          </p>
        )}
      </section>

      {/* German Translation */}
      <section className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-3xl font-semibold mb-3 border-b pb-2">
          🇩🇪 German Translation
        </h3>
        {event.de?.card_image_url && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Card Image (DE)</h3>
            <img
              src={`${event.de.card_image_url}?v=${Date.now()}`}
              alt="DE Card Image"
              className="rounded-lg shadow-md max-w-full"
            />
          </div>
        )}
        {de?.title ? (
          <div className="space-y-4">
            <p className="text-xl leading-relaxed">
              <b className="text-2xl">Title:</b> {de.title}
            </p>
            <p className="text-lg leading-relaxed whitespace-pre-line">
              <b className="text-xl">Description:</b> {de.description}
            </p>
            <p className="text-sm leading-relaxed">
              <b className="text-lg">Tags:</b>{" "}
              <span className="text-slate-700">
                {(de.tags || []).join(", ") || "—"}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-slate-500 text-sm italic">
            No German translation yet.{" "}
            <a
              href={`/admin/events/${eventId}/add-translation?lang=de`}
              className="text-blue-600 hover:underline"
            >
              Add now →
            </a>
          </p>
        )}
      </section>
    </div>
  );
}
