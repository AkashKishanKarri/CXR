import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";

export default function RequestForm() {

    const [products, setProducts] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        year: "",
        product: "",
        purpose: "",
        startTime: "",
        endTime: ""
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {

        const querySnapshot = await getDocs(collection(db, "products"));

        const list = [];

        querySnapshot.forEach((doc) => {
            list.push({
                id: doc.id,
                ...doc.data()
            });
        });

        setProducts(list);

    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        await addDoc(collection(db, "requests"), {
            ...formData,
            status: "pending",
            createdAt: new Date()
        });

        alert("Request Submitted Successfully");

    };

    return (

        <div className="inventory-sys-wrapper" style={{ padding: "80px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            
            <div style={{ width: "100%", maxWidth: "600px", display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                <Link to="/" className="btn-primary" style={{ padding: "10px 20px", textDecoration: "none" }}>&larr; Back to Home</Link>
            </div>

            <div className="glass-panel" style={{ width: "100%", maxWidth: "600px", padding: "40px" }}>

                <h2 className="text-gradient" style={{ textAlign: "center", marginBottom: "30px", fontSize: "2rem" }}>Equipment Request</h2>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

                    <input name="name" placeholder="Full Name" onChange={handleChange} required className="form-input" />
                    <input name="email" placeholder="Email" onChange={handleChange} required className="form-input" />
                    <input name="phone" placeholder="Phone Number" onChange={handleChange} required className="form-input" />
                    <input name="year" placeholder="Year" onChange={handleChange} required className="form-input" />

                    <select name="product" onChange={handleChange} required className="form-input">
                        <option value="">Select Product from Inventory</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.name}>
                                {p.name} ({p.available} Available)
                            </option>
                        ))}
                    </select>

                    <textarea name="purpose" placeholder="Purpose / Motivation" onChange={handleChange} rows="4" className="form-input" />

                    <div style={{ display: "flex", gap: "15px" }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "5px", display: "block" }}>Start Time</label>
                            <input type="datetime-local" name="startTime" onChange={handleChange} className="form-input" style={{ width: "100%" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "5px", display: "block" }}>End Time</label>
                            <input type="datetime-local" name="endTime" onChange={handleChange} className="form-input" style={{ width: "100%" }} />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: "20px", padding: "15px" }}>Submit Request</button>

                </form>
            </div>
            <style>{`
                .form-input {
                    padding: 12px 15px;
                    border-radius: 8px;
                    border: 1px solid var(--border-color);
                    background: rgba(255, 255, 255, 0.5);
                    color: var(--text-main);
                    font-family: var(--font-sans);
                    color-scheme: light dark;
                    outline: none;
                    transition: all 0.3s ease;
                }
                .form-input:focus {
                    border-color: var(--accent-color);
                    box-shadow: 0 0 0 2px rgba(0, 115, 103, 0.2);
                }
            `}</style>
        </div>

    );

}