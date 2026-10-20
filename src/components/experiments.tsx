import type { Experiment } from "@/content/site";

// Each project is drawn as the path its money or logic takes: hollow nodes for steps, a filled node for the outcome.
// On hover a dot runs the length of the line once, the same thing the project does.
export default function Experiments({ items }: { items: Experiment[] }) {
  return (
    <div className="mt-8 space-y-16">
      {items.map((p) => (
        <article key={p.title} className="flow-project">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="text-[22px] font-semibold tracking-tight">{p.title}</h3>
            <div className="flex gap-5 text-[13.5px]">
              {p.live && <a href={p.live} className="underline underline-offset-4">Demo</a>}
              {p.repo && <a href={p.repo} className="underline underline-offset-4">Code</a>}
            </div>
          </div>
          <p className="mt-1 text-[15px] text-ink-2">{p.summary}</p>

          <ol className="flow mt-7" style={{ "--steps": p.flow.length } as React.CSSProperties}>
            {p.flow.map((step, i) => (
              <li key={step} className={i === p.flow.length - 1 ? "outcome" : undefined}>
                <span className="flow-node" aria-hidden />
                <span className="flow-label">{step}</span>
              </li>
            ))}
            <span className="flow-pulse" aria-hidden />
          </ol>

          <p className="mt-6 text-[13px] text-muted">{p.status} Built with {p.tags.join(", ")}.</p>
        </article>
      ))}
    </div>
  );
}
