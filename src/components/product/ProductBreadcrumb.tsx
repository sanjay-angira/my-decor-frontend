import Link from "next/link";
import { Icon } from "@/components/Icon";

export function ProductBreadcrumb({ category, name }: { category: string; name: string }) {
  return (
    <nav aria-label="Breadcrumb" className="container-page pt-5">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <li>
          <Link href="/" className="flex items-center gap-1.5 transition-colors hover:text-brand">
            <Icon name="home" className="h-3.5 w-3.5" /> Home
          </Link>
        </li>
        <Icon name="chevronRight" className="h-3.5 w-3.5 shrink-0 text-border" />
        <li className="font-medium text-foreground/70">{category}</li>
        <Icon name="chevronRight" className="h-3.5 w-3.5 shrink-0 text-border" />
        <li className="max-w-[16rem] truncate font-semibold text-foreground sm:max-w-none">{name}</li>
      </ol>
    </nav>
  );
}
