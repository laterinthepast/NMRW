export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const data = await response.json();
    const token = data.access_token;
    const script = `
      <script>
        (function() {
          function receiveMessage(e) {
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify({ token, provider: 'github' })}',
              e.origin
            );
          }
          window.addEventListener("message", receiveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        })()
      </script>
    `;
    res.setHeader('Content-Type', 'text/html');
    return res.send(script);
  } catch (err) {
    return res.status(500).json({ error: 'OAuth failed' });
  }
}
