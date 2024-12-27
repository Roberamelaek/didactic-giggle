

// Updated /pages/api/auth.js
export default async (req, res) => {
    try {
        const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: req.body.code,
                scope: 'repo',
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(400).json({ error: data.error || 'Failed to authenticate' });
        }

        res.status(200).json({ accessToken: data.access_token });
    } catch (error) {
        console.error('OAuth error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

