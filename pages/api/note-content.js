import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
    const { token, file } = req.query;

    if (!token || !file) {
        return res.status(400).json({ error: "Missing token or file parameter" });
    }

    try {
        const octokit = new Octokit({ auth: token });
        const owner = "Roberamelaek";
        const repo = "ObsidianNotes";
        const path = `Daily/${file}`;

        console.log(`Fetching file from GitHub: ${owner}/${repo}/${path}`);

        const { data } = await octokit.request(
            "GET /repos/{owner}/{repo}/contents/{path}",
            { owner, repo, path }
        );

        const content = Buffer.from(data.content, "base64").toString("utf-8");

        return res.status(200).json({ content });
    } catch (err) {
        console.error("Error fetching note content:", err);
        return res.status(500).json({ error: "Failed to fetch note content" });
    }
}

