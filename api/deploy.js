export default async function handler(req, res) {

if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}

try {

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const { html, name } = req.body;

if (!VERCEL_TOKEN) {
return res.json({ error: "VERCEL_TOKEN belum di set" });
}

if (!html || !name) {
return res.json({ error: "Data tidak lengkap" });
}

const response = await fetch("https://api.vercel.com/v13/deployments", {
method: "POST",
headers: {
Authorization: `Bearer ${VERCEL_TOKEN}`,
"Content-Type": "application/json"
},
body: JSON.stringify({
name: name.toLowerCase(),
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

/* tampilkan error asli */
if (!data.url) {
return res.json({
error: data
});
}

return res.json({
ok: true,
url: "https://" + data.url
});

} catch (err) {
return res.json({
error: err.toString()
});
}

}
