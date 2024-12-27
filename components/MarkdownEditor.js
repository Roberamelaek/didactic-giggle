import React, { useState } from 'react';
import { Editor } from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css'; // Import editor styles
import ReactMarkdown from 'react-markdown';

export default function MarkdownEditor({ initialContent}) {
  const [content, setContent] = useState(initialContent);

  const handleEditorChange = ({ text }) => {
    setContent(text); // Update state when editor content changes
  };

  const handleSave = () => {
    onSave(content); // Call parent function to save content
  };

  return (
    <div>
      <Editor
        value={content}
        onChange={handleEditorChange}
        renderHTML={(text) => text} // Keep text as it is for now
      />
      <div>
        <button onClick={handleSave}>Save</button>
      </div>
      <h2>Preview</h2>
      <div>
        <ReactMarkdown>{content}</ReactMarkdown> {/* Markdown preview */}
      </div>
    </div>
  )
}

