"use client";

import { motion } from "motion/react";
import { useState } from "react";
import type { Locale } from "~/i18n";
import { Pixelated } from "./Pixelated";
import { Stall } from "./Stall";

export type Customer = { img: string; name: string };

/** 攤位和排隊的客人。客人是使用中的伺服器，賣出一份就換下一位 */
export function Booth({
  locale,
  customers,
  proof,
}: {
  locale: Locale;
  customers: Customer[];
  proof: React.ReactNode;
}) {
  const [queue, setQueue] = useState(customers);

  return (
    <div>
      <Stall
        locale={locale}
        onSold={() =>
          setQueue(([first, ...rest]) => (first ? [...rest, first] : rest))
        }
      />
      <div className="home-queue">
        <ul>
          {queue.map((customer) => (
            <motion.li
              key={customer.name}
              layout
              title={customer.name}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <Pixelated
                src={customer.img}
                columns={10}
                rows={10}
                label={customer.name}
              />
            </motion.li>
          ))}
        </ul>
        <p>{proof}</p>
      </div>
    </div>
  );
}
