import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
    const { token } = req.query;

    // Check if the token is provided
    if (!token) {
        console.error("Missing GitHub token");
        // Return early with the error response
        return res.status(400).json({ error: "Missing token" });
    }

    try {
        // Initialize Octokit with the provided token
        const octokit = new Octokit({ auth: token });

        // Debug: Test authentication to ensure the token is valid
        const { data: user } = await octokit.rest.users.getAuthenticated();
        console.log("Authenticated user:", user.login);

        // Set the repository details (replace with your own)
        const owner = "Roberamelaek";  // GitHub username
        const repo = "ObsidianNotes";  // Repository name
        const path = "Daily";  // Folder path in the repository

        // Fetch the contents of the specified folder in the repo
        const { data: files } = await octokit.request(
            "GET /repos/{owner}/{repo}/contents/{path}",
            {
                owner,
                repo,
                path,
            }
        );

        // If the files are empty or not found, handle it
        if (!files || files.length === 0) {
            console.log("No files found in the specified path.");
            return res.status(404).json({ error: "No files found" });
        }

        // Filter out the Markdown files (those ending with .md)
        const markdownFiles = files.filter((file) =>
            file.name.endsWith(".md")
        );

        // If no markdown files are found
        if (markdownFiles.length === 0) {
            console.log("No Markdown files found in the specified path.");
            return res.status(404).json({ error: "No Markdown files found" });
        }

        // Respond with the list of Markdown files
        return res.status(200).json(markdownFiles); // Fixed syntax here
    } catch (err) {
        console.error("Error fetching notes:", err);

        // Handle specific errors related to GitHub API
        if (err.response) {
            console.error("GitHub API Error:", err.response.data);
            return res.status(err.response.status).json({
                error: err.response.data.message || "GitHub API error",
            });
        }

        // General error handling
        return res.status(500).json({ error: "Failed to fetch notes" });
    }
}
