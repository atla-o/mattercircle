import Link from "next/link";
import { SiteMark } from "@/components/SiteMark";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header>
      <div className="site-wrap flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <SiteMark className="h-8 w-8" />
          <span className="font-serif text-lg tracking-tight">{site.name}</span>
        </Link>
        <p className="kicker">{site.climbName}</p>
      </div>
    </header>
  );
}
