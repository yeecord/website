import type { IronSessionOptions } from "iron-session";
import { type User } from "@utils/api";
import { withIronSessionApiRoute } from "iron-session/next";
import { type NextApiHandler } from "next";

const default_secret = "+RXqpG/85W1VsSxtGWattG3IbpJEFIdtN8nHuoIy8PY=";
export function withAuthApiRouter(handler: NextApiHandler): NextApiHandler {
  //allow no secret code on development mode
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.JWT_SECRET == null
  ) {
    throw new Error(
      "JWT secret not provided, try adding a JWT_SECRET variable to .env file?"
    );
  }

  const ironOptions: IronSessionOptions = {
    cookieName: "cute-fox",
    password: process.env.JWT_SECRET ?? default_secret,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      domain:
        process.env.NODE_ENV === "production" ? ".yeecord.com" : "localhost",
    },
    ttl: 604800,
  };

  return withIronSessionApiRoute(handler, ironOptions);
}

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
    token?: string;
    refresh?: string;
    scope?: string;
    exp?: number;
  }
}
