import type { IronSessionOptions } from "iron-session";
import { User } from "@utils/api";

if(!process.env.JWT_SECRET)
  throw new Error("JWT secret not provided.");

export const ironOptions: IronSessionOptions = {
  cookieName: "cute-fox",
  password: process.env.JWT_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    domain: process.env.NODE_ENV === "production" ? ".yeecord.com" : "localhost",
  },
  ttl: 604800,
};

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
    token?: string;
    refresh?: string;
    scope?: string;
    exp?: number;
  }
}
