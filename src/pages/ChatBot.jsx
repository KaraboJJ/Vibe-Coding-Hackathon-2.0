import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Initial Messages ---
const initialMessages = [
  {
    id: 1,
    from: "bot",
    text: "Sasa! Time to send your 1K contribution for July. Please send via M-Pesa before the 15th!",
  },
  {
    id: 2,
    from: "bot",
    text: "How can I help you today?",
  },
];

// --- Main ChatBot Component ---
export default function ChatBot() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  // Ref to automatically scroll to the bottom of the chat area
  const chatMessagesEndRef = useRef(null);

  // Function to smoothly scroll the chat view to the latest message
  const scrollToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect hook to scroll to bottom whenever the messages array updates
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handles sending messages and triggers a simulated bot reply
  const sendMessage = (text, from = "user") => {
    // Add user's message to the state
    const newUserMsg = { id: Date.now(), from, text };
    setMessages((prevMessages) => [...prevMessages, newUserMsg]);

    // Simulate bot's response after a short delay
    if (from === "user") {
      setTimeout(() => {
        const reply = botReply(text);
        if (reply) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { id: Date.now() + 1, from: "bot", text: reply },
          ]);
        }
      }, 1200); // Shorter, more responsive bot reply time
    }
  };

  // Simple rule-based bot logic for generating responses
  const botReply = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("sent")) {
      return "Excellent! Your contribution has been successfully recorded. Thank you for your promptness 🎉";
    }
    if (lower.includes("balance")) {
      return "Your current contribution for this cycle is KES 1,000. The group's total stands at KES 50,000.";
    }
    if (lower.includes("hello") || lower.includes("hi")) {
      return "Hello there! I'm your ChamaPay reminder bot. How can I assist you with your contributions?";
    }
    if (lower.includes("help") || lower.includes("support")) {
      return "I can help you with reminders and basic information. Try asking about your 'balance' or confirm 'sent' payment. For complex issues, please contact your Chama administrator.";
    }
    // Default fallback message
    return 'I am here to assist with your Chama contributions. You can reply "Sent" to confirm payment or ask about your "Balance".';
  };

  // Handles the submission of the message form
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the browser from reloading the page
    if (!input.trim()) return; // Do not send empty messages

    sendMessage(input.trim()); // Send the user's trimmed input
    setInput(""); // Clear the input field after sending
  };

  return (
    <div style={containerStyle}>
      {/* Chat header (optional, but good for professional look) */}
      <div style={chatHeaderStyle}>
        <span style={chatTitleStyle}>DovesPay Bot Assistant</span>
        <span style={botStatusStyle}>Online</span>
      </div>

      {/* Main chat messages display area */}
      <div style={chatMessagesContainerStyle}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15 }} // Slightly larger initial Y offset
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }} // Consistent exit animation
              transition={{ duration: 0.25, ease: "easeOut" }} // Smoother transition
              style={{
                ...messageBubbleBaseStyle,
                // Apply specific styles for bot or user messages
                ...(msg.from === "bot"
                  ? botMessageBubbleStyle
                  : userMessageBubbleStyle),
              }}
            >
              {msg.text}
            </motion.div>
          ))}
          {/* Invisible div used as a scroll target */}
          <div ref={chatMessagesEndRef} />
        </AnimatePresence>
      </div>

      {/* Message input form */}
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={inputStyle}
          aria-label="Type your message to the bot" // Improved accessibility label
          className="chat-input" // Add a class for potential external CSS if needed
        />
        <button type="submit" style={sendButtonStyle}>
          Send
        </button>
      </form>
    </div>
  );
}

// --- Professional Design Styles (using JavaScript objects for inline styles) ---
// Note: For more complex hover/active states, consider CSS Modules, Styled Components, or a utility-first CSS framework like Tailwind CSS.
// These inline styles are good for basic properties.

const primaryBlue = "#007BFF";
const darkText = "#333333";
const lightGreyBackground = "#F8F9FA";
const greyBorder = "#E0E0E0";
const botBubbleColor = "#E2F0CB"; // A softer, professional green/blue tint
const userBubbleColor = "#CCEEFF"; // A clean, light blue for user messages

