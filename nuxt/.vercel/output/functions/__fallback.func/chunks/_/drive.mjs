import { e as createError } from './nitro.mjs';
import { createSign } from 'crypto';

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const DRIVE_API = "https://www.googleapis.com/drive/v3";
const UPLOAD_API = "https://www.googleapis.com/upload/drive/v3/files";
function getServiceAccount() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!b64) return null;
  try {
    const json = JSON.parse(Buffer.from(b64, "base64").toString("utf-8"));
    return { client_email: json.client_email, private_key: json.private_key };
  } catch {
    return null;
  }
}
function base64Url(str) {
  return Buffer.from(str).toString("base64url");
}
function base64UrlSafe(buf) {
  return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
async function getAccessToken() {
  const sa = getServiceAccount();
  if (!sa) return null;
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1e3);
  const claim = {
    iss: sa.client_email,
    scope: SCOPES.join(" "),
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now
  };
  const b64Header = base64Url(JSON.stringify(header));
  const b64Claim = base64Url(JSON.stringify(claim));
  const signatureInput = `${b64Header}.${b64Claim}`;
  const sign = createSign("RSA-SHA256");
  sign.update(signatureInput);
  const sig = base64UrlSafe(sign.sign(sa.private_key, "buffer"));
  const jwt = `${signatureInput}.${sig}`;
  try {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt
      })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token || null;
  } catch {
    return null;
  }
}
async function listDriveFiles() {
  const token = await getAccessToken();
  if (!token) throw createError({ statusCode: 502, statusMessage: "Gagal mendapatkan akses Google Drive" });
  const res = await fetch(`${DRIVE_API}/files?q=mimeType='application/json'&orderBy=createdTime desc&pageSize=50&fields=files(id,name,size,createdTime)`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw createError({ statusCode: 502, statusMessage: "Gagal mengambil daftar file Drive" });
  const data = await res.json();
  return (data.files || []).map((f) => ({ id: f.id, name: f.name, size: Number(f.size || 0), createdTime: f.createdTime }));
}
async function uploadToDrive(name, jsonData) {
  const token = await getAccessToken();
  if (!token) throw createError({ statusCode: 502, statusMessage: "Gagal mendapatkan akses Google Drive" });
  const body = JSON.stringify(jsonData);
  const metadataRes = await fetch(`${UPLOAD_API}?uploadType=resumable`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Upload-Content-Type": "application/json"
    },
    body: JSON.stringify({ name, mimeType: "application/json" })
  });
  if (!metadataRes.ok) throw createError({ statusCode: 502, statusMessage: "Gagal iniciate upload ke Drive" });
  const uploadUrl = metadataRes.headers.get("location");
  if (!uploadUrl) throw createError({ statusCode: 502, statusMessage: "URL upload tidak ditemukan" });
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body
  });
  if (!uploadRes.ok) throw createError({ statusCode: 502, statusMessage: "Gagal upload file ke Drive" });
  const result = await uploadRes.json();
  return result.id || "";
}
async function downloadFromDrive(fileId) {
  const token = await getAccessToken();
  if (!token) throw createError({ statusCode: 502, statusMessage: "Gagal mendapatkan akses Google Drive" });
  const res = await fetch(`${DRIVE_API}/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw createError({ statusCode: 502, statusMessage: "Gagal download file dari Drive" });
  return await res.json();
}

export { downloadFromDrive as d, listDriveFiles as l, uploadToDrive as u };
//# sourceMappingURL=drive.mjs.map
