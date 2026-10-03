import Link from "next/link";
import { CheckoutButton } from "@/components/CheckoutButton";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header>
      <div className="flex justify-center pt-4">
        <a
          href="https://devoutshaman.com"
          className="font-serif text-3xl leading-none no-underline"
        >
          o
        </a>
      </div>
      <div className="site-wrap flex items-center justify-between gap-4 py-4">
        <Link href="/" className="font-serif text-lg tracking-tight no-underline">
          {site.name}
        </Link>
        <div className="flex items-center gap-2">
          <p className="kicker">{site.climbName}</p>
          <CheckoutButton />
        </div>
      </div>
    </header>
  );
}
