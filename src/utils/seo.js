// src/utils/seo.js
export function getSeoMeta({ lang, titleEn, titleDe, descEn, descDe, slug, image }) {
    const baseUrl = "https://mhg-website-phi.vercel.app";
    const title = lang === "de" ? titleDe : titleEn;
    const description = lang === "de" ? descDe : descEn;
    const url = `${baseUrl}/${lang}/${slug}`;
    const imageUrl = image
        ? `${baseUrl}${image.startsWith('/') ? image : '/' + image}`
        : `${baseUrl}/assets/MHG_Logo.svg`;

    return { title, description, url, imageUrl };
}
