export function SiteMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="2" />
      <circle cx="32" cy="32" r="3.5" fill="currentColor" />
    </svg>
  );
}
