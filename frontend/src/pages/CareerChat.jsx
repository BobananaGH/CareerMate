import { useState, useRef, useEffect } from "react";
import api from "../api";
import styles from "./css/CareerChat.module.css";

export default function CareerChat() {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const controllerRef = useRef(null);

  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const isLocked = loading || !input.trim();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: loading ? "auto" : "smooth",
    });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post(
        "/chat/send/",
        {
          message: userMessage.content,
          conversation_id: conversationId,
        },
        {
          signal: controllerRef.current.signal,
        },
      );

      if (!conversationId) {
        setConversationId(res.data.conversation_id);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: res.data.reply,
        },
      ]);
    } catch (err) {
      if (err.name === "CanceledError" || err.name === "AbortError") return;

      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "⚠️ Something went wrong.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className={styles.chatPage}>
      <section className={styles.chatMain}>
        <div className={styles.messages}>
          {messages.length === 0 && !loading && (
            <p className={styles.empty}>
              Start a conversation with CareerChat 🚀
            </p>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.role === "user"
                  ? styles.userMessage
                  : styles.assistantMessage
              }
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div className={`${styles.assistantMessage} ${styles.typing}`}>
              CareerChat is typing
              <span className={styles.dots}>
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className={styles.inputBar} onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Ask about your career..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            ref={inputRef}
          />
          <button type="submit" className="btn btnPrimary" disabled={isLocked}>
            {loading ? (
              <span className={styles.dots}>
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            ) : (
              <i className="fa-solid fa-arrow-up" />
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
