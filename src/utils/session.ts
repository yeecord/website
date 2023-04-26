import type { IronSessionOptions } from "iron-session";
import { User } from "@utils/api";

if(process.env.NODE_ENV === 'production' && process.env.JWT_SECRET == null)
  throw new Error("JWT secret not provided.");

export const ironOptions: IronSessionOptions = {
  cookieName: "cute-fox",
  password: process.env.JWT_SECRET ?? 'ee52b95f4590fafe2d78139e9be65f96c9dc64948a5d3c4424de6b8e42629a089fa9dd9975b2f59d87cc94763a74ec416d3c34453d688d4dbbbc88a5f35c610c',
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
