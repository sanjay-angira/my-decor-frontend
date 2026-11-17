import type { ReactNode } from "react";
import StoreAndCategoryFlowWrapper from "@/components/store/StoreAndCategoryFlowWrapper";

export default function StoreAndCategoryFlowLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <StoreAndCategoryFlowWrapper>{children}</StoreAndCategoryFlowWrapper>
  );
}
