"use client";
import { useEffect, useRef, useState } from "react";

type Piece = { title: string; date: string; url: string; source: string };

// Cloth colours for the Shoal series; the Medium piece is a paperback and gets its own look.
const cloths = ["#2f4a3e", "#2c3b52", "#5b2e2b", "#6b5a3a", "#3b3f3a"];
const COVER_W = 270, GAP = 3, PAD = 20, BOOKEND = 12, LEAN = 24;

// Stable pseudo-random from the title so spine heights don't jump between renders.
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const month = (d: string) => (d ? new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "");

// Spines get wider rather than the type getting smaller, so every title stays readable at 16px.
const measure = (b: Piece) => {
  const height = b.source === "Shoal Research" ? 244 + (hash(b.title) % 36) : 226;
  const lines = Math.ceil((b.title.length * 8.4) / (height - 96));
  return { height, width: 22 + lines * 20 };
};

export default function Bookshelf({ pieces }: { pieces: Piece[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  // Oldest to newest, left to right and top to bottom; undated pieces go at the end.
  const books = [...pieces].sort((a, b) => (!a.date ? 1 : !b.date ? -1 : a.date.localeCompare(b.date))).map((b, i) => ({ ...b, ...measure(b), cloth: cloths[i % cloths.length] }));
  const half = Math.ceil(books.length / 2);
  const shelves = [books.slice(0, half), books.slice(half)];
  // Leave room on every shelf for one book to open, so the case never changes size.
  const rowWidth = (row: typeof books) => row.reduce((w, b) => w + b.width + GAP, 0) + (row.some((b) => b.source !== "Shoal Research") ? LEAN : 0);
  const caseWidth = Math.max(...shelves.map(rowWidth)) + COVER_W + BOOKEND + PAD * 2;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const el = root.current?.querySelector<HTMLElement>(`[data-url="${CSS.escape(open)}"] .cover`);
    // On narrow screens, bring the opened cover into view once it has swung out.
    const t = setTimeout(() => el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" }), 420);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <div ref={root} className="bookcase-scroll mt-6">
      <div className="bookcase" style={{ width: caseWidth }}>
        {shelves.map((row, r) => (
          <div key={r} className="shelf">
            <div className="shelf-row">
              {row.map((b) => {
                const paperback = b.source !== "Shoal Research";
                const isOpen = open === b.url;
                return (
                  <div
                    key={b.url}
                    data-url={b.url}
                    className={`book${paperback ? " paperback" : ""}${isOpen ? " open" : ""}`}
                    style={{ "--cloth": b.cloth, "--h": `${b.height}px`, "--w": `${b.width}px`, "--cover": `${COVER_W}px` } as React.CSSProperties}
                  >
                    <button
                      type="button"
                      className="spine"
                      aria-expanded={isOpen}
                      aria-label={`${b.title}${b.date ? `, ${month(b.date)}` : ""}`}
                      onClick={() => setOpen(isOpen ? null : b.url)}
                    >
                      <span className="spine-year">{b.date ? `’${b.date.slice(2, 4)}` : ""}</span>
                      <span className="spine-title">{b.title}</span>
                      <span className="spine-mark">{paperback ? "M" : "S"}</span>
                    </button>
                    <div className="cover" aria-hidden={!isOpen}>
                      <p className="cover-title">{b.title}</p>
                      <div>
                        <p className="cover-meta">{b.source}{b.date && <><br />{month(b.date)}</>}</p>
                        <a href={b.url} tabIndex={isOpen ? 0 : -1} className="cover-link">Read the piece</a>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="bookend" aria-hidden />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
