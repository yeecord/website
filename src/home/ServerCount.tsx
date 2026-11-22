"use client";

import NumberFlow from "@number-flow/react";
import { useEffect, useRef, useState } from "react";

/* 伺服器端照常輸出完整數字；只有在瀏覽器裡第一次捲進畫面時，才從 0 滾上去 */
export function ServerCount({
  value,
  suffix,
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;

    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        observer.disconnect();
        setShown(0);
        requestAnimationFrame(() => {
          setAnimated(true);
          setShown(value);
        });
      },
      { threshold: 0.6 },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      <NumberFlow
        value={shown}
        animated={animated}
        suffix={suffix}
        locales="en-US"
        spinTiming={{ duration: 1400, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }}
      />
    </span>
  );
}
