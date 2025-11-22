import React, { useState } from "react";

interface CreateUserModalProps {
  onClose: () => void;
  onCreated: (creds: { email: string; password: string }) => void;
}

export default function CreateUserModal({
  onClose,
  onCreated,
}: CreateUserModalProps) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  const password = Math.random().toString(36).slice(-12);

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleCreate() {
    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    const res = await fetch("/api/admin/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        fullName: fullName,
        role: "admin",
      }),
    });

    const data = await res.json();

    if (!data.success) {
      setError(data.error || "Failed to create user");
      return;
    }

    onCreated({ email, password });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="font-semibold mb-3">Create Admin User</h2>

        <label className="text-sm">Full Name</label>
        <input
          className="w-full border rounded px-3 py-2 mb-3"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <label className="text-sm">Email</label>
        <input
          className="w-full border rounded px-3 py-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <button className="text-sm" onClick={onClose}>
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="text-sm bg-green-600 text-white rounded px-3 py-1"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
