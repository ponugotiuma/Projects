// Server-only helper for Lovable AI Gateway (OpenAI-compatible chat completions).

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content:
    | string
    | Array<
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string } }
      >;
};

export async function callGemini(opts: {
  model?: string;
  messages: ChatMessage[];
  responseJson?: boolean;
}) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: opts.model ?? "google/gemini-2.5-flash",
      messages: opts.messages,
      ...(opts.responseJson ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("AI is busy right now — please try again in a minute.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in Settings → Workspace.");
    throw new Error(`AI request failed (${res.status}): ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? "";
}

export function tryParseJson<T = unknown>(s: string): T | null {
  if (!s) return null;
  // Strip code fences if present
  const cleaned = s
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Try to extract first {...} block
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}
