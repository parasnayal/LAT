"use client";

import { cloneElement, isValidElement, type ButtonHTMLAttributes, type ReactElement } from "react";
import { cn } from "@/shared/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: ButtonVariant;
};

const variantClassName: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-teal-700",
  secondary: "border border-border bg-white text-foreground hover:bg-slate-50",
  ghost: "text-foreground hover:bg-slate-100"
};

export function Button({
  asChild = false,
  className,
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
    variantClassName[variant],
    className
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, {
      className: cn(classes, child.props.className)
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
