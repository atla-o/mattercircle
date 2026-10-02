import Link from "next/link";
import { ClimbList } from "@/components/ClimbList";
import { climbLabel, listClimb, lockedProducts } from "@/lib/climb";
import { site } from "@/lib/site";

export default function HomePage() {
  const climb = listClimb();
  const locked = lockedProducts();

  return (
    <div className="site-wrap flex flex-1 flex-col py-8 sm:py-12">
      <p className="kicker">
        {site.parent} · matter / factory
      </p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">
        {site.name}
      </h1>
      <p className="mt-4 max-w-prose text-lg">{site.thesis}</p>
      <p className="mt-2 max-w-prose">{site.endState}</p>
      <p className="mt-6 font-sans text-sm leading-6">{climbLabel()}</p>

      <div className="mt-8">
        <ClimbList climb={climb} />
      </div>

      <p className="mt-6 max-w-prose text-sm leading-6">
        Category names stay plain. Products inside a category can flex later.
        {locked[0] ? (
          <>
            {" "}
            First lock:{" "}
            <Link href={`/products/${locked[0].slug}`}>{locked[0].name}</Link>.
          </>
        ) : null}
      </p>
    </div>
  );
}
