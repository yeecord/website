"use client";

import { useEffect, useRef } from "react";

/** 把一張圖縮到很小的畫布上再放大，邊緣只留全透明和不透明，看起來就是像素圖 */
export function Pixelated({
  src,
  columns,
  rows,
  label,
}: {
  src: string;
  columns: number;
  rows: number;
  label?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const context = ref.current?.getContext("2d");

    if (!context) {
      return;
    }

    const image = new Image();

    image.crossOrigin = "anonymous";
    image.onload = () => {
      context.clearRect(0, 0, columns, rows);
      context.drawImage(image, 0, 0, columns, rows);

      const frame = context.getImageData(0, 0, columns, rows);

      for (let index = 3; index < frame.data.length; index += 4) {
        frame.data[index] = (frame.data[index] ?? 0) > 110 ? 255 : 0;
      }

      context.putImageData(frame, 0, 0);
    };
    image.src = src;
  }, [src, columns, rows]);

  return (
    <canvas
      ref={ref}
      className="px-bitmap"
      width={columns}
      height={rows}
      style={{ width: `calc(${columns} * var(--u))` }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
