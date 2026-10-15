import { about, timeline } from "@/content/site";
import Timeline from "@/components/timeline";

export default function About() {
  return (
    <>
      <h1 className="text-[30px] font-semibold tracking-tight">About</h1>
      {about.length > 0 && (
        <div className="mt-6 max-w-[68ch] space-y-4 text-[16px] leading-[1.7] text-ink-2">
          {about.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      )}
      <h2 className="mt-16 text-[20px] font-semibold">Experience and education</h2>
      <Timeline entries={timeline} />
    </>
  );
}
