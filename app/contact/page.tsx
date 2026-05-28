"use client";

import { useState } from "react";
import Link from "next/link";

import { Ico } from "@/components/icons";
import { useToast } from "@/hooks/useToast";

const TOPICS = ["General", "Bug", "Feedback", "Partnership", "Press"] as const;
type Topic = (typeof TOPICS)[number];

// Public Web3Forms access key — safe to ship client-side per Web3Forms docs.
const WEB3FORMS_KEY = "0235cd03-1c89-4f98-b390-1b33f00b8c01";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<Topic>("General");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const toast = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({ kind: "error", title: "Missing fields", message: "Name, email and message are required." });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `[SafeTrace · ${topic}] from ${name}`,
          from_name: name,
          email,
          topic,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to send");
      toast({ kind: "success", title: "Message sent", message: "We'll get back to you within 24 hours." });
      setName(""); setEmail(""); setMessage(""); setTopic("General");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast({ kind: "error", title: "Couldn't send", message: msg });
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 28px 80px", animation: "fade-up 400ms ease-out" }}>
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-dim)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14 }}>
          Say hello
        </div>
        <h1 style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1, margin: 0 }}>Contact us</h1>
        <p style={{ marginTop: 18, color: "var(--text-muted)", maxWidth: 520, fontSize: 15, lineHeight: 1.6 }}>
          Questions, feedback, partnership ideas, bug reports — we read everything that lands in our inbox.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 400px", gap: 28, alignItems: "start" }}>
        {/* LEFT — form card */}
        <form onSubmit={onSubmit} style={{
          background: "var(--bg-raised)",
          border: "1px solid var(--border)",
          borderRadius: 18,
          padding: 28,
          backgroundImage: "var(--brushed)",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <FieldLabel label="Name">
              <Input value={name} onChange={setName} placeholder="Your name" />
            </FieldLabel>
            <FieldLabel label="Email">
              <Input value={email} onChange={setEmail} placeholder="you@example.com" type="email" />
            </FieldLabel>
          </div>

          <div style={{ marginTop: 22 }}>
            <Eyebrow>Topic</Eyebrow>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
              {TOPICS.map(t => {
                const active = topic === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    style={{
                      padding: "8px 16px",
                      fontSize: 13,
                      fontWeight: 500,
                      color: active ? "var(--text)" : "var(--text-muted)",
                      background: active ? "linear-gradient(180deg, var(--steel-700), var(--steel-800))" : "transparent",
                      border: active ? "1px solid var(--steel-500)" : "1px solid var(--border)",
                      borderRadius: 8,
                      cursor: "pointer",
                      transition: "all 150ms ease",
                    }}
                  >{t}</button>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            <Eyebrow>Message</Eyebrow>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what's on your mind…"
              rows={6}
              style={{
                width: "100%",
                marginTop: 10,
                padding: "14px 16px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                color: "var(--text)",
                fontSize: 14,
                fontFamily: "var(--font-sans)",
                lineHeight: 1.55,
                resize: "vertical",
                outline: "none",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            style={{
              width: "100%",
              marginTop: 24,
              padding: "16px 24px",
              background: "var(--steel-100)",
              color: "var(--bg-deep)",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: sending ? "wait" : "pointer",
              opacity: sending ? 0.7 : 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              transition: "all 150ms ease",
            }}
          >
            {sending ? "Sending…" : "Send message"} <Ico name="send" size={15} />
          </button>
        </form>

        {/* RIGHT — direct + social cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Card>
            <Eyebrow>Direct</Eyebrow>
            <a href="mailto:xorvion.ai@gmail.com" style={contactRow}>
              <IconBubble><Ico name="mail" size={16} /></IconBubble>
              <div style={{ flex: 1 }}>
                <div style={metaLabel}>Email us</div>
                <div style={metaValue}>xorvion.ai@gmail.com</div>
              </div>
              <Ico name="arrow-right" size={14} />
            </a>
            <div style={contactRow}>
              <IconBubble><Ico name="map-pin" size={16} /></IconBubble>
              <div style={{ flex: 1 }}>
                <div style={metaLabel}>Headquarters</div>
                <div style={metaValue}>Noida, India</div>
              </div>
            </div>
            <div style={contactRow}>
              <IconBubble><Ico name="clock" size={16} /></IconBubble>
              <div style={{ flex: 1 }}>
                <div style={metaLabel}>Response time</div>
                <div style={metaValue}>Within 24 hours</div>
              </div>
            </div>
          </Card>

          <Card>
            <Eyebrow>Follow Xorvion</Eyebrow>
            <a href="https://xorvion-ai.vercel.app/" target="_blank" rel="noreferrer noopener" style={socialRow}>
              <IconBubble><Ico name="globe" size={16} /></IconBubble>
              <div style={{ flex: 1 }}>
                <div style={socialValue}>xorvion-ai.vercel.app</div>
                <div style={socialLabel}>Company website</div>
              </div>
              <Ico name="arrow-right" size={14} />
            </a>
            <a href="https://www.linkedin.com/company/xorvion/" target="_blank" rel="noreferrer noopener" style={socialRow}>
              <IconBubble><Ico name="link" size={16} /></IconBubble>
              <div style={{ flex: 1 }}>
                <div style={socialValue}>linkedin.com/company/xorvion</div>
                <div style={socialLabel}>LinkedIn</div>
              </div>
              <Ico name="arrow-right" size={14} />
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10.5,
      fontFamily: "var(--font-mono)",
      color: "var(--text-dim)",
      letterSpacing: "0.22em",
      textTransform: "uppercase",
    }}>{children}</div>
  );
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <Eyebrow>{label}</Eyebrow>
      <div style={{ marginTop: 10 }}>{children}</div>
    </label>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "12px 14px",
        background: "var(--bg-inset)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        color: "var(--text)",
        fontSize: 14,
        fontFamily: "var(--font-sans)",
        outline: "none",
        transition: "border-color 150ms ease",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    />
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "var(--bg-raised)",
      border: "1px solid var(--border)",
      borderRadius: 18,
      padding: "22px 22px 14px",
      backgroundImage: "var(--brushed)",
    }}>
      {children}
    </div>
  );
}

function IconBubble({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: 36,
      height: 36,
      borderRadius: 10,
      background: "var(--bg-inset)",
      border: "1px solid var(--border)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-muted)",
      flexShrink: 0,
    }}>{children}</div>
  );
}

const contactRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: "14px 0",
  borderBottom: "1px solid var(--border-subtle)",
  color: "inherit",
  textDecoration: "none",
};

const socialRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: "12px 14px",
  margin: "10px -8px 0",
  background: "var(--bg-inset)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "inherit",
  textDecoration: "none",
  transition: "all 150ms ease",
};

const metaLabel: React.CSSProperties = {
  fontSize: 10.5,
  fontFamily: "var(--font-mono)",
  color: "var(--text-dim)",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  marginBottom: 4,
};

const metaValue: React.CSSProperties = {
  fontSize: 14,
  color: "var(--text)",
  fontWeight: 500,
};

const socialValue: React.CSSProperties = {
  fontSize: 14,
  fontFamily: "var(--font-mono)",
  color: "var(--text)",
  fontWeight: 500,
};

const socialLabel: React.CSSProperties = {
  fontSize: 10.5,
  fontFamily: "var(--font-mono)",
  color: "var(--text-dim)",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  marginTop: 3,
};
