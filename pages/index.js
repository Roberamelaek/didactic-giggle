import { useState } from "react";
import NotesList from "../components/NotesList";

export default function Home() {
    const [token, setToken] = useState("");

    const handleLogin = () => {
        // Redirect user to GitHub login
        window.location.href = `https://github.com/login/oauth/authorize?client_id=Ov23liuY8REM7aVKMhsB&scope=repo`;
    };

    return (
        <div>
            <h1>Obsidian Hub</h1>
            {!token ? (
                <button onClick={handleLogin}>Login with GitHub</button>
            ) : (
                <NotesList token={token} />
            )}
        </div>
    );
}
