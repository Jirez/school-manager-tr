import React, { forwardRef, useEffect, useState } from "react";

// Simple utility for class names, similar to clsx/classnames
const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(" ");

export interface StyledCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean;
  activeColorClass?: string;
}

export const StyledCheckbox = forwardRef<HTMLInputElement, StyledCheckboxProps>(
  (
    {
      indeterminate,
      className = "",
      activeColorClass = "bg-primary border-primary hover:bg-primary/90",
      checked,
      onChange,
      defaultChecked,
      ...rest
    },
    forwardedRef,
  ) => {
    const internalRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef = (forwardedRef ||
      internalRef) as React.MutableRefObject<HTMLInputElement | null>;

    // Track checked state internally for uncontrolled usage or visual updates
    const [isChecked, setIsChecked] = useState<boolean>(
      Boolean(checked ?? defaultChecked ?? false),
    );

    // Sync with controlled checked prop
    useEffect(() => {
      if (typeof checked === "boolean") {
        setIsChecked(checked);
      }
    }, [checked]);

    // Handle indeterminate state
    useEffect(() => {
      if (resolvedRef.current && typeof indeterminate === "boolean") {
        resolvedRef.current.indeterminate = !isChecked && indeterminate;
      }
    }, [resolvedRef, indeterminate, isChecked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsChecked(e.target.checked);
      onChange?.(e);
    };

    const showIndeterminate = indeterminate && !isChecked;

    return (
      <label
        className={cn(
          "relative inline-flex items-center justify-center w-5 h-5 cursor-pointer",
          rest.disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <input
          type="checkbox"
          ref={resolvedRef}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={handleChange}
          className="absolute z-20 h-full w-full cursor-pointer opacity-0"
          {...rest}
        />
        <span
          className={cn(
            "absolute inset-0 rounded-md border-2 transition-all duration-200 ease-in-out",
            isChecked || showIndeterminate
              ? activeColorClass
              : "bg-white border-gray-300 hover:border-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:hover:border-gray-500",
          )}
        />
        {/* Checkmark Icon */}
        <svg
          className={cn(
            "relative z-10 w-3.5 h-3.5 text-white transition-all duration-200",
            isChecked && !showIndeterminate
              ? "opacity-100 scale-100"
              : "opacity-0 scale-75",
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        {/* Indeterminate Icon */}
        <svg
          className={cn(
            "absolute z-10 w-3.5 h-3.5 text-white transition-all duration-200",
            showIndeterminate ? "opacity-100 scale-100" : "opacity-0 scale-75",
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
      </label>
    );
  },
);
StyledCheckbox.displayName = "StyledCheckbox";
