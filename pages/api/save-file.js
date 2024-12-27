import { Octokit } from '@octokit/rest';

export default async function handler(req, res) {
  const { fileName, content } = req.body;

  if (!fileName || !content) {
    return res.status(400).json({ error: 'File name and content are required' });
  }

  try {
    const token = req.headers['github_token']; // Get the GitHub token from request headers
    if (!token) {
      return res.status(401).json({ error: 'GitHub token is required' });
    }

    const octokit = new Octokit({ auth: token });

    const owner = 'Roberamelaek'; // Replace with your GitHub username
    const repo = 'ObsidianNotes'; // Replace with your repository name
    const path = `Daily/${fileName}`;

    console.log(`Fetching file: ${path} from repo: ${owner}/${repo}`);

    // Fetch the current file content to get the 'sha' for updating the file
    const { data: fileData } = await octokit.repos.getContent({
      owner: owner,
      repo: repo,
      path: path,
    });

    console.log(`Fetched file data: ${JSON.stringify(fileData)}`);

    // Extract the 'sha' to update the file
    const { sha } = fileData;

    // Update the file with the new content
    await octokit.repos.createOrUpdateFileContents({
      owner: owner,
      repo: repo,
      path: path,
      message: 'Update markdown file',
      content: Buffer.from(content).toString('base64'), // Encode content to base64
      sha, // Include the 'sha' to update the existing file
    });

    return res.status(200).json({ message: 'File updated successfully' });
  } catch (err) {
    console.error('Error updating file:', err);
    if (err.status === 404) {
      return res.status(404).json({ error: 'File not found' });
    }
    return res.status(500).json({ error: 'Failed to save file' });
  }
}

