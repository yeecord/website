import Image from "next/image";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";

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
    <div className="container mt-auto border-t p-8 pb-20">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
        <Info />
        {categories.map((category, i) => (
          <Category key={i} category={category} />
        ))}
      </div>
    </div>
  );
}

function Info() {
  return (
    <div className="hidden flex-col gap-2 sm:flex">
      <div className="flex flex-row items-center gap-2">
        <Image
          alt="logo"
          src="/img/logo_128x128.png"
          width={40}
          height={40}
          className="rounded-full"
        />
        <p className="text-xl font-bold">Yeecord</p>
      </div>
      <p className="mt-auto text-xs text-muted-foreground">
        YEE式機器龍 © 2019 ~ {new Date(Date.now()).getFullYear()}
      </p>
    </div>
  );
}

function Category({ category }: { category: FooterCategory }) {
  return (
    <div className="flex flex-col">
      <p className="mb-2 font-medium max-sm:cursor-pointer">{category.title}</p>
      <div className="flex flex-col gap-1 text-sm">
        {category.items.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="text-muted-foreground transition-colors hover:text-accent-foreground"
            target={item.newWindow === true ? "_blank" : "_self"}
          >
            {item.label}
            {item.newWindow && (
              <ExternalLinkIcon className="ml-1.5 inline h-3 w-3" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
