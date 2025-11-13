interface ConfirmModalProps {
  title: string;
  message: string;
  type?: "info" | "success" | "error" | "confirm";
  onConfirm?: () => void;
  onCancel?: () => void;
}

export default function ConfirmModal({
  title,
  message,
  type = "info",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  // Tailwind-safe fixed classes
  const colors = {
    info: {
      title: "text-blue-700",
      btn: "bg-blue-600 hover:bg-blue-700",
    },
    success: {
      title: "text-green-700",
      btn: "bg-green-600 hover:bg-green-700",
    },
    error: {
      title: "text-red-700",
      btn: "bg-red-600 hover:bg-red-700",
    },
    confirm: {
      title: "text-red-700",
      btn: "bg-red-600 hover:bg-red-700",
    },
  };

  const c = colors[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl p-6 w-80 animate-fadeIn">
        {/* Title */}
        <h2 className={`text-lg font-semibold mb-2 ${c.title}`}>{title}</h2>

        {/* Message */}
        <p className="text-gray-600 mb-4">{message}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          {type === "confirm" ? (
            <>
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                className={`px-4 py-2 rounded text-white ${c.btn}`}
              >
                Confirm
              </button>
            </>
          ) : (
            <button
              onClick={onCancel}
              className={`px-4 py-2 rounded text-white ${c.btn}`}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
