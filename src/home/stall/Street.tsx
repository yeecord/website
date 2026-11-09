"use client";

import Link from "fumadocs-core/link";
import { motion } from "motion/react";
import { useState } from "react";
import type { Locale } from "~/i18n";
import { Stall } from "./Stall";

const BODIES = ["#ab4329", "#2e5e55", "#cc9a33", "#5e8c4e", "#6e4d2e"];

export type Customer = { img: string; name: string };

type SignLink = { href: string; label: string };

/** 攤位兩側的街景：左邊是當成按鈕的立牌，右邊是排隊的伺服器 */
export function Street({
  locale,
  install,
  docs,
  customers,
  proof,
}: {
  locale: Locale;
  install: SignLink;
  docs: SignLink;
  customers: Customer[];
  proof: React.ReactNode;
}) {
  const [queue, setQueue] = useState(customers);
  const [sale, setSale] = useState<{ id: number; price: number } | null>(null);

  function serve(price: number) {
    setSale({ id: Date.now(), price });
    setQueue(([first, ...rest]) => (first ? [...rest, first] : rest));
  }

  return (
    <div className="street">
      <nav className="street-signs">
        <Link href={install.href} className="street-sign" data-kind="primary">
          {install.label}
        </Link>
        <Link href={docs.href} className="street-sign">
          {docs.label}
        </Link>
      </nav>
      <Stall locale={locale} onSold={serve} />
      <div className="street-queue">
        <ul>
          {queue.map((customer) => (
            <motion.li
              key={customer.name}
              layout
              transition={{ type: "spring", duration: 0.7, bounce: 0.35 }}
              style={{
                color: BODIES[customers.indexOf(customer) % BODIES.length],
              }}
            >
              <img
                src={customer.img}
                alt={customer.name}
                title={customer.name}
                width="44"
                height="44"
                draggable={false}
              />
            </motion.li>
          ))}
        </ul>
        {sale ? (
          <span key={sale.id} className="street-coin" aria-hidden>
            +{sale.price}
          </span>
        ) : null}
        <p>{proof}</p>
      </div>
    </div>
  );
}
