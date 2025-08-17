// src/pages/[...slug].ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, url }) => {
  
  const path = url.pathname;

  const isLangPrefixed = /^\/(en|de|ar)(\/|$)/.test(path);
  if (isLangPrefixed) {
    return new Response(null, { status: 404 });
  }

  const slugParts = params.slug;
  const slug = Array.isArray(slugParts)
    ? slugParts.join('/')
    : (slugParts ?? '');

  return new Response(null, {
    status: 307,
    headers: {
      Location: `/de/${slug}`,
    },
  });
};
