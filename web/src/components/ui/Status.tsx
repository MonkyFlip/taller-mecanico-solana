import { FC, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

// ---------------------------------------------------------------------------
// LoadingSpinner
// ---------------------------------------------------------------------------

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = 20,
  className,
  label,
}) => (
  <div className={clsx("flex flex-col items-center justify-center gap-3", className)}>
    <Loader2 size={size} className="animate-spin text-accent" />
    {label && <p className="text-sm text-text-muted">{label}</p>}
  </div>
);

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState: FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => (
  <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
    {icon && (
      <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-surface-3 text-text-muted">
        {icon}
      </div>
    )}
    <div>
      <p className="text-sm font-medium text-text-primary">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-text-muted">{description}</p>
      )}
    </div>
    {action && <div>{action}</div>}
  </div>
);

// ---------------------------------------------------------------------------
// ErrorState
// ---------------------------------------------------------------------------

interface ErrorStateProps {
  title?: string;
  message: string;
}

export const ErrorState: FC<ErrorStateProps> = ({
  title = "Error al cargar datos",
  message,
}) => (
  <div className="rounded-lg border border-danger/30 bg-danger/5 p-4">
    <p className="text-sm font-medium text-danger">{title}</p>
    <p className="mt-1 text-xs text-text-muted">{message}</p>
  </div>
);

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

type BadgeVariant = "default" | "success" | "warning" | "danger" | "accent";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-surface-4 text-text-secondary border-border",
  success: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  danger: "bg-danger/10 text-danger border-danger/30",
  accent: "bg-accent/10 text-accent border-accent/30",
};

export const Badge: FC<BadgeProps> = ({ variant = "default", children }) => (
  <span
    className={clsx(
      "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border",
      badgeVariants[variant]
    )}
  >
    {children}
  </span>
);
