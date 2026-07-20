"use client";

const locales = ["zh-tw", "zh-cn"];
const defaultLocale = "zh-tw";

// 內建切換器不懂 hideLocale，切到預設語系仍會加 /zh-tw 前綴、又只做 client push
// 導致找不到路由。這裡自己算出正確網址（預設語系無前綴）並整頁導向。
export function switchLocale(locale: string) {
  const { pathname, search, hash } = window.location;
  const rest =
    pathname.replace(new RegExp(`^/(${locales.join("|")})(?=/|$)`), "") || "/";
  const target =
    locale === defaultLocale ? rest : `/${locale}${rest === "/" ? "" : rest}`;

  window.location.assign((target || "/") + search + hash);
}
