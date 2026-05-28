"use client";

import Link from "next/link";

import { Ico, type IconName } from "@/components/icons";
import { Logo } from "./Logo";

interface SocialLink {
  icon: IconName;
  href: string;
  external?: boolean;
  title: string;
}

const SOCIALS: SocialLink[] = [
  { icon: "globe",   href: "https://xorvion-ai.vercel.app/",        external: true,  title: "Xorvion website" },
  { icon: "link",    href: "https://www.linkedin.com/company/xorvion/", external: true, title: "Xorvion on LinkedIn" },
  { icon: "mail",    href: "/contact",                                                   title: "Contact us" },
];

export function Footer() {
  return (
    <footer style={{
      position: "relative",
      zIndex: 1,
      marginTop: 64,
      padding: "32px 32px 28px",
      borderTop: "1px solid var(--border)",
      background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.35))",
    }}>
      <div style={{
        maxWidth: 1240,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}>
        <Logo />

        <p style={{
          maxWidth: 420,
          color: "var(--text-muted)",
          fontSize: 14,
          lineHeight: 1.55,
          margin: 0,
        }}>
          Intelligence beyond URLs. Built by Xorvion in Noida, India.
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          {SOCIALS.map(s =>
            s.external ? (
              <a
                key={s.icon}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                title={s.title}
                aria-label={s.title}
                style={socialBtn}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <Ico name={s.icon} size={16} />
              </a>
            ) : (
              <Link
                key={s.icon}
                href={s.href}
                title={s.title}
                aria-label={s.title}
                style={socialBtn}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <Ico name={s.icon} size={16} />
              </Link>
            )
          )}
        </div>
      </div>

      <div style={{
        maxWidth: 1240,
        margin: "32px auto 0",
        paddingTop: 20,
        borderTop: "1px solid var(--border-subtle)",
        fontSize: 11,
        fontFamily: "var(--font-mono)",
        color: "var(--text-dim)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        textAlign: "center",
      }}>
        © 2026 Xorvion Pvt Ltd · All rights reserved
      </div>
    </footer>
  );
}

const socialBtn: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 10,
  background: "var(--bg-inset)",
  border: "1px solid var(--border)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--text-muted)",
  transition: "all 150ms ease",
  textDecoration: "none",
  cursor: "pointer",
};
