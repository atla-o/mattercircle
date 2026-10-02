import Link from "next/link";

export default function NotFound() {
  return (
    <div className="site-wrap py-16">
      <h1 className="font-serif text-3xl">Not on the climb</h1>
      <p className="mt-4">
        <Link href="/">Return to Mattercircle</Link>
      </p>
    </div>
  );
}
