import { useState } from "react"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "../firebase/firebaseConfig"
import { useNavigate, Link } from "react-router-dom"

export default function AdminLogin() {

    const navigate = useNavigate()
    const [error, setError] = useState("")

    // Define authorized admin emails here
    const ALLOWED_EMAILS = [
        "akashkishankarri@gmail.com",
        "skedaris2@gitam.in",
        "nmeesala@gitam.edu",
        "skotha4@gitam.in",
        "seegam@gitam.in",
        "dummycxr@gmail.com"
    ]

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider)
            const userEmail = result.user?.email || ""

            if (ALLOWED_EMAILS.includes(userEmail)) {
                navigate("/dashboard")
            } else {
                await auth.signOut()
                setError(`Access denied. ${userEmail} is not an authorized admin.`)
            }
        } catch (err) {
            setError("Google sign-in failed")
        }
    }

    return (
        <div className="inventory-sys-wrapper" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", position: "relative" }}>
            <Link to="/" className="btn-primary" style={{ position: "absolute", top: "20px", left: "20px", textDecoration: "none" }}>&larr; Home</Link>
            <div className="glass-panel" style={{ width: "100%", maxWidth: "400px", padding: "40px" }}>
                <h2 className="text-gradient" style={{ textAlign: "center", marginBottom: "30px", fontSize: "2rem" }}>Admin Portal</h2>

                {error && <p style={{ color: "#d93025", backgroundColor: "#fce8e6", padding: "10px", borderRadius: "5px", textAlign: "center", fontSize: "0.9rem" }}>{error}</p>}

                <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
                    <button type="button" onClick={handleGoogleLogin} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "12px", border: "1px solid var(--border-color)", borderBottom: "3px solid var(--border-color)", borderRadius: "8px", backgroundColor: "white", color: "#333", fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </button>
                </div>
            </div>

            <style>{`
                .form-input {
                    padding: 12px 15px;
                    border-radius: 8px;
                    border: 1px solid var(--border-color);
                    background: rgba(255, 255, 255, 0.5);
                    color: var(--text-main);
                    font-family: var(--font-sans);
                    outline: none;
                    transition: all 0.3s ease;
                }
                .form-input:focus {
                    border-color: var(--accent-color);
                    box-shadow: 0 0 0 2px rgba(0, 115, 103, 0.2);
                }
            `}</style>
        </div>
    )
}