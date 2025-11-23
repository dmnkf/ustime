import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: import.meta.env.PROD ? "https://ustime-production.up.railway.app" : "http://localhost:3001"
})
