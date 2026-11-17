"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

type AutoSubmitFilterFormProps = {
  action: string;
  children: ReactNode;
};

export function AutoSubmitFilterForm({
  action,
  children,
}: AutoSubmitFilterFormProps) {
  const router = useRouter();
  const submitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSubmitTimer = () => {
    if (submitTimer.current !== null) {
      clearTimeout(submitTimer.current);
      submitTimer.current = null;
    }
  };

  useEffect(() => clearSubmitTimer, []);

  const handleChange = (event: ChangeEvent<HTMLFormElement>) => {
    clearSubmitTimer();
    const form = event.currentTarget;
    const target = event.target;

    if (
      target instanceof HTMLInputElement &&
      (target.type === "number" || target.type === "range")
    ) {
      submitTimer.current = setTimeout(() => {
        submitTimer.current = null;
        form.requestSubmit();
      }, 500);
      return;
    }

    form.requestSubmit();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearSubmitTimer();

    const params = new URLSearchParams();
    new FormData(event.currentTarget).forEach((value, key) => {
      if (typeof value === "string" && value !== "") {
        params.append(key, value);
      }
    });

    const query = params.toString();
    router.replace(query ? `${action}?${query}` : action, { scroll: false });
  };

  return (
    <form
      action={action}
      method="get"
      onChange={handleChange}
      onSubmit={handleSubmit}
    >
      {children}
    </form>
  );
}
