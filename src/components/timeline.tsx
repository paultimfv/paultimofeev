import type { Entry } from "@/content/site";

// Each entry is a bar across a shared year axis; work and education sit in separate lanes so overlaps show.
const toNum = (d: string) => { const [y, m] = d.split("-").map(Number); return y + ((m || 1) - 1) / 12; };
// "2022" as an end means the end of 2022; "2022-06" means the end of June.
const toEnd = (d: string) => { const [y, m] = d.split("-").map(Number); return m ? y + m / 12 : y + 1; };

export default function Timeline({ entries }: { entries: Entry[] }) {
  const now = new Date();
  const nowNum = now.getFullYear() + now.getMonth() / 12;
  const first = Math.floor(Math.min(...entries.map((e) => toNum(e.start))));
  const last = Math.ceil(Math.max(nowNum, ...entries.map((e) => (e.end ? toEnd(e.end) : nowNum))));
  const span = last - first;
  const years = Array.from({ length: span + 1 }, (_, i) => first + i);
  const pos = (n: number) => `${((n - first) / span) * 100}%`;
  const lanes: { kind: Entry["kind"]; label: string }[] = [{ kind: "work", label: "Work" }, { kind: "education", label: "Education" }];

  return (
    <div className="mt-10 space-y-10">
      {lanes.map((lane) => (
        <section key={lane.kind}>
          <h2 className="mb-3 text-[13px] text-muted">{lane.label}</h2>
          <div className="relative border-l border-line">
            {years.map((y) => (
              <div key={y} className="absolute inset-y-0 border-l border-line/60" style={{ left: pos(y) }} />
            ))}
            {entries.filter((e) => e.kind === lane.kind).sort((a, b) => toNum(a.start) - toNum(b.start)).map((e) => {
              const s = toNum(e.start), f = e.end ? toEnd(e.end) : nowNum;
              return (
                <div key={e.org + e.start} className="relative h-14">
                  <div className={`absolute top-2 h-2 rounded-full ${e.end ? "bg-muted" : "bg-ink"}`} style={{ left: pos(s), width: `max(6px, ${((f - s) / span) * 100}%)` }} />
                  <div className="absolute top-6 whitespace-nowrap text-[12.5px]" style={{ left: `min(${pos(s)}, 70%)` }}>
                    <span className="text-ink">{e.org}</span>{e.title && <span className="text-muted"> {e.title}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
      <div className="relative h-5 font-mono text-[11px] text-muted">
        {years.map((y) => <span key={y} className="absolute -translate-x-1/2" style={{ left: pos(y) }}>{y}</span>)}
      </div>
    </div>
  );
}
