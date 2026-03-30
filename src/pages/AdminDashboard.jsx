import { useEffect, useState } from "react"
import { db } from "../firebase/firebaseConfig"

import {
    collection,
    getDocs,
    updateDoc,
    addDoc,
    doc,
    query,
    where
} from "firebase/firestore"

import emailjs from "@emailjs/browser"

export default function AdminDashboard() {

    const [requests, setRequests] = useState([])
    const [inventory, setInventory] = useState([])
    const [newProduct, setNewProduct] = useState({ name: "", available: 0 })
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0
    })

    useEffect(() => {
        loadRequests()
        loadInventory()
    }, [])

    const loadRequests = async () => {

        const snapshot = await getDocs(collection(db, "requests"))

        const list = []

        let pending = 0
        let approved = 0

        snapshot.forEach((d) => {

            const data = d.data()

            if (data.status === "pending") pending++
            if (data.status === "approved") approved++

            list.push({
                id: d.id,
                ...data
            })

        })

        setRequests(list)

        setStats({
            total: list.length,
            pending,
            approved
        })

    }

    // INVENTORY FUNCTIONS
    const loadInventory = async () => {
        const snapshot = await getDocs(collection(db, "products"))
        const list = []
        snapshot.forEach(docSnap => {
            list.push({ id: docSnap.id, ...docSnap.data() })
        })
        setInventory(list)
    }

    const handleAddProduct = async (e) => {
        e.preventDefault()
        if (!newProduct.name.trim() || newProduct.available < 0) return
        await addDoc(collection(db, "products"), {
            name: newProduct.name.trim(),
            available: Number(newProduct.available)
        })
        setNewProduct({ name: "", available: 0 })
        loadInventory()
    }

    const handleUpdateQuantity = async (id, currentQty, amount) => {
        const newQty = currentQty + amount
        if (newQty < 0) return
        const productRef = doc(db, "products", id)
        await updateDoc(productRef, { available: newQty })
        loadInventory()
    }

    // EMAIL FUNCTION
    const sendApprovalMail = (request) => {

        emailjs.send(
            "service_m40e3oi",
            "template_9azo75c",
            {
                name: request.name,
                email: request.email,
                product: request.product,
                start: request.startTime,
                end: request.endTime
            },
            "fEe8-gn6xJArF7pnO"
        )
            .then(() => console.log("Email sent"))
            .catch((err) => console.log("Email error", err))

    }

    // APPROVE REQUEST
    const approveRequest = async (request) => {

        const snapshot = await getDocs(collection(db, "requests"))

        const start = new Date(request.startTime)
        const end = new Date(request.endTime)

        for (let docSnap of snapshot.docs) {

            const r = docSnap.data()

            if (
                r.product === request.product &&
                r.status === "approved"
            ) {

                const existingStart = new Date(r.startTime)
                const existingEnd = new Date(r.endTime)

                const overlap =
                    start < existingEnd &&
                    end > existingStart

                if (overlap) {

                    alert("Booking conflict! Device already reserved for this time.")

                    return

                }

            }

        }

        // If no conflict → approve

        const requestRef = doc(db, "requests", request.id)

        await updateDoc(requestRef, {
            status: "approved"
        })

        // decrease hardware count
        const q = query(
            collection(db, "products"),
            where("name", "==", request.product)
        )

        const productSnap = await getDocs(q)

        productSnap.forEach(async (p) => {

            const productRef = doc(db, "products", p.id)

            const current = p.data().available

            await updateDoc(productRef, {
                available: current - 1
            })

        })

        sendApprovalMail(request)

        loadRequests()

    }

    // REJECT REQUEST
    const rejectRequest = async (request) => {

        const ref = doc(db, "requests", request.id)

        await updateDoc(ref, {
            status: "rejected"
        })

        loadRequests()

    }
    const returnDevice = async (request) => {

        const requestRef = doc(db, "requests", request.id)

        await updateDoc(requestRef, {
            status: "returned"
        })

        // increase product availability
        const q = query(
            collection(db, "products"),
            where("name", "==", request.product)
        )

        const snapshot = await getDocs(q)

        snapshot.forEach(async (p) => {

            const productRef = doc(db, "products", p.id)

            const current = p.data().available

            await updateDoc(productRef, {
                available: current + 1
            })

        })

        loadRequests()

    }

    const pending = requests.filter(r => r.status === "pending")
    const history = requests.filter(
        r => r.status === "approved" || r.status === "rejected"
    )

    return (

        <div className="inventory-sys-wrapper" style={{ padding: "80px 40px", minHeight: "100vh" }}>

            <div className="container">
                <h1 className="text-gradient" style={{ fontSize: "2.5rem", marginBottom: "40px" }}>CXR Admin Dashboard</h1>

                {/* Stats */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px",
                    marginBottom: "50px"
                }}>
                    <div className="glass-panel stat-card" style={cardStyle}>
                        <h3 style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Total Requests</h3>
                        <p style={{ fontSize: "2.5rem", fontWeight: "700", color: "var(--accent-color)" }}>{stats.total}</p>
                    </div>

                    <div className="glass-panel stat-card" style={cardStyle}>
                        <h3 style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Pending</h3>
                        <p style={{ fontSize: "2.5rem", fontWeight: "700", color: "#f59e0b" }}>{stats.pending}</p>
                    </div>

                    <div className="glass-panel stat-card" style={cardStyle}>
                        <h3 style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Approved</h3>
                        <p style={{ fontSize: "2.5rem", fontWeight: "700", color: "#10b981" }}>{stats.approved}</p>
                    </div>
                </div>

                {/* Pending Requests */}
                <div className="glass-panel" style={{ padding: "30px", marginBottom: "50px", overflowX: "auto" }}>
                    <h2 style={{ marginBottom: "20px", color: "var(--text-main)" }}>Pending Requests</h2>

                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Name</th>
                                <th style={thStyle}>Email</th>
                                <th style={thStyle}>Product</th>
                                <th style={thStyle}>Purpose</th>
                                <th style={thStyle}>Start</th>
                                <th style={thStyle}>End</th>
                                <th style={thStyle}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pending.map((r) => (
                                <tr key={r.id} style={trStyle}>
                                    <td style={tdStyle}>{r.name}</td>
                                    <td style={tdStyle}>{r.email}</td>
                                    <td style={tdStyle}><strong>{r.product}</strong></td>
                                    <td style={tdStyle}>{r.purpose}</td>
                                    <td style={tdStyle}>
                                        {r.startTime?.seconds
                                            ? new Date(r.startTime.seconds * 1000).toLocaleString()
                                            : r.startTime}
                                    </td>
                                    <td style={tdStyle}>
                                        {r.endTime?.seconds
                                            ? new Date(r.endTime.seconds * 1000).toLocaleString()
                                            : r.endTime}
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <button onClick={() => approveRequest(r)} className="btn-primary" style={{ padding: "8px 15px", backgroundColor: "#10b981" }}>
                                                Approve
                                            </button>
                                            <button onClick={() => rejectRequest(r)} className="btn-primary" style={{ padding: "8px 15px", backgroundColor: "#ef4444" }}>
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {pending.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ ...tdStyle, textAlign: "center", color: "var(--text-muted)" }}>No pending requests.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* History Section */}
                <div className="glass-panel" style={{ padding: "30px", overflowX: "auto" }}>
                    <h2 style={{ marginBottom: "20px", color: "var(--text-main)" }}>Request History</h2>

                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Name</th>
                                <th style={thStyle}>Email</th>
                                <th style={thStyle}>Product</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Start</th>
                                <th style={thStyle}>End</th>
                                <th style={thStyle}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((r) => (
                                <tr key={r.id} style={trStyle}>
                                    <td style={tdStyle}>{r.name}</td>
                                    <td style={tdStyle}>{r.email}</td>
                                    <td style={tdStyle}><strong>{r.product}</strong></td>
                                    <td style={tdStyle}>
                                        <span style={{ 
                                            padding: "5px 10px", 
                                            borderRadius: "15px", 
                                            fontSize: "0.85rem",
                                            fontWeight: "600",
                                            backgroundColor: r.status === "approved" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                                            color: r.status === "approved" ? "#10b981" : "#ef4444" 
                                        }}>
                                            {r.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>{r.startTime}</td>
                                    <td style={tdStyle}>{r.endTime}</td>
                                    <td style={tdStyle}>
                                        {r.status === "approved" && (
                                            <button onClick={() => returnDevice(r)} className="btn-primary" style={{ padding: "8px 15px" }}>
                                                Return Device
                                            </button>
                                        )}
                                        {r.status === "returned" && (
                                            <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Returned</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ ...tdStyle, textAlign: "center", color: "var(--text-muted)" }}>No request history.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Inventory Management Section */}
                <div className="glass-panel" style={{ padding: "30px", marginTop: "50px", overflowX: "auto" }}>
                    <h2 style={{ marginBottom: "20px", color: "var(--text-main)" }}>Inventory Management</h2>
                    
                    {/* Add Product Form */}
                    <form onSubmit={handleAddProduct} style={{
                        display: "flex", gap: "15px", marginBottom: "30px", alignItems: "flex-end", flexWrap: "wrap"
                    }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: "1", minWidth: "200px" }}>
                            <label style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>New Device Name</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Meta Quest 3" 
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                style={{
                                    padding: "10px 15px", borderRadius: "8px", border: "1px solid var(--border-color)",
                                    backgroundColor: "rgba(255, 255, 255, 0.05)", color: "var(--text-main)"
                                }} 
                                required
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "120px" }}>
                            <label style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Initial Qty</label>
                            <input 
                                type="number" 
                                min="0" 
                                value={newProduct.available}
                                onChange={(e) => setNewProduct({...newProduct, available: e.target.value})}
                                style={{
                                    padding: "10px 15px", borderRadius: "8px", border: "1px solid var(--border-color)",
                                    backgroundColor: "rgba(255, 255, 255, 0.05)", color: "var(--text-main)"
                                }} 
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ padding: "10px 20px", height: "42px" }}>
                            Add Device
                        </button>
                    </form>

                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Device Name</th>
                                <th style={thStyle}>Available Quantity</th>
                                <th style={thStyle}>Update Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item) => (
                                <tr key={item.id} style={trStyle}>
                                    <td style={tdStyle}><strong>{item.name}</strong></td>
                                    <td style={tdStyle}>
                                        <span style={{ 
                                            padding: "5px 15px", 
                                            borderRadius: "15px", 
                                            backgroundColor: item.available > 0 ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                                            color: item.available > 0 ? "#10b981" : "#ef4444",
                                            fontWeight: "bold"
                                        }}>
                                            {item.available} Units
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                            <button 
                                                onClick={() => handleUpdateQuantity(item.id, item.available, -1)}
                                                className="btn-primary" 
                                                style={{ padding: "5px 15px", backgroundColor: "rgba(255, 255, 255, 0.1)", color: "var(--text-main)" }}
                                                disabled={item.available <= 0}
                                            >
                                                -
                                            </button>
                                            <span style={{ width: "20px", textAlign: "center", color: "var(--text-main)" }}>{item.available}</span>
                                            <button 
                                                onClick={() => handleUpdateQuantity(item.id, item.available, 1)}
                                                className="btn-primary" 
                                                style={{ padding: "5px 15px", backgroundColor: "rgba(255, 255, 255, 0.1)", color: "var(--text-main)" }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {inventory.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ ...tdStyle, textAlign: "center", color: "var(--text-muted)" }}>No inventory devices found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

        </div>

    )

}

const cardStyle = {
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px"
}

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left"
}

const thStyle = {
    backgroundColor: "rgba(0, 115, 103, 0.05)",
    padding: "15px",
    fontWeight: "600",
    color: "var(--accent-color)",
    borderBottom: "2px solid var(--border-color)"
}

const tdStyle = {
    padding: "15px",
    borderBottom: "1px solid var(--border-color)",
    color: "var(--text-main)"
}

const trStyle = {
    transition: "background-color 0.2s ease"
}