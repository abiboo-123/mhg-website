// src/pages/[...slug].ts
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, url }) => {
  const path = url.pathname;

  // ✅ Allow homepage, Astro will generate it normally
  if (path === "/" || path === "") {
    return new Response(null, { status: 404 });
  }

  // ✅ Allow assets, images, etc.
  if (path.startsWith("/assets") || path.includes(".")) {
    return new Response(null, { status: 404 });
  }

  // ✅ If the path already includes /en or /de, let Astro handle it normally
  const isLangPrefixed = /^\/(en|de)(\/|$)/.test(path);
  if (isLangPrefixed) {
    return new Response(null, { status: 404 });
  }

  // ✅ Any other route → redirect to default language
  const slugParts = params.slug;
  const slug = Array.isArray(slugParts) ? slugParts.join("/") : slugParts ?? "";

  return new Response(null, {
    status: 307,
    headers: {
      Location: `/en/${slug}`,
    },
  });
};
