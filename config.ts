export const isProduction = process.env.NODE_ENV === "production"

export const API_ENDPOINT = isProduction ? "https://api.yeecord.com" : "http://localhost:3001"

export const formatter = new Intl.NumberFormat()