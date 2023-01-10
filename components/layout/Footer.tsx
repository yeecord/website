import Image from "next/image";
import Link from "next/link";
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
        <div className="max-w-[90rem] mx-auto p-6 mt-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex flex-row gap-2 h-fit">
                    <Image
                        alt="logo"
                        src="/logo_128x128.png"
                        width={30}
                        height={30}
                        className="rounded-full"
                    />
                    <h1 className="heading-md">Yeecord</h1>
                </div>
                {categories.map((category, i) => (
                    <div key={i} className="flex flex-col gap-2">
                        <h3 className="heading-md">{category.title}</h3>
                        {category.items.map((item, j) => (
                            <Link
                                key={j}
                                href={item.href}
                                className="text-secondary"
                                target={
                                    item.newWindow === true ? "_blank" : "_self"
                                }
                            >
                                {item.label}{" "}
                                {item.newWindow && (
                                    <IoMdOpen className="inline" />
                                )}
                            </Link>
                        ))}
                    </div>
                ))}
            </div>
            <p className="text-secondary mt-14">
                YEE式機器龍 © 2019 ~ {new Date(Date.now()).getFullYear()}
            </p>
        </div>
    );
}
