export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const response = await fetch(
        "https://app.formbricks.com/api/v1/surveys/cmfu9p5592hrbwx01bg4hjfsf/responses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-environment-id": process.env.FORMBRICKS_ENV_ID,
          },
          body: JSON.stringify(req.body),
        }
      );
  
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
  