import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const res = await fetch(
      "https://app.formbricks.com/api/v1/surveys/cmfu9p5592hrbwx01bg4hjfsf/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-environment-id": import.meta.env.FORMBRICKS_ENV_ID, // use env var
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
};
