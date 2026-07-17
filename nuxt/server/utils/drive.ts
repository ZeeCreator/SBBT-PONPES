import { createSign } from 'crypto'

const SCOPES = ['https://www.googleapis.com/auth/drive.file']
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const DRIVE_API = 'https://www.googleapis.com/drive/v3'
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3/files'

function getServiceAccount(): { client_email: string; private_key: string } | null {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (!b64) return null
  try {
    const json = JSON.parse(Buffer.from(b64, 'base64').toString('utf-8'))
    return { client_email: json.client_email, private_key: json.private_key }
  } catch { return null }
}

function base64Url(str: string): string {
  return Buffer.from(str).toString('base64url')
}

function base64UrlSafe(buf: Buffer): string {
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

async function getAccessToken(): Promise<string | null> {
  const sa = getServiceAccount()
  if (!sa) return null

  const header = { alg: 'RS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const claim = {
    iss: sa.client_email,
    scope: SCOPES.join(' '),
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now,
  }

  const b64Header = base64Url(JSON.stringify(header))
  const b64Claim = base64Url(JSON.stringify(claim))
  const signatureInput = `${b64Header}.${b64Claim}`

  const sign = createSign('RSA-SHA256')
  sign.update(signatureInput)
  const sig = base64UrlSafe(sign.sign(sa.private_key, 'buffer'))

  const jwt = `${signatureInput}.${sig}`

  try {
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    })
    if (!res.ok) return null
    const data: any = await res.json()
    return data.access_token || null
  } catch { return null }
}

export async function listDriveFiles(): Promise<{ id: string; name: string; size: number; createdTime: string }[]> {
  const token = await getAccessToken()
  if (!token) throw createError({ statusCode: 502, statusMessage: 'Gagal mendapatkan akses Google Drive' })

  const res = await fetch(`${DRIVE_API}/files?q=mimeType='application/json'&orderBy=createdTime desc&pageSize=50&fields=files(id,name,size,createdTime)`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw createError({ statusCode: 502, statusMessage: 'Gagal mengambil daftar file Drive' })
  const data: any = await res.json()
  return (data.files || []).map((f: any) => ({ id: f.id, name: f.name, size: Number(f.size || 0), createdTime: f.createdTime }))
}

export async function uploadToDrive(name: string, jsonData: Record<string, any>): Promise<string> {
  const token = await getAccessToken()
  if (!token) throw createError({ statusCode: 502, statusMessage: 'Gagal mendapatkan akses Google Drive' })

  const body = JSON.stringify(jsonData)
  const metadataRes = await fetch(`${UPLOAD_API}?uploadType=resumable`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Upload-Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, mimeType: 'application/json' }),
  })
  if (!metadataRes.ok) throw createError({ statusCode: 502, statusMessage: 'Gagal iniciate upload ke Drive' })

  const uploadUrl = metadataRes.headers.get('location')
  if (!uploadUrl) throw createError({ statusCode: 502, statusMessage: 'URL upload tidak ditemukan' })

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
  if (!uploadRes.ok) throw createError({ statusCode: 502, statusMessage: 'Gagal upload file ke Drive' })
  const result: any = await uploadRes.json()
  return result.id || ''
}

export async function downloadFromDrive(fileId: string): Promise<Record<string, any>> {
  const token = await getAccessToken()
  if (!token) throw createError({ statusCode: 502, statusMessage: 'Gagal mendapatkan akses Google Drive' })

  const res = await fetch(`${DRIVE_API}/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw createError({ statusCode: 502, statusMessage: 'Gagal download file dari Drive' })
  return await res.json()
}
