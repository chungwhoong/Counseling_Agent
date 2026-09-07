import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "bg-accent text-white hover:bg-accent-600 active:scale-95": variant === "primary",
          "border-2 border-primary text-primary hover:bg-primary hover:text-white": variant === "outline",
          "text-slate-600 hover:bg-slate-100": variant === "ghost",
        },
        {
          "text-sm px-4 py-2": size === "sm",
          "text-base px-5 py-3": size === "md",
          "text-lg px-7 py-4": size === "lg",
        },
        className,
      )}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
