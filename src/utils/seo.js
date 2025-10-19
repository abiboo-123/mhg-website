// src/utils/seo.js

const baseUrl = "https://mhg-website-phi.vercel.app"; // ✅ Centralized

export function getSeoMeta({
    lang,
    titleEn,
    titleDe,
    descEn,
    descDe,
    slug = "",
    image, // image should be a relative path or null
}) {
    // ✅ Ensure language is valid
    const title = lang === "de" ? titleDe : titleEn;
    const description = lang === "de" ? descDe : descEn;

    // ✅ Build canonical URL
    const url = slug
        ? `${baseUrl}/${lang}/${slug}`
        : `${baseUrl}/${lang}`;

    // ✅ Automatically generate absolute OG image URL with fallback
    let ogImage;
    if (image) {
        // If a relative path is provided, convert to absolute
        ogImage = image.startsWith("http")
            ? image
            : `${baseUrl}${image}`;
    } else {
        // ✅ Default fallback image
        ogImage = `${baseUrl}/assets/og-default.png`;
    }

    // ✅ Ensure correct format (Google recommends JPG or PNG with 1200x630)
    return {
        title,
        description,
        url,
        imageUrl: ogImage,
        imageWidth: 1200,
        imageHeight: 630,
    };
}
