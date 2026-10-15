"use client";
import { useState } from "react";

type Piece = { title: string; date: string; url: string; source: string; topics: string[]; with: string[] };

// First topic is the default view.
const topics = [
  { id: "ai", label: "AI" },
  { id: "stablecoins", label: "Stablecoins" },
  { id: "interoperability", label: "Interoperability" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "defi", label: "DeFi" },
  { id: "all", label: "All" },
];

export default function Archive({ pieces }: { pieces: Piece[] }) {
  const [topic, setTopic] = useState(topics[0].id);
  const shown = pieces.filter((p) => topic === "all" || p.topics.includes(topic));
  const years = [...new Set(shown.map((p) => p.date.slice(0, 4) || "Undated"))].sort((a, b) => (a === "Undated" ? 1 : b === "Undated" ? -1 : b.localeCompare(a)));

  return (
    <>
      <div className="mt-5 flex flex-wrap gap-2 text-[13px]">
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => setTopic(t.id)}
            className={`rounded-full border px-3 py-1 ${topic === t.id ? "border-ink bg-ink text-page" : "border-line text-ink-2 hover:border-muted"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-8 space-y-10">
        {years.map((y) => (
          <section key={y}>
            <h3 className="font-mono text-[13px] text-muted">{y}</h3>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {shown
                .filter((p) => (p.date.slice(0, 4) || "Undated") === y)
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((p) => {
                  const row = (
                    <>
                      <span className="text-[15px]">{p.title}</span>
                      <span className="text-[12px] text-muted">{[p.source, p.with.length ? `with ${p.with.join(", ")}` : ""].filter(Boolean).join(", ")}</span>
                    </>
                  );
                  const cls = "grid gap-1 py-3.5 md:grid-cols-[1fr_auto] md:items-baseline md:gap-6";
                  return (
                    <li key={p.title}>
                      {p.url ? <a href={p.url} className={`${cls} hover:bg-raised`}>{row}</a> : <div className={cls}>{row}</div>}
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