// Main container for the chatbot interface
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  maxWidth: "480px", // Increased width for a more substantial look
  minHeight: "75vh", // Min height to ensure it looks good on larger screens
  margin: "40px auto", // Generous margin for centering and breathing room
  backgroundColor: "#FFFFFF", // Crisp white background
  borderRadius: "15px", // More rounded corners for a modern feel
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)", // Deeper, softer shadow
  overflow: "hidden", // Ensures content stays within rounded corners
  border: `1px solid ${greyBorder}`, // Subtle border
  fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", // Modern font stack
};

// Chat header style
const chatHeaderStyle = {
  backgroundColor: primaryBlue,
  color: "#FFFFFF",
  padding: "15px 20px",
  borderTopLeftRadius: "15px",
  borderTopRightRadius: "15px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: "600",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  zIndex: 1, // Ensure header is above messages if scrolling
};

const chatTitleStyle = {
  fontSize: "1.25rem",
};

const botStatusStyle = {
  fontSize: "0.9rem",
  opacity: 0.8,
};

// Container for chat messages, allowing scroll
const chatMessagesContainerStyle = {
  flexGrow: 1,
  overflowY: "auto", // Essential for scrolling chat history
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "12px", // Space between message bubbles
  backgroundColor: lightGreyBackground, // Light background for chat area
  // Custom scrollbar styling (will need browser prefixes or external CSS for full support)
  // Webkit-scrollbar: { width: '8px' },
  // Webkit-scrollbar-thumb: { backgroundColor: '#ccc', borderRadius: '10px' },
  // Webkit-scrollbar-track: { backgroundColor: '#f0f0f0' },
};

// Base style for all message bubbles
const messageBubbleBaseStyle = {
  padding: "12px 18px",
  borderRadius: "22px", // Highly rounded for a friendly chat feel
  maxWidth: "80%", // Messages don't span full width
  color: darkText,
  fontSize: "0.95rem",
  lineHeight: "1.4",
  wordBreak: "break-word", // Ensures long words wrap correctly
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)", // Subtle shadow for bubbles
};

// Specific style for bot messages
const botMessageBubbleStyle = {
  alignSelf: "flex-start", // Aligns to the left
  backgroundColor: botBubbleColor,
  borderBottomLeftRadius: "5px", // Less rounded on the bottom left for the 'tail' effect
};

// Specific style for user messages
const userMessageBubbleStyle = {
  alignSelf: "flex-end", // Aligns to the right
  backgroundColor: userBubbleColor,
  color: "#000", // Darker text for better contrast on light blue
  borderBottomRightRadius: "5px", // Less rounded on the bottom right for the 'tail' effect
};

// Style for the message input form
const formStyle = {
  display: "flex",
  padding: "15px 20px",
  borderTop: `1px solid ${greyBorder}`, // Separator from chat area
  backgroundColor: "#FFFFFF",
  gap: "10px",
};

// Style for the text input field
const inputStyle = {
  flexGrow: 1,
  padding: "12px 18px",
  borderRadius: "25px", // Very rounded input field
  border: `1px solid ${greyBorder}`,
  fontSize: "1rem",
  outline: "none", // Remove default focus outline
  transition: "border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  ":focus": {
    // This `:focus` will not work directly in inline style objects
    borderColor: primaryBlue,
    boxShadow: `0 0 0 3px rgba(0, 123, 255, 0.25)`,
  },
};

// Style for the send button
const sendButtonStyle = {
  backgroundColor: primaryBlue,
  border: "none",
  color: "#FFFFFF",
  padding: "12px 25px",
  borderRadius: "25px", // Very rounded button
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
  transition: "background-color 0.2s ease-in-out, transform 0.1s ease-in-out",
  outline: "none",
  ":hover": {
    // This `:hover` will not work directly in inline style objects
    backgroundColor: "#0056b3",
    transform: "translateY(-1px)",
  },
  ":active": {
    // This `:active` will not work directly in inline style objects
    backgroundColor: "#004085",
    transform: "translateY(0)",
  },
};