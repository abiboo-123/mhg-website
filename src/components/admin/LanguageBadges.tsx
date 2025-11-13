import React from "react";

interface Props {
  hasEN?: boolean;
  hasDE?: boolean;
  eventId?: string;
}

export default function LanguageBadges({ hasEN, hasDE, eventId }: Props) {
  return (
    <div className="flex items-center gap-2">
      {/* English */}
      {hasEN ? (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-300">
          EN
        </span>
      ) : (
        <a
          href={`/admin/events/${eventId}/add-translation?lang=en`}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-300 hover:bg-blue-50 hover:text-blue-700 transition-colors"
          title="Add English translation"
        >
          EN <span className="text-base leading-none">+</span>
        </a>
      )}

      {/* German */}
      {hasDE ? (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
          DE
        </span>
      ) : (
        <a
          href={`/admin/events/${eventId}/add-translation?lang=de`}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-300 hover:bg-yellow-50 hover:text-yellow-700 transition-colors"
          title="Add German translation"
        >
          DE <span className="text-base leading-none">+</span>
        </a>
      )}
    </div>
  );
}
