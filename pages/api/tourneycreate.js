import TourneyFunc from "@/components/tourneyfunc";
export default async function handler(req, res) {
  return TourneyFunc(req,res)
  return res.status(401).json({ error: 'Unauthorized' });
};
