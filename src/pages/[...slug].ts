// src/pages/[...slug].ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, url }) => {
  const path = url.pathname;

  // Check if already language-prefixed
  const isLangPrefixed = /^\/(en|de|ar)(\/|$)/.test(path);
  if (isLangPrefixed) {
    // Let Astro's normal 404 handling take over
    return new Response(null, { status: 404 });
  }

  // Reconstruct the slug
  const slugParts = params.slug || [];
  const slug = Array.isArray(slugParts) ? slugParts.join('/') : slugParts;

  return new Response(null, {
    status: 307,
    headers: {
      Location: `/de/${slug}`,
    },
  });
};
