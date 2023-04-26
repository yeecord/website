import { withAuthApiRouter } from "@utils/session";

export default withAuthApiRouter((req, res) => {
  return res.json(req.session.user);
});
