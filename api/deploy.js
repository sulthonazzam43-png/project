export default async function handler(req, res) {

if (req.method !== "POST") {
  return res.status(405).json({ error: "Method not allowed" });
}

try {

  const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

  if (!VERCEL_TOKEN) {
    return res.json({ error: "VERCEL_TOKEN belum di set" });
  }

  const { html, name } = req.body;

  if (!html || !name) {
    return res.json({ error: "HTML atau domain kosong" });
  }

  /* bersihkan domain */
  const domain = name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");

  /*
  DEPLOY KE VERCEL API
  */
  const response = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: domain,
      target: "production",

      projectSettings: {
        framework: null
      },

      files: [
        {
          file: "index.html",
          data: html
        }
      ]
    })
  });

  const data = await response.json();

  /* tampilkan error asli jika gagal */
  if (!data.url) {
    return res.json({
      error: data
    });
  }

  /* hasil domain clean */
  return res.json({
    ok: true,
    url: `https://${domain}.vercel.app`
  });

} catch (err) {

  return res.json({
    error: err.toString()
  });

}

}
