"use client";
import { useEffect, useRef, useState } from "react";
import type { Project, DataWork } from "@/content/site";
import { logoFor } from "@/content/logos";

type Kind = "Pipeline" | DataWork["kind"];
type Row = { title: string; kind: Kind; date: string; year: string; summary?: string; tags?: string[]; chains?: Project["chains"]; live?: string; repo?: string; url?: string };

const icons: Record<Kind, React.ReactNode> = {
  Pipeline: <path d="M2 4h4l2 4h6M2 12h4l2-4" />,
  Dune: <><circle cx="8" cy="8" r="6" /><path d="M2.5 10.5c3-1 7-1 11-3" /></>,
  Python: <path d="M5.5 4 2 8l3.5 4M10.5 4 14 8l-3.5 4" />,
  "Claude skills": <path d="M8 2v12M2 8h12M3.8 3.8l8.4 8.4M12.2 3.8l-8.4 8.4" />,
};
const Icon = ({ kind }: { kind: Kind }) => (
  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 flex-none" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{icons[kind]}</svg>
);

const Logo = ({ name, size = 22 }: { name: string; size?: number }) => {
  const src = logoFor(name);
  return src
    ? <img src={src} alt="" width={size} height={size} className="flex-none rounded-full bg-white object-cover ring-1 ring-line" />
    : <span className="grid flex-none place-items-center rounded-full bg-raised text-[11px] text-muted ring-1 ring-line" style={{ width: size, height: size }}>{name[0]}</span>;
};

const Chains = ({ chains }: { chains?: Project["chains"] }) =>
  !chains ? <span className="text-muted">-</span>
    : typeof chains[0] === "number" ? <span className="text-ink-2">{chains[0]} chains</span>
    : <span className="flex -space-x-1.5">{chains.map((c) => <span key={c} title={String(c)}><Logo name={String(c)} size={18} /></span>)}</span>;

