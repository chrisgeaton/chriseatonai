// functions/api/generate.js
// Cloudflare Pages Function — proxies requests to Anthropic API.
// Your API key lives in Cloudflare environment variables, never in the browser.
//
// SETUP:
//   1. In Cloudflare dashboard → Pages → your project → Settings → Environment Variables
//   2. Add: ANTHROPIC_API_KEY = sk-ant-...  (encrypt it)
//   3. Deploy — done.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://chriseatonai.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const { prompt } = body;
  if (!prompt || typeof prompt !== "string") {
    return Response.json(
      { error: "Missing prompt" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  // Guard against abuse — cap prompt length
  if (prompt.length > 12000) {
    return Response.json(
      { error: "Prompt too long" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "API key not configured" },
      { status: 500, headers: CORS_HEADERS }
    );
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", err);
      return Response.json(
        { error: "Upstream API error" },
        { status: 502, headers: CORS_HEADERS }
      );
    }

    const data = await response.json();
    return Response.json(data, { status: 200, headers: CORS_HEADERS });

  } catch (err) {
    console.error("Handler error:", err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
