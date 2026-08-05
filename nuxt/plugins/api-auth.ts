export default defineNuxtPlugin(() => {
  // Session cookie is set by server on login and automatically included in all fetch requests.
  // The server middleware (server/middleware/auth.ts) verifies the cookie on each API request.
  // No additional client-side auth injection needed.
})
