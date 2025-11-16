import ImageKit from "imagekit";

export const GET = async () => {
  const imagekit = new ImageKit({
    publicKey: import.meta.env.PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: import.meta.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: import.meta.env.PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  });

  const authParams = imagekit.getAuthenticationParameters();

  return new Response(JSON.stringify(authParams), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
};
