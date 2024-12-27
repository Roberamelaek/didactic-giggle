import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NotesList from "../components/NotesList";

export default function Welcome() {
    const router = useRouter();
    const { token } = router.query;
    const [userToken, setUserToken] = useState("");

    useEffect(() => {
        if (token) {
            setUserToken(token);
            // Store token in localStorage for persistence (optional)
            localStorage.setItem("github_token", token);
        } else {
            const storedToken = localStorage.getItem("github_token");
            if (storedToken) setUserToken(storedToken);
        }
    }, [token]);

    if (!userToken) return <p>Loading...</p>;

    return (
        <div>
            <h1>Welcome to Obsidian Hub</h1>
            <NotesList token={userToken} />
        </div>
    );
}

