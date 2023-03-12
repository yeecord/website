import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "@utils/session";
import { NextApiRequest, NextApiResponse } from "next";

function user(req: NextApiRequest, res: NextApiResponse) {
  return res.json(req.session.user);
}

export default withIronSessionApiRoute(user, ironOptions);