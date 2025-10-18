// src/utils/i18n.js
import eventsData from '../data/events.translated.json' assert { type: 'json' };

export const SUPPORTED_LANGUAGES = ['en', 'de'];

/**
 * Generate static paths for any [lang]/[slug] route
 * Used for: /events/[slug], /feedback/[slug], /past-events/[slug], /register/[slug]
 */
export function generateStaticPathsForEventSlugs() {
    const paths = [];
    for (const lang of SUPPORTED_LANGUAGES) {
        const events = eventsData[lang] || [];
        for (const event of events) {
            paths.push({
                params: { lang, slug: event.slug },
            });
        }
    }
    return paths;
}

/**
 * Generate static paths for pages that use only [lang] (no slug)
 * e.g. /[lang]/contact or /[lang]/about
 */
export function generateStaticPaths() {
    return SUPPORTED_LANGUAGES.map((lang) => ({ params: { lang } }));
}
