export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const scope = req.query.scope || 'repo,user';
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}`;
  res.redirect(authUrl);
}
