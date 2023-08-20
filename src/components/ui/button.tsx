import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "px-4 py-2 rounded-lg font-medium text-sm flex flex-row gap-2 items-center justify-center",
  {
    variants: {
      color: {
        primary:
          "bg-primary text-primary-foreground transition-colors hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80",
      },
    },
  },
);
