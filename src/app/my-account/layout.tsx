import type { ReactNode } from "react";
import { MyAccountLayout } from "@/components/account/MyAccountLayout";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <MyAccountLayout>{children}</MyAccountLayout>;
}
