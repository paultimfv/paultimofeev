"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";

const tabs = [
  { href: "/", label: "Work" },
  { href: "/impact", label: "Impact" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 pt-6 text-[14px]">
      {tabs.map((t) => {
        const on = t.href === "/" ? path === "/" : path.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} className={on ? "text-ink" : "text-muted hover:text-ink-2"}>
            {t.label}
          </Link>
        );
      })}
      <div className="ml-auto"><ThemeToggle /></div>
    </nav>
  );
}
