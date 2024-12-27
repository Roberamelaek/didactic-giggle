import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MkdownEditor from '../../components/MkdownEditor.js'; // Correct import

export default function EditPage() {
  const router = useRouter();
  const { fileName } = router.query; // Get file name from URL

  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // For error handling
  const [isSaving, setIsSaving] = useState(false); // To disable Save button while saving

  useEffect(() => {
    if (fileName) {
      // Fetch the content of the Markdown file
      const fetchFile = async () => {
        try {
          const token = localStorage.getItem('github_token'); // Get the GitHub token
          const response = await fetch(`/api/get-file?file=${fileName}`, {
            method: 'GET',
            headers: {
              'github_token': token,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch file content');
          }
          const data = await response.json();
          if (data.content) {
            setFileContent(data.content);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchFile();
    }
  }, [fileName]);

  const handleSave = async (content) => {
    setIsSaving(true); // Disable save button while saving
    try {
        const token = localStorage.getItem('github_token'); // Get the GitHub token
      const response = await fetch('/api/save-file', {
        method: 'POST',
        headers: { 'github_token': token,'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, content }),
      });

      if (response.ok) {
        alert('File saved successfully!');
      } else {
        throw new Error('Failed to save the file.');
      }
    } catch (err) {
      setError(err.message); // Show error message
    } finally {
      setIsSaving(false); // Re-enable save button
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h1>Edit Markdown File: {fileName}</h1>
      <MkdownEditor initialContent={fileContent} onSave={handleSave} />
      <button onClick={() => handleSave(fileContent)} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}
