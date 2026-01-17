import { useState } from "react";
import styles from "./css/CareerChat.module.css";

export default function CareerChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);

  return (
    <div className={styles.chatPage}>
      {/* LEFT SIDEBAR */}
      <aside className={styles.sidebar}>
        <h3>Conversations</h3>
        <p className={styles.placeholder}>Coming soon</p>
      </aside>

      {/* MAIN CHAT */}
      <section className={styles.chatMain}>
        <div className={styles.messages}>
          {messages.length === 0 && (
            <p className={styles.empty}>
              Start a conversation with CareerMate 🚀
            </p>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.role === "user"
                  ? styles.userMessage
                  : styles.assistantMessage
              }
            >
              {msg.content}
            </div>
          ))}
        </div>

        {/* INPUT */}
        <form className={styles.inputBar} onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Ask about your career..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            type="submit"
            className="btn btnPrimary"
            disabled={!input.trim()}
          >
            <i class="fa-solid fa-arrow-up"></i>
          </button>
        </form>
      </section>
    </div>
  );
}
