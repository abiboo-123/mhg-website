import React, { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";

interface AddTranslationFormProps {
  eventId: string;
}

export default function AddTranslationForm({
  eventId,
}: AddTranslationFormProps) {
  const [lang, setLang] = useState<"en" | "de">("de");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);
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

  // EN reference
  const [enRef, setEnRef] = useState<{
    title: string;
    description: string;
    tags: string[];
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const qLang = params.get("lang");
      if (qLang === "en" || qLang === "de") {
        setLang(qLang);
        setLocked(true);
      }
    }
  }, []);

  // Fetch English reference if adding DE
  useEffect(() => {
    if (lang === "de") {
      fetch(`/api/admin/events/${eventId}/translation?lang=en`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setEnRef(data))
        .catch((err) => console.error("Failed to fetch EN reference:", err));
    }
  }, [lang, eventId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!title || !description) {
        showConfirm(
          "Missing Fields",
          "Please fill in all required fields.",
          () => {},
          "error"
        );
        return;
      }

      const payload = {
        event_id: eventId,
        lang,
        title,
        description,
        tags: tags
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };

      console.log("Sending payload:", payload);

      const res = await fetch(`/api/admin/events/${eventId}/add-translation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      if (!res.ok) throw new Error(text);

      showConfirm(
        "translation successful",
        `${lang.toUpperCase()}Translation added successfully!`,
        () => {},
        "success"
      );

      await fetch(`/api/admin/events/${eventId}/generate-card-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang }),
      });
      showConfirm(
        "Card Image Generation",
        "Card image generation triggered.",
        () => {},
        "info"
      );
      window.location.href = `/admin/events/${eventId}/view`;
    } catch (err) {
      console.error("❌ AddTranslation error:", err);
      showConfirm(
        "Error Adding Translation",
        "Failed to add translation. Check console for details.",
        () => {},
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded-md p-6 space-y-8">
      {/* Reference section */}
      {lang === "de" && enRef && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
          <h3 className="font-semibold mb-2">🇬🇧 English Reference</h3>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Title:</strong> {enRef.title}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Description:</strong> {enRef.description}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Tags:</strong> {enRef.tags?.join(", ")}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-semibold">
            Add Translation ({lang.toUpperCase()})
          </h2>

          {locked ? (
            <span
              className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                lang === "en"
                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                  : "bg-yellow-100 text-yellow-800 border border-yellow-300"
              }`}
            >
              {lang.toUpperCase()}
            </span>
          ) : (
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as "en" | "de")}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="en">🇬🇧 English</option>
              <option value="de">🇩🇪 German</option>
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded w-full p-2"
            placeholder={`Enter ${lang.toUpperCase()} title`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded w-full p-2"
            rows={6}
            placeholder={`Enter ${lang.toUpperCase()} description`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="border rounded w-full p-2"
            placeholder="e.g. Students, Community, Event"
          />
        </div>

        <div className="flex justify-end gap-2">
          <a
            href={`/admin/events/${eventId}/view`}
            className="border border-gray-400 text-gray-600 px-4 py-2 rounded hover:bg-gray-50"
          >
            Cancel
          </a>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : `Save ${lang.toUpperCase()} Translation`}
          </button>
        </div>
      </form>
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
