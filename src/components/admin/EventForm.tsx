import React, { useState } from "react";
import ConfirmModal from "./ConfirmModal";

export default function EventForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title_en: "",
    description_en: "",
    date: "",
    time: "",
    location: "",
    tags_en: "",
    speakers: "",
  });
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !form.title_en ||
        !form.description_en ||
        !form.date ||
        !form.time ||
        !form.location
      ) {
        showConfirm(
          "Missing Fields",
          "Please fill all required fields.",
          () => {},
          "error"
        );
        setLoading(false);
        return;
      }

      const slug = generateSlug(form.title_en);
      const payload = {
        slug,
        date: form.date,
        time: form.time,
        location: form.location,
        available: false, // draft
        highlighted: false,
        is_past: false,
        attendance: 0,
        speakers: form.speakers
          ? form.speakers
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        translation: {
          lang: "en",
          title: form.title_en,
          description: form.description_en,
          tags: form.tags_en
            ? form.tags_en
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
        },
      };

      const res = await fetch("/api/admin/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());
      const { id } = await res.json();

      showConfirm(
        "Event Created",
        "Event created successfully!",
        () => {},
        "success"
      );

      await fetch(`/api/admin/events/${id}/generate-card-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: "en" }),
      });

      window.location.href = `/admin/events/${id}/add-translation?lang=de`; // redirect to step 2
    } catch (err) {
      console.error(err);
      showConfirm(
        "Creation Failed",
        "Failed to create event. Check console for details.",
        () => {},
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-md p-6 space-y-6"
    >
      <h3 className="text-lg font-semibold border-b pb-1">🇬🇧 English Info</h3>

      <div>
        <label className="block text-sm font-medium mb-1">Title (EN)</label>
        <input
          type="text"
          name="title_en"
          value={form.title_en}
          onChange={handleChange}
          className="border rounded w-full p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Description (EN)
        </label>
        <textarea
          name="description_en"
          value={form.description_en}
          onChange={handleChange}
          className="border rounded w-full p-2"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="border rounded w-full p-2"
          placeholder="e.g. Room G215, THI, Ingolstadt"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Time</label>
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags_en"
            value={form.tags_en}
            onChange={handleChange}
            className="border rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Speakers (comma-separated)
          </label>
          <input
            type="text"
            name="speakers"
            value={form.speakers}
            onChange={handleChange}
            className="border rounded w-full p-2"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Creating..." : "Create Event"}
      </button>
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
    </form>
  );
}
