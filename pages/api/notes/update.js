import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
    const { name, content, token } = req.body;

    if (!token) return res.status(400).json({ error: "Missing GitHub token" });

    const octokit = new Octokit({ auth: token });

    try {
        // Get file metadata (to retrieve the `sha`)
        const { data: file } = await octokit.repos.getContent({
            owner: "Roberamelaek",
            repo: "ObsidianNotes",
            path: `Daily/${name}`,
        });

        // Update file
        await octokit.repos.createOrUpdateFileContents({
            owner: "Roberamelaek",
            repo: "ObsidianNotes",
            path: `Daily/${name}`,
            message: `Update note: ${name}`,
            content, // Base64-encoded content
            sha: file.sha, // Required to update an existing file
        });

        res.status(200).json({ message: "Note updated successfully!" });
    } catch (err) {
        console.error("Error updating note:", err);
        res.status(500).json({ error: "Failed to update note" });
    }
}
