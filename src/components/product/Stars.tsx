import { Icon } from "@/components/Icon";
import { cn } from "@/lib/utils";

export function Stars({
  value,
  className,
  size = "h-4 w-4",
}: {
  value: number;
  className?: string;
  size?: string;
}) {
  const rounded = Math.round(value);
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          name="star"
          className={cn(size, star <= rounded ? "fill-amber-400 text-amber-400" : "text-border")}
        />
      ))}
    </span>
  );
}
