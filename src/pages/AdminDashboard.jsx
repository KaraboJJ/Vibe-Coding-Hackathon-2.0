import React, { useState } from "react";
import jsPDF from "jspdf";
// Ensure you have jspdf installed: npm install jspdf

// --- Initial Data ---
const initialMembers = [
  { id: 1, name: "Amina", contributed: true },
  { id: 2, name: "Juma", contributed: false },
  { id: 3, name: "Fatuma", contributed: true },
  { id: 4, name: "David", contributed: false },
  { id: 5, name: "Mercy", contributed: true },
  { id: 6, name: "John", contributed: false },
];

// --- Main AdminDashboard Component ---
export default function AdminDashboard() {
  const [members, setMembers] = useState(initialMembers);

  // Toggles the 'contributed' status of a member
  const toggleContribution = (id) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === id
          ? { ...member, contributed: !member.contributed }
          : member
      )
    );
  };

  // Generates a PDF report using jsPDF with improved formatting
  const generatePDF = () => {
    const doc = new jsPDF();

    // Set document properties
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(51, 51, 51); // Dark grey text

    // Title
    doc.text("ChamaPay Monthly Contribution Report", 10, 25);

    // Date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100); // Lighter grey text
    const currentDate = new Date().toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Report Date: ${currentDate}`, 10, 35);

    // Table Headers for PDF (simple version for text-based PDF)
    const startY = 50;
    let yOffset = startY;
    const col1 = 15;
    const col2 = 80;
    const col3 = 140;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0); // Black for headers
    doc.text("Name", col1, yOffset);
    doc.text("Contribution Status", col2, yOffset);
    doc.text("Payment Date (simulated)", col3, yOffset); // Added a simulated date column for professionalism
    yOffset += 8; // Space after headers
    doc.setDrawColor(220, 220, 220); // Light grey line
    doc.line(10, yOffset, 200, yOffset); // Horizontal line after headers
    yOffset += 5;

    // Table Data for PDF
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    members.forEach((m) => {
      const status = m.contributed ? "Paid" : "Pending";
      const paymentDate = m.contributed
        ? new Date().toLocaleDateString("en-GB")
        : "N/A"; // Simulate date if paid

      doc.setTextColor(50, 50, 50); // Darker grey for data
      doc.text(m.name, col1, yOffset);
      doc.text(status, col2, yOffset);
      doc.text(paymentDate, col3, yOffset);

      yOffset += 8; // Line height for each entry
      if (yOffset > 280) {
        // Check for page break
        doc.addPage();
        yOffset = 20; // Reset yOffset for new page
        // Re-add headers on new page
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("Name", col1, yOffset);
        doc.text("Contribution Status", col2, yOffset);
        doc.text("Payment Date (simulated)", col3, yOffset);
        yOffset += 8;
        doc.setDrawColor(220, 220, 220);
        doc.line(10, yOffset, 200, yOffset);
        yOffset += 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
      }
    });

    // Save the PDF
    doc.save("dovesPay_Contribution_Report.pdf");
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Admin Dashboard</h2>

      <table style={tableStyle}>
        <thead>
          <tr style={tableRowHeaderStyle}>
            {" "}
            {/* Apply header row style */}
            <th style={tableHeaderStyle}>Name</th>
            <th style={tableHeaderStyle}>Contribution Status</th>
            <th style={tableHeaderStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} style={tableRowStyle}>
              {" "}
              {/* Apply row style */}
              <td style={tableCellStyle}>{m.name}</td>
              <td style={tableCellStyle}>
                <span
                  style={m.contributed ? statusPaidStyle : statusPendingStyle}
                >
                  {m.contributed ? "Paid" : "Pending"}
                </span>
              </td>
              <td style={tableCellStyle}>
                <button
                  onClick={() => toggleContribution(m.id)}
                  // Conditionally apply style based on contribution status
                  style={
                    m.contributed ? buttonContributedStyle : buttonPendingStyle
                  }
                >
                  {m.contributed ? "Mark Pending" : "Mark Paid"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={buttonGroupStyle}>
        {" "}
        {/* Use a div to group buttons */}
        <button onClick={generatePDF} style={pdfButtonStyle}>
          Download PDF Report
        </button>
      </div>
    </div>
  );
}

// --- Professional Design Styles ---

// General styles for the overall layout
const containerStyle = {
  maxWidth: "800px",
  margin: "40px auto",
  backgroundColor: "#FFFFFF",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
  border: "1px solid #E0E0E0",
};

const headingStyle = {
  fontSize: "2rem", // Larger heading
  fontWeight: "700", // Bolder
  color: "#333333",
  marginBottom: "25px", // More space below heading
  textAlign: "center", // Center align heading
};

// Table specific styles
const tableStyle = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0 10px", // Increased vertical space between rows
  marginBottom: "30px",
  fontSize: "0.95rem",
  lineHeight: "1.5",
};

const tableRowHeaderStyle = {
  backgroundColor: "#F5F5F5",
};

const tableHeaderStyle = {
  color: "#333333",
  textAlign: "left",
  padding: "15px 20px", // More padding
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  borderBottom: "2px solid #E0E0E0", // Stronger bottom border for header
  borderTopLeftRadius: "8px", // Rounded corners for first header
  borderTopRightRadius: "8px", // Rounded corners for last header
};

const tableRowStyle = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #EEEEEE", // Border around each row "card"
  borderRadius: "8px", // Rounded corners for rows
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)", // Subtle shadow for row
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  ":hover": {
    // Note: Direct hover for inline style objects might need a wrapper component or a styling library
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
};

const tableCellStyle = {
  padding: "15px 20px", // More padding
  color: "#555555",
  verticalAlign: "middle", // Vertically align content
};

// Status indicator styles
const statusPaidStyle = {
  display: "inline-block",
  padding: "5px 12px",
  borderRadius: "20px",
  backgroundColor: "#D4EDDA", // Light green
  color: "#155724", // Dark green text
  fontWeight: "600",
  fontSize: "0.85rem",
};

const statusPendingStyle = {
  display: "inline-block",
  padding: "5px 12px",
  borderRadius: "20px",
  backgroundColor: "#FFF3CD", // Light yellow
  color: "#856404", // Dark yellow text
  fontWeight: "600",
  fontSize: "0.85rem",
};

// Button Group Style
const buttonGroupStyle = {
  display: "flex",
  justifyContent: "flex-end", // Align button to the right
  marginTop: "30px", // Space above the button
};

// General button styles
const baseButtonStyle = {
  border: "none",
  color: "#FFFFFF",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "600",
  transition: "background-color 0.2s ease-in-out, transform 0.1s ease-in-out",
  minWidth: "120px",
  outline: "none",
};

// Specific button styles inherited from base
const buttonContributedStyle = {
  ...baseButtonStyle,
  backgroundColor: "#DC3545", // Red for 'Mark Pending' (danger/attention)
  ":hover": {
    backgroundColor: "#C82333",
    transform: "translateY(-1px)",
  },
  ":active": {
    backgroundColor: "#BD2130",
    transform: "translateY(0)",
  },
};

const buttonPendingStyle = {
  ...baseButtonStyle,
  backgroundColor: "#28A745", // Green for 'Mark Paid' (success)
  ":hover": {
    backgroundColor: "#218838",
    transform: "translateY(-1px)",
  },
  ":active": {
    backgroundColor: "#1E7E34",
    transform: "translateY(0)",
  },
};

const pdfButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: "#007BFF", // Blue for PDF download (primary action)
  padding: "12px 25px", // Slightly larger
  fontSize: "1.05rem",
  ":hover": {
    backgroundColor: "#0056b3",
    transform: "translateY(-1px)",
  },
  ":active": {
    backgroundColor: "#004085",
    transform: "translateY(0)",
  },
};