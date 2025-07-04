import React, { useState } from "react";
import ChatBot from "./pages/ChatBot";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [page, setPage] = useState("chatbot");

  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#E6F4EA",
        minHeight: "100vh",
        padding: 20,
      }}
    >
      <header style={{ marginBottom: 20 }}>
        <button onClick={() => setPage("chatbot")} style={buttonStyle}>
          ChatBot
        </button>
        <button onClick={() => setPage("admin")} style={buttonStyle}>
          Admin Dashboard
        </button>
      </header>
      {page === "chatbot" ? <ChatBot /> : <AdminDashboard />}
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  padding: "10px 20px",
  marginRight: 10,
  borderRadius: 5,
  cursor: "pointer",
  fontWeight: "bold",
};