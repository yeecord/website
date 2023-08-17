"use client";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BsCaretUpFill } from "react-icons/bs";
import { IoMdOpen } from "react-icons/io";
import { ThemeToggle } from "next-docs-ui/components";

export type FooterCategory = {
  title: string;
  items: FooterItem[];
};

type FooterItem = {
  label: string;
  href: string;
  newWindow?: boolean;
};

export default function Footer({
  categories,
}: {
  categories: FooterCategory[];
}) {
  return (
    <div className="container mt-6 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <Info />
        {categories.map((category, i) => (
          <Category key={i} category={category} />
        ))}
      </div>
      <div className="mt-10 flex flex-row flex-wrap justify-between gap-3">
        <ThemeToggle />
        <p className="text-muted-foreground">
          YEE式機器龍 © 2019 ~ {new Date(Date.now()).getFullYear()}
        </p>
      </div>
    </div>
  );
}

function Info() {
  return (
    <div className={clsx("hidden flex-col gap-2", "sm:flex")}>
      <div className="flex flex-row items-center gap-2">
        <Image
          alt="logo"
          src="/img/logo_128x128.png"
          width={40}
          height={40}
          className="rounded-full"
        />
        <h1 className="text-xl font-bold">Yeecord</h1>
      </div>
    </div>
  );
}

function Category({ category }: { category: FooterCategory }) {
  const [extend, setExpend] = useState(false);

  return (
    <div className="flex flex-col">
      <p
        className="mb-2 font-medium sm:text-xl"
        onClick={() => setExpend((prev) => !prev)}
      >
        {category.title}{" "}
        <BsCaretUpFill
          className={clsx(
            "inline transition-transform sm:hidden",
            extend ? "rotate-0" : "rotate-180",
          )}
        />
      </p>
      <div
        className={clsx("flex-col gap-1", extend ? "flex" : "hidden sm:flex")}
      >
        {category.items.map((item, j) => (
          <Link
            key={j}
            href={item.href}
            className="text-sm text-muted-foreground transition-colors hover:text-accent"
            target={item.newWindow === true ? "_blank" : "_self"}
          >
            {item.label} {item.newWindow && <IoMdOpen className="inline" />}
          </Link>
        ))}
      </div>
    </div>
  );
}
