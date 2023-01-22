import { useTheme } from "nextra-theme-docs";
import { useState, useEffect } from "react";
import { BsMoonFill, BsFillSunFill } from "react-icons/bs";

export function ThemeToggle() {
    const [current, setCurrent] = useState<"light" | "dark" | undefined>(
        undefined
    );
    const { setTheme, resolvedTheme } = useTheme();

    useEffect(() => {
        if (resolvedTheme != undefined)
            setCurrent(resolvedTheme as "light" | "dark");
    }, [resolvedTheme]);

    return (
        <button
            aria-label="toggle dark mode"
            className="text-xl"
            onClick={() => setTheme(current === "dark" ? "light" : "dark")}
        >
            {current === "dark" ? <BsMoonFill /> : <BsFillSunFill />}
        </button>
    );
}
