"use client";
import { useState } from "react";
import { logoFor } from "@/content/logos";

const Mark = ({ name, size }: { name: string; size: number }) => {
  const src = logoFor(name);
  return src
    ? <img src={src} alt="" width={size} height={size} className="flex-none rounded-full bg-white object-cover ring-1 ring-line" />
    : <span className="grid flex-none place-items-center rounded-full bg-raised font-serif text-ink-2 ring-1 ring-line" style={{ width: size, height: size, fontSize: size * 0.36 }}>{name.split(" ").map((w) => w[0]).join("")}</span>;
};

// Every name links back to the writing at the centre, not to me: they reposted, reviewed or worked on a piece.
// Nodes alternate between two ellipses so neighbouring labels don't collide. Lines draw out once on load.
export default function Collaborators({ names }: { names: string[] }) {
  const [hover, setHover] = useState<string | null>(null);
  const nodes = names.map((name, i) => {
    const a = -Math.PI / 2 + (i / names.length) * Math.PI * 2;
    const [rx, ry] = i % 2 ? [31, 27] : [45, 41];
    return { name, x: 50 + rx * Math.cos(a), y: 50 + ry * Math.sin(a) };
  });

  return (
    <>
      <div className="collab-map relative mt-4 hidden h-[460px] md:block">
        {/* Drawn at roughly the map's real size (about 1000x460), so strokes stay even when it stretches. */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 460" preserveAspectRatio="none" aria-hidden>
          {nodes.map((n, i) => (
            <line key={n.name} x1="500" y1="230" x2={n.x * 10} y2={n.y * 4.6} pathLength={1}
              className={`collab-line${hover === n.name ? " on" : ""}`} style={{ animationDelay: `${i * 45}ms` }} />
          ))}
        </svg>
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-ink ring-4 ring-page" />
          <span className="rounded bg-page px-2 font-serif text-[16px] italic text-ink">My writing</span>
        </div>
        {nodes.map((n, i) => (
          <div key={n.name} onMouseEnter={() => setHover(n.name)} onMouseLeave={() => setHover(null)}
            className={`collab-node absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5${hover && hover !== n.name ? " dim" : ""}`}
            style={{ left: `${n.x}%`, top: `${n.y}%`, animationDelay: `${300 + i * 45}ms` }}>
            <Mark name={n.name} size={34} />
            <span className="whitespace-nowrap rounded bg-page px-1.5 text-[12.5px] text-ink-2">{n.name}</span>
          </div>
        ))}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3 md:hidden">
        {names.map((n) => <li key={n} className="flex items-center gap-2 text-[15px]"><Mark name={n} size={24} />{n}</li>)}
      </ul>
    </>
  );
}
