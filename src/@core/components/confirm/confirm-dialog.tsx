import type {  FC } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Trash2,
  XCircle,
  Check,
} from "react-feather";
import { useTranslation } from "react-i18next";
import { Modal, ModalBody, Button } from "reactstrap";
import useConfirm from "./useConfirm";

export type ConfirmDialogType = "warning" | "danger" | "info" | "success";

interface DialogConfig {
  icon: FC<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  confirmButtonColor: string;
  confirmButtonClass: string;
}

const dialogConfigs: Record<ConfirmDialogType, DialogConfig> = {
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    confirmButtonColor: "warning",
    confirmButtonClass:
      "bg-amber-500 hover:bg-amber-600 text-white border-amber-500",
  },
  danger: {
    icon: Trash2,
    iconBg: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400",
    confirmButtonColor: "danger",
    confirmButtonClass: "bg-red-500 hover:bg-red-600 text-white border-red-500",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    confirmButtonColor: "info",
    confirmButtonClass:
      "bg-blue-500 hover:bg-blue-600 text-white border-blue-500",
  },
  success: {
    icon: CheckCircle,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    confirmButtonColor: "success",
    confirmButtonClass:
      "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500",
  },
};

const ConfirmDialog = () => {
  const {
    onConfirm,
    onClosed,
    isOpen,
    text,
    title,
    type = "warning",
  } = useConfirm();
  const { t } = useTranslation();

  const config =
    dialogConfigs[type as ConfirmDialogType] || dialogConfigs.warning;
  const IconComponent = config.icon;

  return (
    <Modal
      isOpen={isOpen}
      className="modal-dialog-centered"
      contentClassName="border-0 shadow-xl rounded-lg"
      unmountOnClose
      zIndex={1100}
      size="sm"
    >
      <ModalBody className="p-0 relative">
        {/* Close button */}
        <button
          type="button"
          onClick={onClosed}
          className="
            absolute top-2 right-2 z-10
            p-1 rounded-full
            text-gray-400 hover:text-gray-600
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition-colors duration-200
          "
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center px-4 py-2">
          {/* Icon */}
          <div
            className={`
              flex items-center justify-center
              w-10 h-10 rounded-full
              ${config.iconBg}
              mb-2
            `}
          >
            <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
            {title || "Confirmation"}
          </h3>

          {/* Message */}
          <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed max-w-xs mb-1">
            {text || "Êtes-vous sûr de vouloir continuer ?"}
          </p>
        </div>

        {/* Actions */}
        <div
          className="
            flex items-center justify-end gap-2
            px-4 py-2.5
            bg-gray-50 dark:bg-gray-800/50
            border-t border-gray-100 dark:border-gray-700
            rounded-b-lg
          "
        >
          <Button
            type="button"
            onClick={onClosed}
            outline
            color="primary"
            className="
              flex items-center gap-1.5
              min-w-[80px]
              text-sm
              font-medium
              py-1.5
              transition-all duration-200
            "
          >
            <XCircle size={14} />
            {t("label.no")}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            color={config.confirmButtonColor}
            className={`
              flex items-center gap-1.5
              min-w-[80px]
              text-sm
              font-medium
              py-1.5
              transition-all duration-200
              ${config.confirmButtonClass}
            `}
          >
            <Check size={14} />
            {t("label.yes")}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ConfirmDialog;

/**
 * Alternative: Standalone Confirm Dialog Component
 * Can be used independently without the useConfirm hook
 */
interface StandaloneConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  type?: ConfirmDialogType;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export const StandaloneConfirmDialog: FC<StandaloneConfirmDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Confirmation",
  message = "Êtes-vous sûr de vouloir continuer ?",
  type = "warning",
  confirmText = "Confirmer",
  cancelText = "Annuler",
  loading = false,
}) => {
  const config = dialogConfigs[type];
  const IconComponent = config.icon;

  return (
    <Modal
      isOpen={isOpen}
      className="modal-dialog-centered"
      contentClassName="border-0 shadow-xl overflow-hidden rounded-lg"
      unmountOnClose
      zIndex={1100}
      size="sm"
    >
      <ModalBody className="p-0 relative">
        {/* Close button */}
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="
            absolute top-2 right-2 z-10
            p-1 rounded-full
            text-gray-400 hover:text-gray-600
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center px-4 py-2">
          {/* Icon with pulse animation for danger type */}
          <div
            className={`
              flex items-center justify-center
              w-10 h-10 rounded-full
              ${config.iconBg}
              mb-2
              ${type === "danger" ? "animate-pulse" : ""}
            `}
          >
            <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed max-w-xs mb-1">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div
          className="
            flex items-center justify-end gap-2
            px-4 py-2.5
            bg-gray-50 dark:bg-gray-800/50
            border-t border-gray-100 dark:border-gray-700
          "
        >
          <Button
            type="button"
            onClick={onCancel}
            disabled={loading}
            outline
            color="secondary"
            className="
              flex items-center gap-1.5
              min-w-[80px]
              text-sm
              font-medium
              py-1.5
              transition-all duration-200
            "
          >
            <XCircle size={14} />
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            color={config.confirmButtonColor}
            className={`
              flex items-center gap-1.5
              min-w-[80px]
              text-sm
              font-medium
              py-1.5
              transition-all duration-200
              ${config.confirmButtonClass}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-1.5">
                <svg
                  className="animate-spin h-3.5 w-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
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
                <span className="text-xs">En cours...</span>
              </span>
            ) : (
              <>
                <Check size={14} />
                {confirmText}
              </>
            )}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};
