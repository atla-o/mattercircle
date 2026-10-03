import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer>
      <p className="site-wrap py-6 text-center text-lg">{site.thesis}</p>
    </footer>
  );
}
