import Link from "next/link";
import { ClimbList } from "@/components/ClimbList";
import { shownClimb } from "@/lib/shown";

export default function HomePage() {
  const climb = shownClimb();

  return (
    <div className="site-wrap flex h-full min-h-0 flex-1 flex-col py-8">
      <p className="text-center font-sans text-sm leading-6">
        {climb.map((category, index) => (
          <span key={category.slug}>
            {index > 0 ? " → " : null}
            <Link href={`/climb/${category.slug}`}>{category.name}</Link>
          </span>
        ))}
      </p>

      <div className="flex flex-1 items-center">
        <div className="w-full">
          <ClimbList climb={climb} />
        </div>
      </div>
    </div>
  );
}
