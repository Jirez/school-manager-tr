import { useRef } from "react";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { ChevronDown } from "lucide-react";
import styled from "styled-components";

interface MyDropdownProps {
  children: React.ReactNode;
  label?: React.ReactNode;
  onClick: () => void;
  /** Optional color for the dropdown trigger */
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  trigger?: "label" | "icon";
  icon?: React.ReactNode;
}

const colorStyles = {
  primary: {
    text: "text-[#2f8724]",
    hover: "hover:text-[#266d1d]",
    lightBg: "hover:bg-[#2f8724]/10",
  },
  secondary: {
    text: "text-gray-600 dark:text-gray-400",
    hover: "hover:text-gray-900 dark:hover:text-white",
    lightBg: "hover:bg-gray-100 dark:hover:bg-gray-800",
  },
  success: {
    text: "text-[#28c76f]",
    hover: "hover:text-[#21a45c]",
    lightBg: "hover:bg-[#28c76f]/10",
  },
  warning: {
    text: "text-[#ff9f43]",
    hover: "hover:text-[#e68a30]",
    lightBg: "hover:bg-[#ff9f43]/10",
  },
  danger: {
    text: "text-[#ea5455]",
    hover: "hover:text-[#d93939]",
    lightBg: "hover:bg-[#ea5455]/10",
  },
};

export const StyledMenu = styled(DropdownMenu)`
  &.dropdown-menu {
    border: none !important;
    padding: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    margin-top: 8px !important;
    overflow: visible !important;
    min-width: 180px;
  }
`;

export const MenuInner = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 4px;
  min-width: 180px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  animation: dropdownFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  .dark-layout & {
    background-color: rgba(27, 30, 43, 0.9);
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3),
      0 10px 10px -5px rgba(0, 0, 0, 0.2);
  }

  @keyframes dropdownFadeIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MyDropdown: React.FC<MyDropdownProps> = ({
  children,
  label,
  onClick,
  color = "secondary",
  trigger = "label",
  icon,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const colorStyle = colorStyles[color];

  return (
    <UncontrolledDropdown group className="w-full0">
      {trigger === "label" ? (
        <div
          className={`
          inline-flex items-center gap-0.5
          text-sm font-medium
          ${colorStyle.text}
          transition-all duration-200
        `}
        >
          {/* Main label button */}
          <button
            type="button"
            onClick={onClick}
            className={`
            px-0.5 py-0.5
            rounded-md
            text-xs font-medium
            //${colorStyle.lightBg}
            transition-all duration-200
            focus:outline-none
            active:translate-y-[1px]
            !text-sm
          `}
          >
            {label}
          </button>

          {/* Dropdown toggle */}
          <DropdownToggle
            caret={false}
            color="link"
            className="!p-0 !border-none !shadow-none focus:!ring-0"
            tag="div"
          >
            <button
              ref={ref}
              type="button"
              className={`
              p-0.5
              rounded-md
              hover:bg-gray-100 dark:hover:bg-gray-800/50
              transition-all duration-200
              focus:outline-none
              flex items-center justify-center
            `}
            >
              <ChevronDown
                size={14}
                strokeWidth={2.5}
                className="opacity-70 group-hover:opacity-100 transition-transform duration-200"
              />
            </button>
          </DropdownToggle>
        </div>
      ) : (
        <DropdownToggle
          caret={false}
          color="link"
          className="!p-0 !border-none !shadow-none focus:!ring-0"
          tag="div"
        >
          <button
            ref={ref}
            type="button"
            className={`
            p-1.5
            rounded-lg
            text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
            hover:bg-gray-100 dark:hover:bg-gray-800
            transition-all duration-200
            focus:outline-none
            flex items-center justify-center
          `}
          >
            {icon}
          </button>
        </DropdownToggle>
      )}

      <StyledMenu container="body">
        <MenuInner>{children}</MenuInner>
      </StyledMenu>
    </UncontrolledDropdown>
  );
};

interface MyMenuItemProps {
  icon?: React.ReactNode;
  label: React.ReactNode;
  onClick?: () => void;
  /** Danger styling for destructive actions */
  danger?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Active state */
  active?: boolean;
}

export const MyMenuItem: React.FC<MyMenuItemProps> = ({
  icon,
  label,
  onClick,
  danger = false,
  disabled = false,
  active = false,
}) => {
  return (
    <DropdownItem
      onClick={onClick}
      tag="div"
      disabled={disabled}
      className={`
        !flex items-center gap-2.5
        !px-3 !py-2.5
        !text-[13px] !font-medium
        !rounded-lg
        !cursor-pointer
        !mb-0.5 last:!mb-0
        !transition-all !duration-150
        ${
          active
            ? "!bg-[#7367f0]/10 !text-[#7367f0]"
            : danger
            ? "!text-[#ea5455] hover:!bg-[#ea5455]/10"
            : "!text-gray-700 dark:!text-gray-300 hover:!bg-gray-100 dark:hover:!bg-gray-700/50"
        }
        ${disabled ? "!opacity-40 !cursor-not-allowed" : ""}
      `}
    >
      {icon && (
        <span
          className={`
            w-4 h-4 flex items-center justify-center flex-shrink-0
            ${
              active
                ? "text-[#7367f0]"
                : danger
                ? "text-[#ea5455]"
                : "text-gray-400"
            }
          `}
        >
          {icon}
        </span>
      )}
      <span className="flex-1">{label}</span>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-[#7367f0]" />}
    </DropdownItem>
  );
};

interface DeleteMenuItemProps {
  children: React.ReactNode;
}

export const DeleteMenuItem: React.FC<DeleteMenuItemProps> = ({ children }) => {
  return <>{children}</>;
};

export const MyDivider = () => (
  <div className="my-1.5 border-t border-gray-100 dark:border-gray-800/80 mx-1" />
);

// Header for grouping menu items
interface MyMenuHeaderProps {
  children: React.ReactNode;
}

export const MyMenuHeader: React.FC<MyMenuHeaderProps> = ({ children }) => (
  <div
    className="
      px-3 pt-2 pb-1
      text-[10px] font-bold uppercase tracking-widest
      text-gray-400 dark:text-gray-500
    "
  >
    {children}
  </div>
);

export default MyDropdown;
