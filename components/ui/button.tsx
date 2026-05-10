import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-teal-600 text-white hover:bg-teal-700 focus-visible:outline-teal-600 dark:bg-teal-500 dark:hover:bg-teal-400"
      : "bg-transparent text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800";

  return (
    <button type="button" className={`${base} ${styles} ${className}`} {...props} />
  );
}
