import React from "react";
import { DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { ChevronDown, Plus } from "lucide-react";
import styled from "styled-components";
import { MyMenuItem, StyledMenu, MenuInner } from "../../dropdown";

interface SplitButtonAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
}

interface SplitButtonProps {
  primaryAction: SplitButtonAction;
  dropdownActions?: SplitButtonAction[];
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  className?: string;
  showPlusIcon?: boolean;
}

const ButtonGroup = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: stretch;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 6px 0 ${(props) => props.$color}4D; // 30% opacity
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px 0 ${(props) => props.$color}66; // 40% opacity
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PrimaryButton = styled.button<{ $color: string }>`
  background-color: ${(props) => props.$color};
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: color-mix(in srgb, ${(props) => props.$color}, black 10%);
  }

  .shortcut {
    font-size: 0.75rem;
    opacity: 0.7;
    font-weight: 400;
    margin-left: auto;
  }
`;

const Divider = styled.div<{ $color: string }>`
  width: 1px;
  background-color: ${(props) => props.$color};
`;

const ToggleButton = styled(DropdownToggle)<{ $color: string }>`
  && {
    background-color: ${(props) => props.$color};
    color: white;
    border: none;
    padding: 8px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0;
    margin: 0;

    &:hover {
      background-color: color-mix(
        in srgb,
        ${(props) => props.$color},
        black 10%
      );
    }

    &:focus,
    &:active {
      background-color: color-mix(
        in srgb,
        ${(props) => props.$color},
        black 10%
      ) !important;
      box-shadow: none !important;
    }

    &::after {
      display: none;
    }
  }
`;

const colorMap = {
  primary: "#7367f0",
  secondary: "#805dca",
  success: "#00ab55",
  danger: "#e7515a",
  warning: "#e2a03f",
};

export const SplitButton: React.FC<SplitButtonProps> = ({
  primaryAction,
  dropdownActions = [],
  color = "primary",
  className,
  showPlusIcon = true,
}) => {
  const hexColor = colorMap[color];

  return (
    <UncontrolledDropdown group className={className}>
      <ButtonGroup $color={hexColor}>
        <PrimaryButton
          type="button"
          $color={hexColor}
          onClick={primaryAction.onClick}
          disabled={primaryAction.disabled}
        >
          {showPlusIcon &&
            (primaryAction.icon || <Plus size={16} strokeWidth={2.5} />)}
          <span>{primaryAction.label}</span>
          {primaryAction.shortcut && (
            <span className="shortcut d-none d-lg-inline">
              {primaryAction.shortcut}
            </span>
          )}
        </PrimaryButton>

        {dropdownActions.length > 0 && (
          <>
            <Divider $color={hexColor} />
            <ToggleButton tag="button" $color={hexColor}>
              <ChevronDown size={16} strokeWidth={2.5} />
            </ToggleButton>
          </>
        )}
      </ButtonGroup>

      {dropdownActions.length > 0 && (
        <StyledMenu container="body">
          <MenuInner>
            {dropdownActions.map((action, index) => (
              <MyMenuItem
                key={index}
                label={
                  <div className="flex items-center justify-between w-full">
                    <span>{action.label}</span>
                    {action.shortcut && (
                      <span className="text-[10px] opacity-50 ml-4 font-mono">
                        {action.shortcut}
                      </span>
                    )}
                  </div>
                }
                icon={action.icon}
                onClick={action.onClick}
                danger={action.danger}
                disabled={action.disabled}
              />
            ))}
          </MenuInner>
        </StyledMenu>
      )}
    </UncontrolledDropdown>
  );
};

export default SplitButton;
