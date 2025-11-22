// src/components/admin/ResetPasswordModal.tsx
import React, { useState } from "react";
import type { AdminUser } from "./UsersAdmin";
import { generatePassword } from "../../utils/generatePassword";

interface Props {
  user: AdminUser;
  onClose: () => void;
  onDone: (newPassword: string) => void;
}

export default function ResetPasswordModal({ user, onClose, onDone }: Props) {
  const [password] = useState(generatePassword());

  async function handleReset() {
    const res = await fetch("/api/admin/users/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, password }), // <-- FIXED
    });

    const data = await res.json();
    if (data.success) {
      onDone(password);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="font-semibold mb-2">Reset Password</h2>

        <p className="text-sm text-gray-700 mb-2">
          New password for <strong>{user.email}</strong>:
        </p>
        <pre className="p-2 bg-gray-100 rounded text-sm">{password}</pre>

        <button
          className="mt-3 border px-3 py-1 rounded text-sm"
          onClick={() =>
            navigator.clipboard.writeText(
              `Email: ${user.email}\nPassword: ${password}`
            )
          }
        >
          Copy Credentials
        </button>

        <div className="flex justify-end gap-2 mt-4">
          <button className="text-sm" onClick={onClose}>
            Cancel
          </button>
          <button className="text-sm font-semibold" onClick={handleReset}>
            Confirm Reset
          </button>
        </div>
      </div>
    </div>
  );
}
