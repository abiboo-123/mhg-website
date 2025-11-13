import React, { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";

interface Props {
  eventId: string;
}

export default function EditEventForm({ eventId }: Props) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registerAvailable, setRegisterAvailable] = useState(
    event?.register_available ?? false
  );
  const [registerLink, setRegisterLink] = useState(event?.register_link ?? "");
  const [bannerUrl, setBannerUrl] = useState(event?.banner_url ?? "");
  const [media, setMedia] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
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

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/admin/events/${event.id}/upload-banner`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setBannerUrl(data.url);
        showConfirm(
          "Upload Complete",
          "Banner uploaded successfully!",
          () => {},
          "success"
        );
      } else {
        showConfirm(
          "Upload Failed",
          "Failed to upload banner.",
          () => {},
          "error"
        );
      }
    } catch (err) {
      console.error("Banner upload error:", err);
      showConfirm(
        "Upload Error",
        "An error occurred during banner upload.",
        () => {},
        "error"
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleReplaceBanner() {
    showConfirm(
      "Replace Banner",
      "Do you want to delete the old banner and upload a new one?",
      async () => {
        // 1️⃣ Delete banner
        const del = await fetch(`/api/admin/events/${event.id}/delete-banner`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!del.ok) {
          showConfirm(
            "Error",
            "Failed to delete existing banner.",
            () => {},
            "error"
          );
          return;
        }

        setBannerUrl("");

        // 2️⃣ Trigger new upload
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = handleBannerUpload as any;
        input.click();
      },
      "confirm"
    );
  }

  async function handleDeleteBanner() {
    showConfirm(
      "Delete Banner",
      "Are you sure you want to delete this banner?",
      async () => {
        const res = await fetch(`/api/admin/events/${event.id}/delete-banner`, {
          method: "DELETE",
          credentials: "include",
        });

        if (res.ok) {
          setBannerUrl("");
          showConfirm(
            "Banner Deleted",
            "Banner was removed successfully!",
            () => {},
            "success"
          );
        } else {
          showConfirm(
            "Delete Failed",
            "Could not delete banner.",
            () => {},
            "error"
          );
        }
      },
      "confirm"
    );
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const MAX_FILES = 10;
    const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

    // --- Client-side validation ---
    if (files.length > MAX_FILES) {
      showConfirm(
        "Too Many Files",
        `🚫 You can upload up to ${MAX_FILES} files at once.`,
        () => {},
        "error"
      );
      e.target.value = ""; // reset file input
      return;
    }

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        showConfirm(
          "File Too Large",
          `🚫 "${file.name}" exceeds the 25 MB limit.`,
          () => {},
          "error"
        );
        e.target.value = "";
        return;
      }
    }

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      const res = await fetch(`/api/admin/events/${eventId}/upload-media`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${text}`);
      }

      const data = await res.json();
      setMedia((prev) => [...prev, ...data]);
    } catch (err) {
      console.error("Upload error:", err);
      showConfirm(
        "Upload Error",
        "❌ Something went wrong during upload.",
        () => {},
        "error"
      );
    } finally {
      setUploading(false);
      e.target.value = ""; // clear input to allow re-uploading same file
    }
  }

  async function handleDeleteMedia(id: string, type?: "image" | "video") {
    showConfirm(
      `Delete ${type}`,
      "Are you sure you want to delete this image?",
      async () => {
        const res = await fetch(`/api/admin/events/${eventId}/delete-media`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mediaId: id }),
        });
        if (res.ok) setMedia((m) => m.filter((x) => x.id !== id));
        else showConfirm("Error", "Failed to delete image.", () => {});
      },
      "confirm"
    );
  }

  async function handleReorder(from: number, to: number) {
    const updated = [...media];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setMedia(updated);

    await fetch(`/api/admin/events/${eventId}/reorder-media`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: updated.map((m, i) => ({ id: m.id, position: i })),
      }),
    });
  }

  // Base event state
  const [base, setBase] = useState({
    slug: "",
    date: "",
    time: "",
    location: "",
    available: false,
    highlighted: false,
    is_past: false,
    register_available: registerAvailable,
    register_link: registerAvailable ? registerLink : null,
    attendance: "",
  });

  // Translations
  const [en, setEN] = useState({
    title: "",
    description: "",
    tags: "",
    card_image_url: "",
  });
  const [de, setDE] = useState({
    title: "",
    description: "",
    tags: "",
    card_image_url: "",
  });

  useEffect(() => {
    async function loadEventData() {
      try {
        setLoading(true);

        // 🧩 Fetch event details (includes translations & banner info)
        const res = await fetch(`/api/admin/events/${eventId}`);
        const data = await res.json();

        setEvent(data);

        // 🧠 Base event fields
        setBase({
          slug: data.slug || "",
          date: data.date || "",
          time: data.time || "",
          location: data.location || "",
          available: data.available || false,
          highlighted: data.highlighted || false,
          is_past: data.is_past || false,
          register_available: data.register_available || false,
          register_link: data.register_link || "",
          attendance: data.attendance || "",
        });

        // 🧠 Banner
        setBannerUrl(data.banner_url || "");

        // 🧠 Registration
        setRegisterAvailable(data.register_available ?? false);
        setRegisterLink(data.register_link ?? "");

        // 🧠 Translations
        setEN({
          title: data.en?.title || "",
          description: data.en?.description || "",
          tags: (data.en?.tags || []).join(", "),
          card_image_url: data.en?.card_image_url || "",
        });
        setDE({
          title: data.de?.title || "",
          description: data.de?.description || "",
          tags: (data.de?.tags || []).join(", "),
          card_image_url: data.de?.card_image_url || "",
        });

        // 🧩 Fetch gallery media (filter deleted)
        const mediaRes = await fetch(`/api/admin/events/${eventId}/media`);
        const allMedia = await mediaRes.json();
        const activeMedia = allMedia.filter((m: any) => !m.is_deleted);
        setMedia(activeMedia);
      } catch (err) {
        console.error("Failed to load event:", err);
      } finally {
        setLoading(false);
      }
    }

    if (eventId) loadEventData();
  }, [eventId]);

  const handleSave = async (
    section: "base" | "translation",
    lang?: "en" | "de"
  ) => {
    const payload: any = { section };
    if (section === "base") Object.assign(payload, base);
    if (section === "translation" && lang) {
      payload.lang = lang;
      payload.title = lang === "en" ? en.title : de.title;
      payload.description = lang === "en" ? en.description : de.description;
      payload.tags = (lang === "en" ? en.tags : de.tags)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const res = await fetch(`/api/admin/events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      showConfirm("Error", "❌ Failed to save changes", () => {}, "error");
      console.error(await res.text());
      return;
    }
    showConfirm("Success", "✅ Changes saved!", () => {}, "success");
    const updated = await fetch(`/api/admin/events/${eventId}`).then((r) =>
      r.json()
    );

    await fetch(`/api/admin/events/${eventId}/generate-card-image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    setEvent(updated);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-10">
      {/* ===== HEADER ===== */}
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
            href={`/admin/events/${eventId}/view`}
            className="border border-slate-400 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-50 transition"
          >
            ← Back
          </a>
        </div>
      </div>
      {/* ===== BASE INFO ===== */}
      <section className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="text-xl font-semibold border-b pb-3">Event Basics</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              value={base.slug}
              onChange={(e) => setBase({ ...base, slug: e.target.value })}
              className="border rounded w-full p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              value={base.location}
              onChange={(e) => setBase({ ...base, location: e.target.value })}
              className="border rounded w-full p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={base.date}
              onChange={(e) => setBase({ ...base, date: e.target.value })}
              className="border rounded w-full p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <input
              type="time"
              value={base.time}
              onChange={(e) => setBase({ ...base, time: e.target.value })}
              className="border rounded w-full p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Attendance</label>
            <input
              value={base.attendance || ""}
              onChange={(e) => setBase({ ...base, attendance: e.target.value })}
              className="border rounded w-full p-2"
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={base.available}
                onChange={(e) =>
                  setBase({ ...base, available: e.target.checked })
                }
              />
              Available
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={base.highlighted}
                onChange={(e) =>
                  setBase({ ...base, highlighted: e.target.checked })
                }
              />
              Highlighted
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={base.is_past}
                onChange={(e) =>
                  setBase({ ...base, is_past: e.target.checked })
                }
              />
              Past
            </label>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={registerAvailable}
                onChange={(e) => {
                  setRegisterAvailable(e.target.checked);
                  setBase({
                    ...base,
                    register_available: e.target.checked,
                  });
                }}
              />
              <span>Registration Available</span>
            </label>
          </div>
          {/* 🔹 Registration Controls */}
          {registerAvailable && (
            <input
              type="url"
              value={registerLink}
              onChange={(e) => {
                setRegisterLink(e.target.value);
                setBase({ ...base, register_link: e.target.value });
              }}
              placeholder="https://example.com/register"
              className="border rounded w-full p-2"
            />
          )}
        </div>

        <button
          type="button"
          onClick={() => handleSave("base")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Basic Info
        </button>
      </section>

      {/* 🔹 Banner Upload Section */}
      <div className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="text-xl font-semibold border-b pb-3">Event Banner</h2>

        {bannerUrl ? (
          <div className="flex flex-col gap-2">
            <img
              src={bannerUrl}
              alt="Event banner"
              className="w-full rounded-lg border object-cover"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReplaceBanner}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
              >
                Replace Banner
              </button>
              <button
                type="button"
                onClick={handleDeleteBanner}
                className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={handleBannerUpload}
              className="border p-2 rounded w-full"
            />
          </div>
        )}
        {uploading && (
          <div className="flex items-center gap-2 text-blue-600 text-sm mt-2">
            <svg
              className="animate-spin h-4 w-4 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            <span>Uploading... please wait</span>
          </div>
        )}
      </div>

      {/* ===== EN TRANSLATION ===== */}
      <section className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="text-xl font-semibold border-b pb-3">
          English Translation
        </h2>
        {en.card_image_url && (
          <div className="my-4">
            <p className="text-sm font-medium mb-1">EN Card Preview:</p>
            <img
              src={`${en.card_image_url}?v=${Date.now()}`}
              alt="EN Card"
              className="w-80 rounded-lg shadow"
            />
          </div>
        )}

        <input
          value={en.title}
          onChange={(e) => setEN({ ...en, title: e.target.value })}
          className="border rounded w-full p-2"
          placeholder="Title"
        />
        <textarea
          value={en.description}
          onChange={(e) => setEN({ ...en, description: e.target.value })}
          className="border rounded w-full p-2"
          rows={5}
          placeholder="Description"
        />
        <input
          value={en.tags}
          onChange={(e) => setEN({ ...en, tags: e.target.value })}
          className="border rounded w-full p-2"
          placeholder="Tags (comma-separated)"
        />

        <button
          type="button"
          onClick={() => handleSave("translation", "en")}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save English
        </button>
      </section>

      {/* ===== DE TRANSLATION ===== */}
      <section className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="text-xl font-semibold border-b pb-3">
          German Translation
        </h2>
        {de.card_image_url && (
          <div className="my-4">
            <p className="text-sm font-medium mb-1">DE Card Preview:</p>
            <img
              src={`${de.card_image_url}?v=${Date.now()}`}
              alt="DE Card"
              className="w-80 rounded-lg shadow"
            />
          </div>
        )}

        <input
          value={de.title}
          onChange={(e) => setDE({ ...de, title: e.target.value })}
          className="border rounded w-full p-2"
          placeholder="Title"
        />
        <textarea
          value={de.description}
          onChange={(e) => setDE({ ...de, description: e.target.value })}
          className="border rounded w-full p-2"
          rows={5}
          placeholder="Description"
        />
        <input
          value={de.tags}
          onChange={(e) => setDE({ ...de, tags: e.target.value })}
          className="border rounded w-full p-2"
          placeholder="Tags (comma-separated)"
        />

        <button
          type="button"
          onClick={() => handleSave("translation", "de")}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save German
        </button>
      </section>
      <section className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="text-xl font-semibold border-b pb-3">Event Gallery</h2>

        {!event.is_past ? (
          <p className="text-gray-500">
            Gallery is available for past events only.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {media.map((m, i) => (
                <div
                  key={m.id}
                  className="relative group rounded-lg overflow-hidden border"
                >
                  {m.type === "video" ? (
                    <div className="relative w-full h-32">
                      {/* Thumbnail/Static Preview */}
                      <video
                        src={m.url}
                        muted
                        loop
                        playsInline
                        className="rounded-lg w-full h-32 object-cover border"
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                      />

                      {/* “Video” label overlay */}
                      <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                        🎬 Video
                      </div>
                    </div>
                  ) : (
                    <img
                      src={m.url}
                      alt=""
                      className="rounded-lg w-full h-32 object-cover border"
                    />
                  )}

                  {/* Hover controls */}
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleDeleteMedia(m.id, m.type)}
                      className="bg-red-600 text-white text-xs px-2 py-1 rounded"
                    >
                      🗑️
                    </button>

                    {i > 0 && (
                      <button
                        onClick={() => handleReorder(i, i - 1)}
                        className="bg-gray-700 text-white text-xs px-2 py-1 rounded"
                      >
                        ↑
                      </button>
                    )}
                    {i < media.length - 1 && (
                      <button
                        onClick={() => handleReorder(i, i + 1)}
                        className="bg-gray-700 text-white text-xs px-2 py-1 rounded"
                      >
                        ↓
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <input
              type="file"
              accept="image/*,video/*"
              multiple
              disabled={uploading}
              onChange={handleGalleryUpload}
              className="mt-4 border rounded p-2 w-full"
            />
          </>
        )}
        {uploading && (
          <div className="flex items-center gap-2 text-blue-600 text-sm mt-2">
            <svg
              className="animate-spin h-4 w-4 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            <span>Uploading... please wait</span>
          </div>
        )}
      </section>
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
