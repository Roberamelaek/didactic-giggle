
import React, { useState } from 'react';
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import MarkdownIt from 'markdown-it';

const MkdownEditor = ({ initialContent, onSave }) => {
  const [content, setContent] = useState(initialContent);
  const [selectedTab, setSelectedTab] = useState("write");

  const handleEditorChange = (value) => {
    setContent(value); // Update state when editor content changes
  };

  const handleSave = () => {
    onSave(content);
  };

  const md = new MarkdownIt();

  return (
    <div>
      <ReactMde
        value={content}
        onChange={handleEditorChange}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
      <button onClick={handleSave}>Save</button>
      <h2>Preview</h2>
      <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
    </div>
  );
};

export default MkdownEditor;

