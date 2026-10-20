"use client";
import { useEffect, useState } from "react";

type Piece = { title: string; date: string; url: string; source: string };

// Cloth colours for the Shoal series; anything published elsewhere is a paperback and gets its own look.
const cloths = ["#2f4a3e", "#2c3b52", "#5b2e2b", "#6b5a3a", "#3b3f3a"];

// Stable pseudo-random from the title so book heights don't jump between renders.
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const month = (d: string) => (d ? new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "");

// Books stand face-out on display shelves, in the order featured.json lists them. Clicking one swings its cover open.
export default function Bookshelf({ pieces }: { pieces: Piece[] }) {
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ul className="display mt-6">
      {pieces.map((b, i) => {
        const paperback = b.source !== "Shoal Research";
        const isOpen = open === b.url;
        return (
          <li key={b.url} className="display-slot">
            <div
              className={`face${paperback ? " paperback" : ""}${isOpen ? " open" : ""}`}
              style={{ "--cloth": cloths[i % cloths.length], "--lift": `${hash(b.title) % 22}px` } as React.CSSProperties}
            >
              <div className="page">
                <p className="page-title">{b.title}</p>
                <p className="page-meta">{b.source}{b.date && <><br />{month(b.date)}</>}</p>
                <a href={b.url} tabIndex={isOpen ? 0 : -1} className="page-link">Read the piece</a>
              </div>
              <button type="button" className="board" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : b.url)}>
                <span className="board-front">
                  <span className="board-title">{b.title}</span>
                  <span className="board-mark">{b.source}</span>
                </span>
                <span className="board-back" aria-hidden />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
