import { impact } from "@/content/site";
import { logoFor } from "@/content/logos";
import Collaborators from "@/components/collaborators";

const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="mt-20 text-[20px] font-semibold">{children}</h2>;
const Name = ({ title, url }: { title: string; url?: string }) => (url ? <a href={url} className="hover:underline">{title}</a> : <>{title}</>);
const Logo = ({ name, size = 24 }: { name: string; size?: number }) => {
  const src = logoFor(name);
  return src ? <img src={src} alt="" width={size} height={size} className="inline-block flex-none rounded-full bg-white object-cover ring-1 ring-line" /> : null;
};
// "12,400" -> 12400, "100k+ views" -> 100000, "6.4k views" -> 6400.
const num = (s: string) => { const m = s.replace(/,/g, "").match(/([\d.]+)(k?)/i)!; return parseFloat(m[1]) * (m[2] ? 1000 : 1); };

// Audience growth as dumbbells on a shared log axis: where each channel started, and where it is now.
function Growth({ stats }: { stats: typeof impact.growth.stats }) {
  const lo = 2, hi = Math.log10(20000); // axis runs from 100 to 20k
  const pos = (n: number) => `${((Math.log10(n) - lo) / (hi - lo)) * 100}%`;
  const ticks = [100, 1000, 10000];
  return (
    <div className="mt-8">
      <div className="space-y-2">
        {stats.map((s) => (
          <div key={s.label} className="grid grid-cols-[92px_1fr] items-center gap-4 md:grid-cols-[120px_1fr]">
            <span className="text-[14px] text-ink-2">{s.label}</span>
            <div className="relative h-14">
              {ticks.map((t) => <div key={t} className="absolute inset-y-0 border-l border-line/70" style={{ left: pos(t) }} />)}
              <div className="absolute top-1/2 h-px -translate-y-1/2 bg-muted" style={{ left: pos(num(s.from)), right: `calc(100% - ${pos(num(s.to))})` }} />
              <div className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-muted bg-page" style={{ left: pos(num(s.from)) }} />
              <div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" style={{ left: pos(num(s.to)) }} />
              <span className="absolute top-0 -translate-x-1/2 font-mono text-[11px] text-muted" style={{ left: pos(num(s.from)) }}>{s.from}</span>
              <span className="absolute bottom-0 -translate-x-1/2 whitespace-nowrap text-[13px]" style={{ left: pos(num(s.to)) }}>
                <span className="font-semibold">{s.to}</span> <span className="text-ink-2">{s.x}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[92px_1fr] gap-4 md:grid-cols-[120px_1fr]">
        <span />
        <div className="relative h-5 font-mono text-[11px] text-muted">
          {ticks.map((t) => <span key={t} className="absolute -translate-x-1/2" style={{ left: pos(t) }}>{t >= 1000 ? `${t / 1000}k` : t}</span>)}
        </div>
      </div>
    </div>
  );
}

// Best performers ranked on one linear axis; each bar is labelled with the platform and the metric it was measured by.
function Reach({ groups }: { groups: typeof impact.top }) {
  const items = groups.flatMap((g) => g.items.map((it) => ({ ...it, where: g.where, n: num(it.stat) }))).sort((a, b) => b.n - a.n);
  const max = items[0].n;
  return (
    <ol className="mt-8 space-y-6">
      {items.map((it) => (
        <li key={it.title}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <span className="text-[15px]"><Name {...it} /></span>
            <span className="text-[13px] text-ink-2">{it.stat}{!it.stat.includes(it.where) && <span className="text-muted">, {it.where}</span>}</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-ink" style={{ width: `max(6px, ${(it.n / max) * 100}%)` }} />
        </li>
      ))}
    </ol>
  );
}

export default function Impact() {
  const { collaborators, client, top, growth, hyperlane } = impact;
  const [posts, ...rest] = hyperlane.totals;
  return (
    <>
      <h1 className="text-[30px] font-semibold tracking-tight">Impact</h1>

      <h2 className="mt-10 text-[13px] text-muted">Collaborated with</h2>
      <Collaborators names={collaborators} />

      <H2>Shoal Research</H2>
      <p className="mt-1 text-[14px] text-ink-2">{growth.caption}. Hollow dot is where each channel started.</p>
      <Growth stats={growth.stats} />

      <H2>Top performing</H2>
      <p className="mt-1 text-[14px] text-ink-2">Single pieces with the widest reach, across Substack, X and Medium.</p>
      <Reach groups={top} />

      <H2>{hyperlane.role}</H2>
      <p className="mt-1 text-[14px] text-ink-2">{hyperlane.summary}</p>
      <p className="mt-5 max-w-[46ch] text-[22px] leading-[1.6] text-ink-2 md:text-[26px]">
        <span className="font-semibold text-ink">{posts.value}</span> {posts.label} on <a href={hyperlane.url} className="text-ink underline decoration-line underline-offset-4 hover:decoration-muted">Hyperlane&rsquo;s Medium</a>, with{" "}
        {rest.map((t, i) => (
          <span key={t.label}><span className="font-semibold text-ink">{t.value}</span> {t.label}{i < rest.length - 2 ? ", " : i === rest.length - 2 ? " and " : "."}</span>
        ))}
      </p>

      <H2>Client impact</H2>
      <div className="mt-5 flex items-start gap-4">
        <Logo name={client.name} size={40} />
        <div>
          <p className="text-[18px]">{client.name}</p>
          <p className="mt-1 text-[14px] text-ink-2">{client.work}: {client.links.map((l, i) => <span key={l.url}>{i > 0 && ", "}<a href={l.url} className="underline hover:text-ink">{l.label}</a></span>)}</p>
          <p className="mt-3 text-[15px]">{client.stats.join(". ")}.</p>
        </div>
      </div>
    </>
  );
}