export default function DataTable({ projects, dataWork }: { projects: Project[]; dataWork: DataWork[] }) {
  const rows: Row[] = [
    // Pipelines refresh daily, so they show as live rather than with a year.
    ...projects.map((p) => ({ ...p, kind: "Pipeline" as const, date: "", year: p.live ? "Live" : "-" })),
    ...[...dataWork].sort((a, b) => b.date.localeCompare(a.date)).map((d) => ({ ...d, year: d.year ?? d.date.slice(0, 4) })),
  ];
  const kinds = [...new Set(rows.map((r) => r.kind))];

  const [tab, setTab] = useState<"pipelines" | "all">("pipelines");
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<Kind | null>(null);
  const [menu, setMenu] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const search = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") { e.preventDefault(); search.current?.focus(); }
      if (e.key === "Escape") setMenu(false);
    };
    const onClick = (e: MouseEvent) => !menuRef.current?.contains(e.target as Node) && setMenu(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("mousedown", onClick); };
  }, []);

  // Searching or filtering always looks across everything, so nothing hides behind the Pipelines tab.
  const q = query.trim().toLowerCase();
  const filtering = q !== "" || kind !== null;
  const shown = rows.filter((r) =>
    (filtering || tab === "all" || r.kind === "Pipeline") &&
    (!kind || r.kind === kind) &&
    (!q || [r.title, r.kind, r.summary, ...(r.tags ?? [])].join(" ").toLowerCase().includes(q)));

  return (
    <div className="mt-5">
      <div className="flex gap-6 border-b border-line text-[14px]">
        {([["pipelines", "Pipelines", projects.length], ["all", "All work", rows.length]] as const).map(([id, label, n]) => (
          <button key={id} onClick={() => { setTab(id); setQuery(""); setKind(null); }}
            className={`-mb-px border-b-2 pb-2.5 ${tab === id && !filtering ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink-2"}`}>
            {label} <span className="ml-1 font-mono text-[11.5px] text-muted">{n}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <label className="flex min-w-[220px] flex-1 items-center gap-2.5 rounded-lg border border-line bg-raised/50 px-3 py-2 text-[14px] focus-within:border-muted">
          <svg viewBox="0 0 16 16" className="h-4 w-4 text-muted" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" strokeLinecap="round" /></svg>
          <input ref={search} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search data work" aria-label="Search data work"
            className="w-full bg-transparent outline-none placeholder:text-muted" />
          <kbd className="rounded border border-line px-1.5 font-mono text-[11px] text-muted">/</kbd>
        </label>
        <div ref={menuRef} className="relative">
          <button onClick={() => setMenu(!menu)} aria-expanded={menu}
            className={`flex h-full items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-[14px] ${kind ? "border-muted text-ink" : "border-line text-ink-2 hover:border-muted"}`}>
            {kind ? <><Icon kind={kind} />{kind}</> : "Type"}
            <svg viewBox="0 0 16 16" className={`h-3 w-3 transition-transform ${menu ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="m4 6 4 4 4-4" /></svg>
          </button>
          {menu && (
            <ul className="absolute right-0 z-10 mt-1.5 w-56 rounded-xl border border-line bg-page p-1.5 text-[14px] shadow-2xl shadow-black/40">
              {[null, ...kinds].map((k) => (
                <li key={k ?? "any"}>
                  <button onClick={() => { setKind(k); setMenu(false); }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-raised ${kind === k ? "text-ink" : "text-ink-2"}`}>
                    {k ? <Icon kind={k} /> : <span className="w-3.5" />}
                    <span className="flex-1">{k ?? "Any type"}</span>
                    <span className="font-mono text-[11.5px] text-muted">{k ? rows.filter((r) => r.kind === k).length : rows.length}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-4 text-[14px]">
        <div className="grid grid-cols-[28px_1fr_auto] items-center gap-3 border-b border-line px-2 pb-2 text-[12.5px] text-muted md:grid-cols-[28px_1fr_150px_110px_70px_20px]">
          <span className="text-right">#</span><span>Project</span>
          <span className="hidden md:block">Type</span><span className="hidden md:block">Chains</span>
          <span className="text-right">Year</span><span className="hidden md:block" />
        </div>
        {shown.length === 0 && (
          <p className="px-2 py-8 text-ink-2">
            Nothing matches “{query || kind}”.{" "}
            <button onClick={() => { setQuery(""); setKind(null); }} className="underline">Clear search</button>
          </p>
        )}
        <ul>
          {shown.map((r, i) => {
            const id = r.title + r.kind;
            const expandable = r.kind === "Pipeline";
            const isOpen = open === id;
            const cells = (
              <>
                <span className="text-right font-mono text-[12px] text-muted">{i + 1}</span>
                <span className="flex min-w-0 items-center gap-3"><Logo name={r.title} /><span className="truncate">{r.title}</span></span>
                <span className="hidden items-center gap-2 text-ink-2 md:flex"><Icon kind={r.kind} />{r.kind}</span>
                <span className="hidden md:block"><Chains chains={r.chains} /></span>
                <span className="text-right font-mono text-[12.5px] text-ink-2">{r.year}</span>
                <svg viewBox="0 0 16 16" className={`hidden h-3.5 w-3.5 text-muted transition-transform md:block ${isOpen ? "rotate-90" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  {expandable ? <path d="m6 4 4 4-4 4" /> : <path d="M6 3h7v7M13 3 4 12" />}
                </svg>
              </>
            );
            const rowClass = "grid w-full grid-cols-[28px_1fr_auto] items-center gap-3 px-2 py-3 text-left hover:bg-raised md:grid-cols-[28px_1fr_150px_110px_70px_20px]";
            return (
              <li key={id} className="border-b border-line">
                {expandable
                  ? <button onClick={() => setOpen(isOpen ? null : id)} aria-expanded={isOpen} className={rowClass}>{cells}</button>
                  : <a href={r.url} className={rowClass}>{cells}</a>}
                {expandable && (
                  <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="pb-5 pl-[52px] pr-2">
                        <p className="max-w-[64ch] leading-relaxed text-ink-2">{r.summary}</p>
                        <p className="mt-3 text-[12.5px] text-muted">Built with {r.tags?.join(", ")}</p>
                        <div className="mt-3 flex gap-5 text-[13.5px]">
                          {r.live && <a href={r.live} tabIndex={isOpen ? 0 : -1} className="underline underline-offset-4">Open dashboard</a>}
                          {r.repo && <a href={r.repo} tabIndex={isOpen ? 0 : -1} className="underline underline-offset-4">View code</a>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
