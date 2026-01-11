export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const text = req.query.text || "";
  const url = req.query.url || "";

  try {
    await fetch("https://script.google.com/macros/s/AKfycbwiwLAf07rIVLd7MQN-zg5mNj8xQ7cQtsq8z8r8fo90yrPVPWByuC2F6OB43ebu5ovv/exec", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:
        "text=" + encodeURIComponent(text) +
        "&url=" + encodeURIComponent(url)
    });

    return res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error");
  }
}

