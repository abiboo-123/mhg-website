// src/components/admin/UsersAdmin.tsx

import React, { useEffect, useState } from "react";
import ResetPasswordModal from "./ResetPasswordModal";
import CreateUserModal from "./CreateUserCard";
import ConfirmModal from "./ConfirmModal";

export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "super_admin";
  full_name?: string;
  created_at: string;
}

export default function UsersAdmin() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // When updating a role, store the id being updated
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  // Store text to show in "copy" credentials box
  const [generatedPassword, setGeneratedPassword] = useState("");

  // Track active user for reset-password modal
  const [activeUser, setActiveUser] = useState<AdminUser | null>(null);

  // Create user modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  // showConfirm modal
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "info" as "info" | "success" | "error" | "confirm",
    onConfirm: () => {},
  });

  function showConfirm(
    title: string,
    message: string,
    onConfirm: () => void,
    type: "info" | "success" | "error" | "confirm" = "confirm"
  ) {
    setModal({ show: true, title, message, type, onConfirm });
  }

  async function loadUsers() {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // Update user role
  async function handleRoleChange(
    id: string,
    newRole: "admin" | "super_admin"
  ) {
    setUpdatingRole(id);

    await fetch("/api/admin/users/role", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: newRole }),
    });

    setUpdatingRole(null);
    loadUsers();
  }

  // Delete user
  async function handleDelete(id: string) {
    showConfirm(
      "Delete User",
      "Are you sure you want to delete this user? This action cannot be undone.",
      async () => {
        const res = await fetch("/api/admin/users/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (res.ok) {
          loadUsers();
        } else {
          showConfirm(
            "Delete Failed",
            "Could not delete this user.",
            () => {},
            "error"
          );
        }
      },
      "confirm"
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Admin Users</h2>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Create Admin User
        </button>

        {showCreateModal && (
          <CreateUserModal
            onClose={() => setShowCreateModal(false)}
            onCreated={(creds) => {
              setGeneratedPassword(
                `Email: ${creds.email}\nPassword: ${creds.password}`
              );
              setTimeout(() => setGeneratedPassword(""), 60000); // hide after 60 seconds

              loadUsers();
            }}
          />
        )}
      </div>

      {/* Copy Credentials Box */}
      {generatedPassword && (
        <div className="relative bg-yellow-100 border border-yellow-300 p-4 rounded-lg">
          {/* Close button */}
          <button
            onClick={() => setGeneratedPassword("")}
            className="absolute top-2 right-2 text-gray-600 hover:text-black"
          >
            ✕
          </button>

          <h3 className="font-semibold mb-2">Credentials</h3>

          <pre className="whitespace-pre-wrap text-sm">{generatedPassword}</pre>

          <button
            onClick={() => navigator.clipboard.writeText(generatedPassword)}
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Copy Details
          </button>
        </div>
      )}

      {/* USER CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          users.map((u) => (
            <div
              key={u.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              {/* Name + Email */}
              <p className="text-lg font-medium">{u.full_name || u.email}</p>
              <p className="text-sm text-gray-600">{u.email}</p>

              <p className="text-xs text-gray-400 mt-1">
                Created {new Date(u.created_at).toLocaleString()}
              </p>

              {/* ROLE SELECTOR */}
              <div className="mt-3">
                <label className="text-sm font-medium">Role</label>
                <select
                  value={u.role}
                  onChange={(e) =>
                    handleRoleChange(
                      u.id,
                      e.target.value as "admin" | "super_admin"
                    )
                  }
                  className="mt-1 w-full border rounded px-2 py-1"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>

                {/* LOADING SPINNER */}
                {updatingRole === u.id && (
                  <div className="flex items-center gap-2 text-blue-600 text-xs mt-1">
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
                    <span>Updating role...</span>
                  </div>
                )}
              </div>

              {/* BUTTONS */}
              <div className="flex justify-between mt-4 text-sm">
                <button
                  onClick={() => setActiveUser(u)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Reset Password
                </button>

                <button
                  onClick={() => handleDelete(u.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* RESET PASSWORD MODAL */}
      {activeUser && (
        <ResetPasswordModal
          user={activeUser}
          onClose={() => setActiveUser(null)}
          onDone={(newPassword: string) => {
            setGeneratedPassword(
              `Email: ${activeUser.email}\nPassword: ${newPassword}`
            );
            setTimeout(() => setGeneratedPassword(""), 60000);
          }}
        />
      )}
      {modal.show && (
        <ConfirmModal
          title={modal.title}
          message={modal.message}
          type={modal.type}
          onConfirm={() => {
            modal.onConfirm?.();
            setModal({ ...modal, show: false });
          }}
          onCancel={() => setModal({ ...modal, show: false })}
        />
      )}
    </div>
  );
}
