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

// Best performers, one column per platform. Platforms aren't ranked against each other: a Medium read and an X impression aren't the same thing.
const platformLogos: Record<string, string> = { Substack: "/logos/substack.jpg", X: "/logos/x.png", Medium: "/logos/medium.svg" };

function Reach({ groups }: { groups: typeof impact.top }) {
  return (
    <div className="mt-8 grid gap-10 md:grid-cols-3 md:gap-0">
      {groups.map((g, gi) => (
        <section key={g.where} className={gi > 0 ? "md:border-l md:border-line md:pl-8" : "md:pr-8"}>
          <h3 className="flex items-center gap-2.5 text-[15px] font-semibold">
            <img src={platformLogos[g.where]} alt="" width={22} height={22} className="rounded-full ring-1 ring-line" />{g.where}
          </h3>
          <ul className="mt-5 space-y-6">
            {g.items.map((it) => {
              const [lead, ...rest] = it.stat.replace(/ on \w+$/, "").split(", ");
              return (
                <li key={it.title}>
                  <p className="text-[30px] font-semibold leading-none tracking-tight">{lead.split(" ")[0]}<span className="ml-2 text-[14px] font-normal tracking-normal text-ink-2">{lead.split(" ").slice(1).join(" ")}</span></p>
                  {rest.length > 0 && <p className="mt-1.5 text-[13px] text-ink-2">{rest.join(", ")}</p>}
                  <p className="mt-2 text-[15px]"><Name {...it} /></p>
                  {it.note && <p className="mt-0.5 text-[13px] text-muted">{it.note}</p>}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default function Impact() {
  const { collaborators, client, top, growth, hyperlane } = impact;
  const [posts, ...rest] = hyperlane.totals;
  // Share of views that were read to the end, from Medium's own view and read counts.
  const value = (label: string) => num(hyperlane.totals.find((t) => t.label === label)!.value);
  // Views are a lower bound ("14k+"), so round down rather than overstate.
  const readThrough = Math.floor((value("reads") / value("views")) * 100);
  return (
    <>
      <h1 className="text-[30px] font-semibold tracking-tight">Impact</h1>

      <h2 className="mt-12 text-[20px] font-semibold">Collaborated with</h2>
      <Collaborators names={collaborators} />

      <H2>Shoal Research</H2>
      <p className="mt-1 text-[14px] text-ink-2">{growth.caption}</p>
      <Growth stats={growth.stats} />

      <H2>Top performing</H2>
      <Reach groups={top} />

      <H2>{hyperlane.role}</H2>
      <p className="mt-1 text-[14px] text-ink-2">{hyperlane.summary}</p>
      <p className="mt-5 max-w-[52ch] text-[22px] leading-[1.6] text-ink-2 md:text-[26px]">
        <span className="font-semibold text-ink">~{readThrough}%</span> read-through across <span className="font-semibold text-ink">{posts.value}</span> {posts.label} on{" "}
        <a href={hyperlane.url} className="text-ink underline decoration-line underline-offset-4 hover:decoration-muted">Hyperlane&rsquo;s Medium</a> in six months:{" "}
        {rest.map((t, i) => (
          <span key={t.label}><span className="font-semibold text-ink">{t.value}</span> {t.label}{i < rest.length - 2 ? ", " : i === rest.length - 2 ? ", " : "."}</span>
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
