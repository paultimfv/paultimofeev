import { about, timeline } from "@/content/site";
import Timeline from "@/components/timeline";

export default function Experience() {
  return (
    <>
      <h1 className="text-[30px] font-semibold tracking-tight">Experience</h1>
      {about.length > 0 && (
        <div className="mt-6 max-w-[68ch] space-y-4 text-[16px] leading-[1.7] text-ink-2">
          {about.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      )}
      <Timeline entries={timeline} />
    </>
  );
}
