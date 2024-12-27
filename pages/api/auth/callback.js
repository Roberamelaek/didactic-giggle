
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";

export default async function handler(req, res) {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: "Missing authorization code" });
    }

    try {
        // Exchange code for an access token
        const auth = createOAuthAppAuth({
            clientType: "oauth-app",
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        });

        const {
            token: accessToken,
        } = await auth({
            type: "token",
            code,
        });

        // Redirect the user to the home page with the token
        res.redirect(`/welcome?token=${accessToken}`);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to authenticate" });
    }
}

