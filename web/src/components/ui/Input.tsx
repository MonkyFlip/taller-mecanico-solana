import { FC, InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-text-secondary uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={clsx(
            "w-full px-3 py-2 text-sm rounded",
            "bg-surface-2 border border-border text-text-primary",
            "placeholder:text-text-muted",
            "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30",
            "transition-colors duration-150",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            error && "border-danger focus:border-danger focus:ring-danger/30",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

// ---------------------------------------------------------------------------
// Textarea
// ---------------------------------------------------------------------------

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-text-secondary uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          rows={3}
          className={clsx(
            "w-full px-3 py-2 text-sm rounded resize-none",
            "bg-surface-2 border border-border text-text-primary",
            "placeholder:text-text-muted",
            "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30",
            "transition-colors duration-150",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            error && "border-danger focus:border-danger focus:ring-danger/30",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
