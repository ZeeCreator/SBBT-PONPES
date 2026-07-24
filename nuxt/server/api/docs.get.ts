import { defineEventHandler, setHeader, createError } from 'h3'
import { readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export default defineEventHandler(async (event) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  // Try project root: nuxt/server/api -> .. -> .. -> root
  let filePath = join(__dirname, '..', '..', 'API.md')
  try {
    const contents = await readFile(filePath, 'utf-8')
    setHeader(event, 'content-type', 'text/markdown; charset=utf-8')
    return contents
  } catch (e) {
    // Fallback: maybe server is launched from project root directly
    const alt = join(__dirname, '..', 'API.md')
    try {
      const contents = await readFile(alt, 'utf-8')
      setHeader(event, 'content-type', 'text/markdown; charset=utf-8')
      return contents
    } catch (e2) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to read API.md: ${e2.message}`
      })
    }
  }
})