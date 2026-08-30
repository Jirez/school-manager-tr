import type { FC, ReactNode } from "react";
import { CheckSquare, X } from "react-feather";
import { useTranslation } from "react-i18next";

interface BulkActionBase {
  id: string;
  variant?: "primary" | "success" | "danger" | "warning" | "secondary";
}

interface BulkActionButton extends BulkActionBase {
  type?: "button";
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

interface BulkActionCustom extends BulkActionBase {
  type: "custom";
  render: ReactNode;
}

type BulkAction = BulkActionButton | BulkActionCustom;

interface BulkActionsBarProps {
  selectedCount: number;
  actions: BulkAction[];
  onClearSelection?: () => void;
  itemLabel?: string;
  itemLabelPlural?: string;
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-primary/10 text-primary hover:bg-primary hover:text-white border-primary/20",
  success:
    "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white border-emerald-500/20 dark:text-emerald-400",
  danger:
    "bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white border-red-500/20 dark:text-red-400",
  warning:
    "bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white border-amber-500/20 dark:text-amber-400",
  secondary:
    "bg-gray-500/10 text-gray-600 hover:bg-gray-500 hover:text-white border-gray-500/20 dark:text-gray-300",
};

const BulkActionsBar: FC<BulkActionsBarProps> = ({
  selectedCount,
  actions,
  onClearSelection,
  itemLabel = "élément",
  itemLabelPlural = "éléments",
}) => {
  const { t } = useTranslation();
  if (selectedCount === 0) return null;

  const label = selectedCount === 1 ? itemLabel : itemLabelPlural;

  const renderAction = (action: BulkAction) => {
    if (action.type === "custom") {
      return (
        <div key={action.id} className="inline-flex">
          {action.render}
        </div>
      );
    }

    return (
      <button
        type="button"
        key={action.id}
        onClick={action.onClick}
        disabled={action.loading || action.disabled}
        className={`
          inline-flex items-center gap-2
          px-3 py-1.5
          text-sm font-medium
          rounded-lg
          border
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[action.variant || "primary"]}
        `}
      >
        {action.loading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          action.icon
        )}
        {action.label}
      </button>
    );
  };

  return (
    <div
      className="
        flex flex-wrap items-center gap-3
        mb-1 px-2 py-1
        bg-gradient-to-r from-primary/5 to-purple-500/5
        dark:from-primary/10 dark:to-purple-500/10
        border border-primary/20 dark:border-primary/30
        rounded-xl
        shadow-sm
        animate-in slide-in-from-top-2 duration-200
      "
    >
      {/* Selection Info */}
      <div className="flex items-center gap-2">
        <div
          className="
            flex items-center justify-center
            w-8 h-8
            rounded-lg
            bg-primary/10
            text-primary
          "
        >
          <CheckSquare size={16} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {selectedCount} {label}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            sélectionné{selectedCount > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {actions.map(renderAction)}
      </div>

      {/* Clear Selection */}
      {onClearSelection && (
        <>
          <div className="flex-1" />
          <button
            type="button"
            onClick={onClearSelection}
            className="
              inline-flex items-center gap-1.5
              px-2 py-1
              text-xs font-medium
              text-gray-500 dark:text-gray-400
              hover:text-gray-700 dark:hover:text-gray-200
              hover:bg-gray-100 dark:hover:bg-gray-800
              rounded-md
              transition-colors duration-200
            "
          >
            <X size={14} />
            {t("label-cancelSelection")}
          </button>
        </>
      )}
    </div>
  );
};

export default BulkActionsBar;
