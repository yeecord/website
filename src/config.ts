import { User } from "./types";

export const isProduction = process.env.NODE_ENV === "production"
export const API_ENDPOINT = isProduction ? "https://api.yeecord.com" : "http://localhost:3001"
export const CDN_ENDPOINT = "https://cdn.discordapp.com"

export const formatter = new Intl.NumberFormat()

export function resolveUserAvatar(user: User) {
	if(user.avatar)
		return `${CDN_ENDPOINT}/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}`

	return `${CDN_ENDPOINT}/embed/avatars/${user.discriminator % 5}.png`
}