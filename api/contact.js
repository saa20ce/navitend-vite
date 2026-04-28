import { handleContactRequest } from "../server/contactHandler.js";

export default async function handler(req, res) {
  return handleContactRequest(req, res);
}
