// components/NotesList.js

import { useEffect, useState } from "react";

export default function NotesList({ token }) {
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchNotes() {
            try {
                const response = await fetch(`api/notes?token=${token}`,
);

                const data = await response.json();
                if (data.error) throw new Error(data.error);
                setNotes(data);
            } catch (err) {
                setError(err.message);
            }
        }

        fetchNotes();
    }, [token]);

    if (error) return <p>Error: {error}</p>;
    if (!notes.length) return <p>Loading...</p>;

    return (
        <ul>
            {notes.map((note) => (
                <li key={note.sha}>
                    <a href={note.download_url} target="_blank" rel="noreferrer">
                        {note.name}
                    </a>
                    {/* Add link to edit page */}
                    <a href={`/edit/${note.name}`} style={{ marginLeft: '10px' }}>Edit</a>
                </li>
            ))}
        </ul>
    );
}

