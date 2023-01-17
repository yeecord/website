import { API_ENDPOINT, CDN_ENDPOINT } from "../../config";

export async function fetchUser() {
    const res = await fetch(`${API_ENDPOINT}/users/@me`, {
        credentials: "include",
    });

    //optional: use zod
    return (await res.json()) as User;
}

export function resolveUserAvatar(user: User) {
    if (user.avatar)
        return `${CDN_ENDPOINT}/avatars/${user.id}/${user.avatar}.${
            user.avatar.startsWith("a_") ? "gif" : "png"
        }`;

    return `${CDN_ENDPOINT}/embed/avatars/${user.discriminator % 5}.png`;
}

export type User = {
    id: string;
    username: string;
    discriminator: number;
    avatar?: string;
};

export async function fetchGuild(): Promise<{
    serverMembers: number;
    guildCount: number;
}> {
    const { approximate_member_count } = await fetch(
        "https://discord.com/api/v10/invites/yeecord?with_counts=true"
    ).then((r) => r.json());

    const info = await fetch(`${API_ENDPOINT}/info`).then((r) => r.json());

    return {
        serverMembers: approximate_member_count as number,
        guildCount: info.guilds,
    };
}
