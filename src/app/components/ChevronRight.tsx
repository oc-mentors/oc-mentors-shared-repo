export function ChevronRight({ className, color }: { className?: string; color?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke={color || "currentColor"}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
