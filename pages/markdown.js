// pages/markdown.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";

export default function MarkdownViewer() {
    const router = useRouter();
    const { token, file } = router.query;
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!file || !token) return;

        async function fetchMarkdown() {
            setLoading(true);
            try {
                const response = await fetch(`/api/markdown?token=${token}&file=${file}`);
                const data = await response.json();

                if (data.error) throw new Error(data.error);

                setContent(data.content); // Set the Markdown content
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchMarkdown();
    }, [file, token]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>{file}</h1>
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
}

