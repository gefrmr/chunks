function parseFormBody(req) {
  // Als Vercel al een object geeft
  if (req.body && typeof req.body === "object") {
    return {
      text: req.body.text || "",
      lang: req.body.lang || "NL",
      translation: req.body.translation || ""
    };
  }

  // Als het een x-www-form-urlencoded string is
  if (req.body && typeof req.body === "string") {
    const params = new URLSearchParams(req.body);
    return {
      text: params.get("text") || "",
      lang: params.get("lang") || "NL",
      translation: params.get("translation") || ""
    };
  }

  // Fallback: query params
  const q = req.query || {};
  return {
    text: q.text || "",
    lang: q.lang || "NL",
    translation: q.translation || ""
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { text, lang, translation } = parseFormBody(req);

  // Stuur alles naar Apps Script
  await fetch("https://script.google.com/macros/s/AKfycbwiwLAf07rIVLd7MQN-zg5mNj8xQ7cQtsq8z8r8fo90yrPVPWByuC2F6OB43ebu5ovv/exec", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:
      "text=" + encodeURIComponent(text) +
      "&lang=" + encodeURIComponent(lang) +
      "&translation=" + encodeURIComponent(translation)
  });

  const html = `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Toegevoegd aan Chunks</title>
    </head>
    <body style="font-family: sans-serif; padding: 2rem; text-align: center;">
      <h2>Toegevoegd aan Chunks</h2>
      <p>Je kunt dit venster nu sluiten.</p>
    </body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(html);
}
