"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export function DinoMascot({ className }: { className?: string }) {
  const [yells, setYells] = useState<number[]>([]);

  function yell() {
    const id = Date.now();

    setYells((prev) => [...prev.slice(-3), id]);
    setTimeout(() => {
      setYells((prev) => prev.filter((y) => y !== id));
    }, 900);
  }

  return (
    <div className={className}>
      <div className="relative">
        <AnimatePresence>
          {yells.map((id, i) => (
            <motion.span
              key={id}
              initial={{ opacity: 0, y: 8, scale: 0.6 }}
              animate={{ opacity: 1, y: -28, scale: 1, rotate: i % 2 ? 8 : -8 }}
              exit={{ opacity: 0, y: -48 }}
              transition={{ duration: 0.5 }}
              className="-top-4 absolute left-1/2 select-none rounded-full bg-primary px-3 py-1 font-bold text-primary-foreground text-sm shadow-md"
            >
              Yee!
            </motion.span>
          ))}
        </AnimatePresence>
        <motion.button
          type="button"
          aria-label="Yee!"
          onClick={yell}
          whileTap={{ scale: 0.92, rotate: -3 }}
          whileHover={{ y: -6 }}
          className="cursor-pointer"
        >
          <img
            alt="YEE 式機器龍"
            src="/img/logo.svg"
            className="h-40 drop-shadow-lg sm:h-52 lg:h-64"
            draggable={false}
          />
        </motion.button>
      </div>
    </div>
  );
}
