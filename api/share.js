function getTextFromRequest(req) {
  // 1. Probeer body als object
  if (req.body && typeof req.body === "object" && "text" in req.body) {
    return req.body.text;
  }

  // 2. Probeer body als x-www-form-urlencoded string
  if (req.body && typeof req.body === "string") {
    try {
      const params = new URLSearchParams(req.body);
      if (params.has("text")) {
        return params.get("text");
      }
    } catch (e) {
      // negeren
    }
  }

  // 3. Val terug op query string (voor handmatig testen)
  if (req.query && typeof req.query.text === "string") {
    return req.query.text;
  }

  return "";
}

export default function handler(req, res) {
  const text = getTextFromRequest(req) || "";

  const escapedText = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const html = `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Toevoegen aan Chunks</title>
    </head>
    <body style="font-family: sans-serif; padding: 1.5rem; max-width: 600px; margin: 0 auto;">
      <h2>Toevoegen aan Chunks</h2>

      <form method="POST" action="/api/save">
        <label for="text"><strong>Gedeelde tekst:</strong></label><br>
        <textarea id="text" name="text" rows="4" style="width:100%;">${escapedText}</textarea><br><br>

        <strong>Kies kolom:</strong><br>
        <label>
          <input type="radio" name="lang" value="NL" checked> NL
        </label><br>
        <label>
          <input type="radio" name="lang" value="PT-BR"> PT-BR
        </label><br><br>

        <label for="translation"><strong>Vertaling (optioneel):</strong></label><br>
        <textarea id="translation" name="translation" rows="3" style="width:100%;"></textarea><br><br>

        <button type="submit">Opslaan</button>
      </form>
    </body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(html);
}
