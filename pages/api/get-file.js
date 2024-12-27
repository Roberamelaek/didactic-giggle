

import { Octokit } from '@octokit/rest';

const getFile = async (req, res) => {
  try {
    
    // Set the repository details (replace with your own)
    const owner = "Roberamelaek";  // GitHub username
    const repo = "ObsidianNotes";  // Repository name
    const path = `Daily/${req.query.file}`;  // Folder path in the repository

    // You should send the GitHub token from the client side (e.g., via headers or body)
    const storedToken = req.headers['github_token'];  // Get the token from request headers

    if (!storedToken) {
      return res.status(400).json({ error: 'GitHub token is missing' });
    }

    const octokit = new Octokit({ auth: storedToken });

    try {
      const response = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: path,  // Correct variable used here
      });

      if (!response.data.content) {
        return res.status(204).json({ message: 'File exists but is empty' });
      }

      const content = Buffer.from(response.data.content, 'base64').toString('utf8');
      return res.status(200).json({ content });
    } catch (apiError) {
      if (apiError.status === 404) {
        return res.status(404).json({ error: 'File not found' });
      }
      console.error('GitHub API error:', apiError);
      return res.status(500).json({ error: 'Failed to fetch file from repository', details: apiError.message });
    }
  } catch (error) {
    console.error('Internal server error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

export default getFile;

