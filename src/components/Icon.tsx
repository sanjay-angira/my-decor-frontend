export type IconName =
  | "arrow"
  | "bag"
  | "check"
  | "chevronDown"
  | "chevronLeft"
  | "chevronRight"
  | "close"
  | "heart"
  | "home"
  | "leaf"
  | "mail"
  | "menu"
  | "minus"
  | "pin"
  | "phone"
  | "plus"
  | "quote"
  | "search"
  | "shield"
  | "sparkles"
  | "star"
  | "tag"
  | "truck"
  | "user"
  | "zap"
  | "rotate";

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const shared = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "arrow":
      return <svg {...shared}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "bag":
      return <svg {...shared}><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg>;
    case "check":
      return <svg {...shared}><path d="m5 12 4 4L19 6" /></svg>;
    case "chevronDown":
      return <svg {...shared}><path d="m6 9 6 6 6-6" /></svg>;
    case "chevronLeft":
      return <svg {...shared}><path d="m15 18-6-6 6-6" /></svg>;
    case "chevronRight":
      return <svg {...shared}><path d="m9 18 6-6-6-6" /></svg>;
    case "close":
      return <svg {...shared}><path d="m18 6-12 12M6 6l12 12" /></svg>;
    case "heart":
      return <svg {...shared}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>;
    case "home":
      return <svg {...shared}><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /></svg>;
    case "leaf":
      return <svg {...shared}><path d="M20 4c-9 0-15 4-15 11a5 5 0 0 0 5 5c7 0 11-6 10-16Z" /><path d="M5 20c2-5 6-8 11-11" /></svg>;
    case "mail":
      return <svg {...shared}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
    case "menu":
      return <svg {...shared}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
    case "minus":
      return <svg {...shared}><path d="M5 12h14" /></svg>;
    case "pin":
      return <svg {...shared}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
    case "phone":
      return <svg {...shared}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.7L7.1 10.3a16 16 0 0 0 6 6l1.9-1.9a2 2 0 0 1 1.7-.6l3 .5a2 2 0 0 1 1.7 2Z" /></svg>;
    case "plus":
      return <svg {...shared}><path d="M12 5v14M5 12h14" /></svg>;
    case "quote":
      return <svg {...shared}><path d="M7 11h4v8H5v-6a4 4 0 0 1 4-4Z" /><path d="M17 11h4v8h-6v-6a4 4 0 0 1 4-4Z" /></svg>;
    case "search":
      return <svg {...shared}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
    case "shield":
      return <svg {...shared}><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></svg>;
    case "sparkles":
      return <svg {...shared}><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z" /></svg>;
    case "star":
      return <svg {...shared}><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" /></svg>;
    case "tag":
      return <svg {...shared}><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V4h9l8.6 6.6a2 2 0 0 1 0 2.8Z" /><circle cx="7.5" cy="8" r="1" /></svg>;
    case "truck":
      return <svg {...shared}><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7" /><circle cx="7.5" cy="18" r="2" /><circle cx="17.5" cy="18" r="2" /></svg>;
    case "user":
      return <svg {...shared}><circle cx="12" cy="8" r="4" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></svg>;
    case "zap":
      return <svg {...shared}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>;
    case "rotate":
      return <svg {...shared}><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>;
  }
}
