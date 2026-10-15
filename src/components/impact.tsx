import { impact } from "@/content/site";

const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="mt-16 text-[20px] font-semibold">{children}</h2>;
const Name = ({ title, url }: { title: string; url?: string }) => (url ? <a href={url} className="hover:underline">{title}</a> : <>{title}</>);

export default function Impact() {
  const { repostedBy, reviewedBy, client, top, growth, hyperlane } = impact;
  return (
    <>
      <h1 className="text-[30px] font-semibold tracking-tight">Impact</h1>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {[{ label: "Reposted by", names: repostedBy }, { label: "Collaborated with", names: reviewedBy }].map((g) => (
          <div key={g.label}>
            <h2 className="text-[13px] text-muted">{g.label}</h2>
            <p className="mt-2 text-[18px] leading-[1.6] md:text-[20px]">{g.names.join(", ")}, among others</p>
          </div>
        ))}
      </div>

      <H2>Shoal Research</H2>
      <p className="mt-1 text-[14px] text-ink-2">{growth.caption}</p>
      <div className="mt-4 grid grid-cols-3 border border-line">
        {growth.stats.map((s, i) => (
          <div key={s.label} className={`p-4 md:p-5 ${i > 0 ? "border-l border-line" : ""}`}>
            <div className="flex flex-wrap items-baseline gap-x-2"><span className="text-[24px] font-semibold tracking-tight md:text-[32px]">{s.to}</span><span className="text-[15px] font-semibold text-ink-2">{s.x}</span></div>
            <div className="mt-1 text-[13px] text-ink-2">{s.label}</div>
            <div className="font-mono text-[11.5px] text-muted">from {s.from}</div>
          </div>
        ))}
      </div>

      <H2>{hyperlane.role}</H2>
      <p className="mt-1 text-[14px] text-ink-2">{hyperlane.summary}, on <a href={hyperlane.url} className="underline hover:text-ink">Hyperlane&rsquo;s Medium</a></p>
      <div className="mt-4 grid grid-cols-4 border border-line">
        {hyperlane.totals.map((t, i) => (
          <div key={t.label} className={`p-3 md:p-5 ${i > 0 ? "border-l border-line" : ""}`}>
            <div className="text-[22px] font-semibold tracking-tight md:text-[32px]">{t.value}</div>
            <div className="text-[13px] text-ink-2">{t.label}</div>
          </div>
        ))}
      </div>

      <H2>Top performing</H2>
      <div className="mt-4 space-y-8">
        {top.map((g) => (
          <div key={g.label}>
            <h3 className="text-[13px] text-muted">{g.label}</h3>
            <ul className="mt-2 divide-y divide-line border-y border-line">
              {g.items.map((it) => (
                <li key={it.title} className="grid gap-1 py-3 md:grid-cols-[1fr_auto] md:items-baseline md:gap-6">
                  <span className="text-[15px]"><Name {...it} /></span>
                  <span className="text-[14px] text-ink-2">{it.stat}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="text-[13px] text-muted">Client impact</h3>
          <ul className="mt-2 border-y border-line">
            <li className="grid gap-1 py-3 md:grid-cols-[1fr_auto] md:items-baseline md:gap-6">
              <div>
                <div className="text-[15px]">{client.name}</div>
                <div className="text-[12.5px] text-muted">
                  {client.work}:{" "}
                  {client.links.map((l, i) => <span key={l.url}>{i > 0 && ", "}<a href={l.url} className="underline hover:text-ink">{l.label}</a></span>)}
                </div>
              </div>
              <div className="text-[14px] text-ink-2 md:text-right">{client.stats.map((s) => <div key={s}>{s}</div>)}</div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
