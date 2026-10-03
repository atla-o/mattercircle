import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer>
      <p className="site-wrap py-6 text-center font-sans text-sm">
        {site.parent}
        <span className="mx-2" aria-hidden="true">
          ·
        </span>
        {site.publisher}
      </p>
    </footer>
  );
}
