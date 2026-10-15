// Edit everything on the site from this folder.

export const site = {
  name: "Paul Timofeev",
  intro:
    "I’m a researcher with 6 years of experience across the digital asset ecosystem, currently leading the research newsletter at Shoal, read by 2,000+ founders, capital allocators, and researchers. Using onchain data and qualitative research, I spot emerging trends and businesses early and break down complex technical topics into clear, intuitive writing. I believe in a future where money moves as freely as information does on the web today.",
  email: "paul.timfv@gmail.com",
  // Links under the intro, in this order. A link with an empty href is hidden.
  links: [
    { label: "X", href: "https://x.com/ptimfv" },
    { label: "Substack", href: "https://www.shoal.gg" },
    { label: "GitHub", href: "https://github.com/paultimfv" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/paul-timofeev-8831a7198" },
  ],
};

export type Project = { title: string; summary: string; tags: string[]; live?: string; repo?: string };

export const projects: Project[] = [
  {
    title: "Laso Finance",
    summary: "Stablecoin deposits across 7 chains and x402 agent payments, pulled from chain data and checked against Laso's own reported volume.",
    tags: ["Python", "Alchemy", "Helius", "Blockscout", "Next.js"],
    live: "https://laso-finance.vercel.app",
    repo: "https://github.com/paultimfv/laso-finance",
  },
  {
    title: "Maple Finance",
    summary: "Revenue, AUM, lenders and borrowers rebuilt from 239 contracts on Ethereum and Robinhood Chain.",
    tags: ["Python", "Postgres", "GitHub Actions", "Next.js"],
    live: "https://maple-robinhood.vercel.app",
    repo: "https://github.com/paultimfv/maple-pipeline",
  },
  {
    title: "Robinhood Earn",
    summary: "Robinhood Chain activity, Robinhood Earn flows, and who gets paid across the stack.",
    tags: ["Postgres", "DeFiLlama", "Next.js"],
    live: "https://robinhood-earn.vercel.app",
    repo: "https://github.com/paultimfv/robinhood-earn",
  },
  {
    title: "SYRUP model",
    summary: "Interactive valuation model for Maple's SYRUP token, with inputs from the pipeline.",
    tags: ["Model", "Next.js"],
    live: "https://maple-model.vercel.app",
    repo: "https://github.com/paultimfv/maple-model",
  },
];

// Timeline. Dates as "YYYY" or "YYYY-MM". A year-only end runs to the end of that year. Leave end empty for current.
export type Entry = { kind: "work" | "education"; org: string; title?: string; start: string; end?: string };

export const timeline: Entry[] = [
  { kind: "education", org: "Baruch College", title: "BBA, Digital Marketing", start: "2019", end: "2022" },
  { kind: "education", org: "Baruch College", title: "MS, Data Analytics", start: "2023", end: "2025" },
  { kind: "work", org: "BlockChainDriven", title: "Growth Intern", start: "2020-06", end: "2020-09" },
  { kind: "work", org: "MoneyMouthMarketing", title: "Social Media", start: "2021", end: "2021" },
  { kind: "work", org: "Hubble Protocol", title: "Community Manager", start: "2021-10", end: "2022-12" },
  { kind: "work", org: "Started writing and publishing content", start: "2022-10" },
  { kind: "work", org: "Bankless", title: "Technical Writer", start: "2023", end: "2023" },
  { kind: "work", org: "Shoal Research", title: "Research Analyst, promoted to Research Lead", start: "2023-11", end: "2024" },
  { kind: "work", org: "Hyperlane", title: "Technical Content Lead", start: "2024", end: "2025" },
  { kind: "work", org: "Shoal Research", title: "Research Lead", start: "2025" },
];

// About page paragraphs, shown above the timeline.
export const about: string[] = [];

// Impact page, top to bottom.
type Item = { title: string; url?: string; stat: string };
const ML = "https://medium.com/hyperlane/";

export const impact = {
  repostedBy: ["Circle", "Coinbase Developer Platform", "Zama", "Andre Cronje", "Jeremy Allaire", "Plasma", "Jito", "EigenLayer", "Particle Network"],
  reviewedBy: ["Cloudflare", "Visa", "Circle", "Coinbase", "x402 Foundation", "Altitude", "Anza", "Pantera Capital", "LI.FI"],

  client: {
    name: "Particle Network",
    work: "2 reports plus threads and articles on chain abstraction",
    stats: ["200k+ organic impressions", "Top 5 on Kaito for chain abstraction mindshare"],
    links: [
      { label: "Particle Network: The Chain Abstraction Layer", url: "https://www.shoal.gg/p/particle-network-the-chain-abstraction" },
      { label: "The 0-1 of Chain Abstraction", url: "https://www.shoal.gg/p/the-0-1-of-chain-abstraction" },
    ],
  },

  top: [
    { label: "Most views", items: [{ title: "MEV-Protection with DEX Aggregators", url: "https://www.shoal.gg/p/mev-protection-dex-and-aggregator", stat: "100k+ views on Substack" }] },
    {
      label: "Most impressions on X",
      items: [
        { title: "Flying Tulip", stat: "79k impressions" },
        { title: "APR vs APY", url: "https://twitter.com/pt1mfv_/status/1626270688280739840", stat: "77k views, 349 likes" },
        { title: "The Robotics Data Layer", stat: "57k impressions" },
        { title: "Compute Is The New Oil", stat: "54k impressions" },
      ],
    },
    { label: "Most read on Medium", items: [{ title: "Latency and Profits: MEV on Solana", url: "https://paultimofeev.medium.com/latency-and-profits-mev-on-solana-defe9a05011a", stat: "6.4k views, 2.9k reads, 202 claps" }] },
  ] as { label: string; items: Item[] }[],

  growth: {
    caption: "Audience since I joined in Nov 2023",
    stats: [
      { label: "Telegram", from: "705", to: "12,400", x: "17.6x" },
      { label: "X followers", from: "502", to: "6,229", x: "12.4x" },
      { label: "Substack", from: "222", to: "2,410", x: "10.9x" },
    ],
  },

  hyperlane: {
    role: "Hyperlane",
    summary: "Technical Content Lead, Oct 2024 to Apr 2025",
    url: "https://medium.com/hyperlane",
    totals: [
      { value: "21", label: "posts" },
      { value: "17k+", label: "presentations" },
      { value: "14k+", label: "views" },
      { value: "4.3k", label: "reads" },
    ],
  },
};
