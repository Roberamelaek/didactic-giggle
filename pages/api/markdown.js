// pages/api/markdown.js
import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
    const { token, file } = req.query;

    if (!token || !file) {
        return res.status(400).json({ error: "Missing token or file parameter" });
    }

    try {
        // Initialize Octokit with the provided token
        const octokit = new Octokit({ auth: token });

        // Fetch the content of the file from the repository
        const { data } = await octokit.rest.repos.getContent({
            owner: "Roberamelaek", // Your GitHub username
            repo: "ObsidianNotes", // Repository name
            path: `Daily/${file}`, // Path to the Markdown file
        });

        // GitHub API returns the content in base64 format
        const content = Buffer.from(data.content, 'base64').toString('utf-8');

        // Return the content of the Markdown file
        res.status(200).json({ content });
    } catch (err) {
        console.error("Error fetching markdown content:", err);
        res.status(500).json({ error: "Failed to fetch markdown content" });
    }
}
