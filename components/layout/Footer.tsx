import Link from "next/link";
import { ReactNode } from "react";
import { IoMdOpen } from "react-icons/io";

export type FooterCategory = {
    title: string;
    items: FooterItem[];
};

export type FooterItem = {
    label: string;
    href: string;
    newWindow?: boolean;
};

export function Footer({ categories }: { categories: FooterCategory[] }) {
    return (
        <div className="flex flex-row justify-between gap-4 max-w-[90rem] mx-auto p-6">
            {categories.map((category, i) => (
                <div key={i} className="flex flex-col gap-2">
                    <h3 className="heading-md">{category.title}</h3>
                    {category.items.map((item, j) => (
                        <Link
                            key={j}
                            href={item.href}
                            className="text-secondary"
                        >
                            {item.label}{" "}
                            {item.newWindow && <IoMdOpen className="inline" />}
                        </Link>
                    ))}
                </div>
            ))}
        </div>
    );
}
