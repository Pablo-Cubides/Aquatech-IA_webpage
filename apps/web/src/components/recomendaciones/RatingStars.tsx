export default function RatingStars({ value = 5 }: { value?: number }) {
  const rounded = Math.round((value || 0) * 2) / 2;
  return (
    <div aria-label={`Calificación ${rounded} de 5`} className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden>{i + 1 <= rounded ? "★" : "☆"}</span>
      ))}
    </div>
  );
}
