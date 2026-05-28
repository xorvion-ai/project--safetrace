import Image from "next/image";

export interface LogoProps {
  size?: number;
}

export function Logo({ size = 36 }: LogoProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", userSelect: "none" }}>
      <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <Image
          src="/logo.png"
          alt="SafeTrace"
          width={size}
          height={size}
          priority
          style={{ objectFit: "contain" }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1, gap: 3 }}>
        <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.015em" }}>
          Safe<span style={{ color: "var(--accent)" }}>Trace</span>
        </span>
        <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-dim)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
          By xorvion
        </span>
      </div>
    </div>
  );
}
