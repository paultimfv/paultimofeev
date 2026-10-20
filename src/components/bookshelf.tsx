"use client";
import { useEffect, useRef, useState } from "react";

type Piece = { title: string; date: string; url: string; source: string; with: string[] };

// Cloth colours for the Shoal series; the Medium piece is a paperback and gets its own look.
const cloths = ["#2f4a3e", "#2c3b52", "#5b2e2b", "#6b5a3a", "#3b3f3a", "#2c3b52", "#5b2e2b"];
const COVER_W = 260;

// Stable pseudo-random from the title so spine heights don't jump between renders.
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const month = (d: string) => (d ? new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "");

export default function Bookshelf({ pieces }: { pieces: Piece[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const shelf = useRef<HTMLDivElement>(null);
  // Oldest to newest, left to right; undated pieces go at the end.
  const books = [...pieces].sort((a, b) => (!a.date ? 1 : !b.date ? -1 : a.date.localeCompare(b.date)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const el = shelf.current?.querySelector<HTMLElement>(`[data-url="${CSS.escape(open)}"]`);
    // Wait for the cover to finish opening before scrolling it into view on narrow screens.
    const t = setTimeout(() => el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" }), 420);
    return () => clearTimeout(t);
  }, [open]);

  let series = 0;
  return (
    <div className="bookshelf mt-6">
      <div ref={shelf} className="shelf-row">
        {books.map((b) => {
          const h = hash(b.title);
          const paperback = b.source !== "Shoal Research";
          const height = paperback ? 196 : 212 + (h % 40);
          const width = Math.round(Math.min(62, 34 + b.title.length * 0.75));
          const cloth = paperback ? undefined : cloths[series++ % cloths.length];
          const isOpen = open === b.url;
          return (
            <div
              key={b.url}
              data-url={b.url}
              className={`book${paperback ? " paperback" : ""}${isOpen ? " open" : ""}`}
              style={{ "--cloth": cloth, "--h": `${height}px`, "--w": `${width}px`, "--cover": `${COVER_W}px` } as React.CSSProperties}
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
                <div>
                  <p className="cover-title">{b.title}</p>
                  {b.with.length > 0 && <p className="cover-with">with {b.with.join(" and ")}</p>}
                </div>
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
      <div className="plank" aria-hidden />
    </div>
  );
}
