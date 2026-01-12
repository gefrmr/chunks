export default async function handler(req, res) {
  const lang = req.query.lang || "NL";

  const response = await fetch(
    "https://script.google.com/macros/s/AKfycbxYjd0dAmTMCDl7XRump_vdj6zONXcKla3IHkU4cm7kAaBhQunZxy88nvPCPEEebEhd/exec?list=" + lang
  );

  const data = await response.json();

  res.setHeader("Content-Type", "application/json");
  res.status(200).send(JSON.stringify(data));
}
