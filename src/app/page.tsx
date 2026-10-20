import Image from "next/image";
import { site, projects, dataWork, experiments } from "@/content/site";
import writing from "@/content/writing.json";
import featured from "@/content/featured.json";
import Archive from "@/components/archive";
import Bookshelf from "@/components/bookshelf";
import DataTable from "@/components/data-table";
import Experiments from "@/components/experiments";

export default function Home() {
  return (
    <>
      <h1 className="text-[36px] font-bold tracking-tight md:text-[44px]">{site.name}</h1>
      <section className="mt-8 grid gap-8 md:grid-cols-[300px_1fr] md:items-center md:gap-14">
        <Image src="/paul.png" alt={site.name} width={600} height={600} priority className="photo aspect-square w-full max-w-[300px] object-cover" />
        <div>
          <h2 className="text-[19px] font-semibold">Hi, I’m Paul</h2>
          <p className="mt-2 max-w-[68ch] text-[16px] leading-[1.7] text-ink-2">{site.intro}</p>
          <div className="mt-6 flex flex-wrap gap-x-2 text-[14px] text-muted">
            {site.links.filter((l) => l.href).map((l, i) => (
              <span key={l.label}>
                {i > 0 && <span className="mr-2">/</span>}
                <a href={l.href} className="text-ink-2 hover:text-ink hover:underline">{l.label}</a>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-[20px] font-semibold">Featured writing</h2>
        {/* The featured title wins over the archive's, so a piece can be shelved under a shorter name. */}
        <Bookshelf pieces={featured.map((f) => ({ source: "", ...writing.find((w) => w.url === f.url), ...f }))} />
      </section>

      <section className="mt-20">
        <h2 className="text-[20px] font-semibold">Data</h2>
        <p className="mt-1 text-[14px] text-ink-2">Onchain ETL pipelines: raw blockchain data pulled, decoded and loaded into dashboards that refresh daily.</p>
        <DataTable projects={projects} dataWork={dataWork} />
      </section>

      <section className="mt-20">
        <h2 className="text-[20px] font-semibold">All writing</h2>
        <Archive pieces={writing} />
      </section>

      <section className="mt-20">
        <h2 className="text-[20px] font-semibold">Projects</h2>
        <p className="mt-1 text-[14px] text-ink-2">Demos and experiments, built to test ideas.</p>
        <Experiments items={experiments} />
      </section>
    </>
  );
}
