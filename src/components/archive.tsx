"use client";
import { useState } from "react";

type Piece = { title: string; date: string; url: string; source: string; topics: string[]; with: string[] };

// One drawer per topic, plus one holding every card. First topic is open by default.
const drawers = [
  { id: "ai", label: "AI" },
  { id: "stablecoins", label: "Stablecoins" },
  { id: "interoperability", label: "Interoperability" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "defi", label: "DeFi" },
  { id: "all", label: "All writing" },
];

// Where each year's guide-card tab sits, staggered like a real catalog drawer.
const tabSpots = ["4%", "38%", "72%"];

export default function Archive({ pieces }: { pieces: Piece[] }) {
  const [drawer, setDrawer] = useState(drawers[0].id);
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  // A search looks through every drawer.
  const inDrawer = (id: string) => pieces.filter((p) => id === "all" || p.topics.includes(id));
  const shown = (q ? pieces : inDrawer(drawer)).filter((p) => !q || `${p.title} ${p.source}`.toLowerCase().includes(q));
  const years = [...new Set(shown.map((p) => p.date.slice(0, 4) || "Undated"))].sort((a, b) => (a === "Undated" ? 1 : b === "Undated" ? -1 : b.localeCompare(a)));
  const label = q ? `Cards matching “${query.trim()}”` : drawers.find((d) => d.id === drawer)!.label;

  return (
    <div className="mt-6">
      <div className="cabinet">
        {drawers.map((d) => (
          <button key={d.id} type="button" onClick={() => { setDrawer(d.id); setQuery(""); }}
            aria-pressed={!q && drawer === d.id} className={`drawer${!q && drawer === d.id ? " pulled" : ""}`}>
            <span className="drawer-label">{d.label}<span className="drawer-count">{inDrawer(d.id).length}</span></span>
            <span className="drawer-pull" aria-hidden />
          </button>
        ))}
      </div>

      <label className="mt-4 flex items-center gap-2.5 border-b border-line pb-2 text-[15px] focus-within:border-muted">
        <svg viewBox="0 0 16 16" className="h-4 w-4 text-muted" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" strokeLinecap="round" /></svg>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the catalog" aria-label="Search the catalog"
          className="w-full bg-transparent outline-none placeholder:text-muted" />
      </label>

      <div className="tray mt-6" aria-label={label}>
        <p className="tray-label">{label}<span className="text-muted">, {shown.length} {shown.length === 1 ? "card" : "cards"}</span></p>
        {shown.length === 0 && (
          <p className="index-card empty">
            No cards match “{query.trim()}”. <button onClick={() => setQuery("")} className="underline">Clear search</button>
          </p>
        )}
        {years.map((y, yi) => (
          <section key={y}>
            <h3 className="guide-card" style={{ "--tab": tabSpots[yi % tabSpots.length] } as React.CSSProperties}><span>{y}</span></h3>
            <ul>
              {shown
                .filter((p) => (p.date.slice(0, 4) || "Undated") === y)
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((p) => {
                  const body = <><span className="card-title">{p.title}</span><span className="card-source">{p.source}</span></>;
                  return <li key={p.title}>{p.url ? <a href={p.url} className="index-card">{body}</a> : <div className="index-card">{body}</div>}</li>;
                })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
