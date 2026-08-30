import { Check } from "lucide-react";
import styled from "styled-components";

export const FormContainer = styled.div`
  width: 100%;
`;

export const Section = styled.div`
  margin-bottom: 0.5rem;

  &:last-of-type {
    margin-bottom: 0.5rem;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(115, 103, 240, 0.15);

  .dark-layout & {
    border-bottom-color: rgba(115, 103, 240, 0.25);
  }
`;

export const SectionIcon = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ $color }) => $color || "rgba(115, 103, 240, 0.1)"};

  svg {
    color: ${({ $color }) => ($color ? "#ffffff" : "#7367f0")};
  }

  ${({ $color }) =>
    $color &&
    `
    background: linear-gradient(135deg, ${$color} 0%, ${$color}cc 100%);
    box-shadow: 0 2px 8px ${$color}40;
  `}
`;

export const SectionTitle = styled.h4`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 0.03em;

  .dark-layout & {
    color: #e4e6eb;
  }
`;

export const FieldGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns || 2}, 1fr);
  gap: 0.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldGroup = styled.div<{ $span?: number }>`
  grid-column: span ${({ $span }) => $span || 1};

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

export const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(115, 103, 240, 0.05);
  border: 1px solid rgba(115, 103, 240, 0.15);
  border-radius: 8px;
  margin-bottom: 1rem;

  .dark-layout & {
    background: rgba(115, 103, 240, 0.1);
    border-color: rgba(115, 103, 240, 0.25);
  }
`;

export const InputIcon = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 0.5rem;
  color: #7367f0;
`;

export const FieldLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.375rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #6c757d;

  svg {
    color: #7367f0;
  }

  .dark-layout & {
    color: #9ca3af;
  }
`;

export const RadioCardGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const RadioCard = styled.label<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.25rem 1.5rem;
  min-width: 120px;
  flex: 1;
  background: ${({ $selected }) =>
    $selected
      ? "linear-gradient(135deg, rgba(115, 103, 240, 0.15) 0%, rgba(115, 103, 240, 0.08) 100%)"
      : "#ffffff"};
  border: 2px solid
    ${({ $selected }) => ($selected ? "#7367f0" : "rgba(115, 103, 240, 0.2)")};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #7367f0;
    background: ${({ $selected }) =>
      $selected
        ? "linear-gradient(135deg, rgba(115, 103, 240, 0.15) 0%, rgba(115, 103, 240, 0.08) 100%)"
        : "rgba(115, 103, 240, 0.05)"};
  }

  .dark-layout & {
    background: ${({ $selected }) =>
      $selected ? "rgba(115, 103, 240, 0.2)" : "#283046"};
    border-color: ${({ $selected }) =>
      $selected ? "#7367f0" : "rgba(115, 103, 240, 0.3)"};

    &:hover {
      background: ${({ $selected }) =>
        $selected ? "rgba(115, 103, 240, 0.2)" : "rgba(115, 103, 240, 0.1)"};
    }
  }

  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

export const RadioCardIcon = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  margin-bottom: 0.75rem;
  background: ${({ $selected }) =>
    $selected
      ? "linear-gradient(135deg, #7367f0 0%, #9e95f5 100%)"
      : "rgba(115, 103, 240, 0.1)"};
  transition: all 0.2s ease;

  svg {
    color: ${({ $selected }) => ($selected ? "#ffffff" : "#7367f0")};
  }

  .dark-layout & {
    background: ${({ $selected }) =>
      $selected
        ? "linear-gradient(135deg, #7367f0 0%, #9e95f5 100%)"
        : "rgba(115, 103, 240, 0.2)"};
  }
`;

export const RadioCardTitle = styled.span<{ $selected: boolean }>`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ $selected }) => ($selected ? "#7367f0" : "#2c3e50")};
  text-align: center;
  transition: color 0.2s ease;

  .dark-layout & {
    color: ${({ $selected }) => ($selected ? "#7367f0" : "#e4e6eb")};
  }
`;

export const RadioCardDescription = styled.span`
  font-size: 0.75rem;
  color: #6c757d;
  text-align: center;
  margin-top: 0.25rem;

  .dark-layout & {
    color: #9ca3af;
  }
`;

export const OptionLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  color: #6c757d;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;

  .dark-layout & {
    color: #9ca3af;
  }
`;

export const SwitchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const SwitchCard = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  background: rgba(115, 103, 240, 0.03);
  border: 1px solid rgba(115, 103, 240, 0.12);
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(115, 103, 240, 0.06);
    border-color: rgba(115, 103, 240, 0.2);
  }

  .dark-layout & {
    background: rgba(115, 103, 240, 0.08);
    border-color: rgba(115, 103, 240, 0.2);

    &:hover {
      background: rgba(115, 103, 240, 0.12);
    }
  }
`;

export const StyledCheckboxWrapper = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 100%;
  height: 100%;
  min-height: 24px;
`;

export const StyledCheckbox = styled.div<{ $checked: boolean }>`
  position: relative;
  width: 18px;
  height: 18px;
  border: 2px solid ${({ $checked }) => ($checked ? "#7367f0" : "#d1d5db")};
  border-radius: 4px;
  background: ${({ $checked }) => ($checked ? "#7367f0" : "transparent")};
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #7367f0;
    transform: scale(1.1);
  }

  .dark-layout & {
    border-color: ${({ $checked }) => ($checked ? "#7367f0" : "#4b5563")};
    background: ${({ $checked }) => ($checked ? "#7367f0" : "transparent")};

    &:hover {
      border-color: #9e95f5;
    }
  }
`;

export const CheckIcon = styled(Check)<{ $checked: boolean }>`
  width: 12px;
  height: 12px;
  color: white;
  opacity: ${({ $checked }) => ($checked ? 1 : 0)};
  transform: ${({ $checked }) => ($checked ? "scale(1)" : "scale(0.5)")};
  transition: all 0.2s ease-in-out;
  stroke-width: 3;
`;

export const FormCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(115, 103, 240, 0.15);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(115, 103, 240, 0.08);
  padding: 1.5rem;
  margin-bottom: 1rem;

  .dark-layout & {
    background: #283046;
    border-color: rgba(115, 103, 240, 0.25);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

export const FormSection = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FormSectionCard = styled.div`
  background: linear-gradient(180deg, rgba(115, 103, 240, 0.03) 0%, rgba(115, 103, 240, 0.08) 100%);
  border: 1px solid rgba(115, 103, 240, 0.12);
  border-radius: 10px;
  padding: 1.25rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(115, 103, 240, 0.25);
    box-shadow: 0 4px 12px rgba(115, 103, 240, 0.12);
  }

  .dark-layout & {
    background: linear-gradient(180deg, rgba(115, 103, 240, 0.1) 0%, rgba(115, 103, 240, 0.15) 100%);
    border-color: rgba(115, 103, 240, 0.2);
  }
`;

export const TimeInputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.75rem;
  align-items: end;
`;

export const TimeSeparator = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 0.625rem;
  color: #7367f0;
  font-weight: 500;
  font-size: 1.1rem;
`;

export const EnhancedFieldGroup = styled.div`
  position: relative;
`;

export const FieldInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 12px;
    color: #7367f0;
    width: 18px;
    height: 18px;
    pointer-events: none;
  }

  input {
    padding-left: 2.5rem;
  }
`;

export const SwitchCardEnhanced = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: ${({ $selected }) =>
    $selected
      ? "linear-gradient(135deg, rgba(115, 103, 240, 0.12) 0%, rgba(115, 103, 240, 0.06) 100%)"
      : "rgba(115, 103, 240, 0.03)"};
  border: 2px solid
    ${({ $selected }) => ($selected ? "#7367f0" : "rgba(115, 103, 240, 0.15)")};
  border-radius: 10px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, rgba(115, 103, 240, 0.12) 0%, rgba(115, 103, 240, 0.08) 100%);
    border-color: ${({ $selected }) => ($selected ? "#7367f0" : "rgba(115, 103, 240, 0.3)")};
    transform: translateY(-1px);
  }

  .dark-layout & {
    background: ${({ $selected }) =>
      $selected
        ? "linear-gradient(135deg, rgba(115, 103, 240, 0.2) 0%, rgba(115, 103, 240, 0.12) 100%)"
        : "rgba(115, 103, 240, 0.1)"};
    border-color: ${({ $selected }) => ($selected ? "#7367f0" : "rgba(115, 103, 240, 0.25)")};

    &:hover {
      background: linear-gradient(135deg, rgba(115, 103, 240, 0.2) 0%, rgba(115, 103, 240, 0.15) 100%);
    }
  }
`;

export const SwitchLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const SwitchTitle = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;

  .dark-layout & {
    color: #e4e6eb;
  }
`;

export const SwitchDescription = styled.span`
  font-size: 0.75rem;
  color: #6c757d;

  .dark-layout & {
    color: #9ca3af;
  }
`;

export const FormDivider = styled.hr`
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(115, 103, 240, 0.2) 50%, transparent 100%);
  margin: 1.5rem 0;
`;

export const SectionBadge = styled.span<{ $variant?: "primary" | "secondary" | "success" }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-left: 0.5rem;

  ${({ $variant }) => {
    switch ($variant) {
      case "success":
        return `
          background: rgba(40, 199, 111, 0.15);
          color: #28c76f;
        `;
      case "secondary":
        return `
          background: rgba(115, 103, 240, 0.15);
          color: #7367f0;
        `;
      default:
        return `
          background: rgba(115, 103, 240, 0.15);
          color: #7367f0;
        `;
    }
  }}
`;

export const InfoTooltip = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 0.375rem;
  cursor: help;

  svg {
    color: #9ca3af;
    width: 14px;
    height: 14px;
    transition: color 0.2s ease;

    &:hover {
      color: #7367f0;
    }
  }
`;

export const TableCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(115, 103, 240, 0.15);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(115, 103, 240, 0.08);
  overflow: hidden;

  .dark-layout & {
    background: #283046;
    border-color: rgba(115, 103, 240, 0.25);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, rgba(115, 103, 240, 0.08) 0%, rgba(115, 103, 240, 0.03) 100%);
  border-bottom: 1px solid rgba(115, 103, 240, 0.15);

  .dark-layout & {
    background: linear-gradient(135deg, rgba(115, 103, 240, 0.15) 0%, rgba(115, 103, 240, 0.08) 100%);
    border-bottom-color: rgba(115, 103, 240, 0.25);
  }
`;

export const TableHeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;

  svg {
    color: #7367f0;
    width: 20px;
    height: 20px;
  }

  h3 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: #2c3e50;

    .dark-layout & {
      color: #e4e6eb;
    }
  }
`;

export const TableHeaderBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #7367f0 0%, #9e95f5 100%);
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(115, 103, 240, 0.35);
`;

export const TableRow = styled.div<{ $index: number; $clickable?: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  background: ${({ $index }) =>
    $index % 2 === 0 ? "#ffffff" : "rgba(115, 103, 240, 0.02)"};
  border-bottom: 1px solid rgba(115, 103, 240, 0.08);
  transition: all 0.2s ease;

  ${({ $clickable }) =>
    $clickable &&
    `
    cursor: pointer;

    &:hover {
      background: rgba(115, 103, 240, 0.08);
      transform: translateX(4px);
    }
  `}

  &:last-child {
    border-bottom: none;
  }

  .dark-layout & {
    background: ${({ $index }) =>
      $index % 2 === 0 ? "#283046" : "rgba(115, 103, 240, 0.08)"};
    border-bottom-color: rgba(115, 103, 240, 0.15);

    &:hover {
      background: rgba(115, 103, 240, 0.15);
    }
  }
`;

export const TableCell = styled.div<{ $align?: "left" | "center" | "right"; $flex?: number }>`
  flex: ${({ $flex }) => $flex || 1};
  text-align: ${({ $align }) => $align || "left"};
  padding: 0 0.75rem;
  font-size: 0.875rem;
  color: #2c3e50;

  .dark-layout & {
    color: #e4e6eb;
  }
`;

export const TableCellLabel = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6c757d;
  background: rgba(115, 103, 240, 0.08);
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.03em;

  .dark-layout & {
    color: #9ca3af;
    background: rgba(115, 103, 240, 0.15);
  }
`;

export const TimeSlotCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const TimeSlotIcon = styled.div<{ $isBreak: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ $isBreak }) =>
    $isBreak
      ? "linear-gradient(135deg, rgba(255, 159, 67, 0.15) 0%, rgba(255, 159, 67, 0.08) 100%)"
      : "linear-gradient(135deg, rgba(115, 103, 240, 0.15) 0%, rgba(115, 103, 240, 0.08) 100%)"};
  border: 1px solid
    ${({ $isBreak }) =>
      $isBreak ? "rgba(255, 159, 67, 0.25)" : "rgba(115, 103, 240, 0.2)"};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  svg {
    color: ${({ $isBreak }) => ($isBreak ? "#ff9f43" : "#7367f0")};
    width: 20px;
    height: 20px;
  }

  .dark-layout & {
    background: ${({ $isBreak }) =>
      $isBreak
        ? "linear-gradient(135deg, rgba(255, 159, 67, 0.2) 0%, rgba(255, 159, 67, 0.12) 100%)"
        : "linear-gradient(135deg, rgba(115, 103, 240, 0.2) 0%, rgba(115, 103, 240, 0.12) 100%)"};
    border-color: ${({ $isBreak }) =>
      $isBreak ? "rgba(255, 159, 67, 0.35)" : "rgba(115, 103, 240, 0.3)"};
  }
`;

export const TimeSlotInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

export const TimeSlotName = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;

  .dark-layout & {
    color: #e4e6eb;
  }
`;

export const TimeSlotTime = styled.span`
  font-size: 0.8rem;
  color: #6c757d;
  font-family: "SF Mono", "Monaco", "Consolas", monospace;

  .dark-layout & {
    color: #9ca3af;
  }
`;

export const TimeRange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: rgba(115, 103, 240, 0.06);
  border: 1px solid rgba(115, 103, 240, 0.12);
  border-radius: 8px;
  font-family: "SF Mono", "Monaco", "Consolas", monospace;
  font-size: 0.85rem;
  font-weight: 500;
  color: #7367f0;
  letter-spacing: 0.05em;

  .dark-layout & {
    background: rgba(115, 103, 240, 0.12);
    border-color: rgba(115, 103, 240, 0.25);
    color: #9e95f5;
  }
`;

export const StatusBadge = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-radius: 20px;
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, rgba(40, 199, 111, 0.15) 0%, rgba(40, 199, 111, 0.08) 100%)"
      : "linear-gradient(135deg, rgba(234, 84, 85, 0.15) 0%, rgba(234, 84, 85, 0.08) 100%)"};
  color: ${({ $active }) => ($active ? "#28c76f" : "#ea5455")};
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(40, 199, 111, 0.25)" : "rgba(234, 84, 85, 0.25)"};
`;

export const BreakTimeBadge = styled.span<{ $isBreak: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 12px;
  background: ${({ $isBreak }) =>
    $isBreak
      ? "linear-gradient(135deg, rgba(255, 159, 67, 0.15) 0%, rgba(255, 159, 67, 0.08) 100%)"
      : "rgba(115, 103, 240, 0.08)"};
  color: ${({ $isBreak }) => ($isBreak ? "#ff9f43" : "#6c757d")};
  border: 1px solid
    ${({ $isBreak }) =>
      $isBreak ? "rgba(255, 159, 67, 0.25)" : "rgba(115, 103, 240, 0.15)"};
`;

export const TableActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
`;

export const TableEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
`;

export const TableEmptyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, rgba(115, 103, 240, 0.1) 0%, rgba(115, 103, 240, 0.05) 100%);
  border-radius: 16px;

  svg {
    color: #7367f0;
    width: 32px;
    height: 32px;
  }
`;

export const TableEmptyTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;

  .dark-layout & {
    color: #e4e6eb;
  }
`;

export const TableEmptyDescription = styled.p`
  margin: 0 0 1.25rem 0;
  font-size: 0.875rem;
  color: #6c757d;
  max-width: 320px;

  .dark-layout & {
    color: #9ca3af;
  }
`;

export const ActionButton = styled.button<{ $variant?: "primary" | "danger" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ $variant }) => ($variant === "danger" ? "#ea5455" : "#7367f0")};
  background: ${({ $variant }) =>
    $variant === "danger"
      ? "rgba(234, 84, 85, 0.1)"
      : "rgba(115, 103, 240, 0.1)"};
  border: 1px solid
    ${({ $variant }) =>
      $variant === "danger"
        ? "rgba(234, 84, 85, 0.2)"
        : "rgba(115, 103, 240, 0.2)"};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $variant }) =>
      $variant === "danger"
        ? "linear-gradient(135deg, #ea5455 0%, #ff6b6b 100%)"
        : "linear-gradient(135deg, #7367f0 0%, #9e95f5 100%)"};
    color: #ffffff;
    border-color: transparent;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px
      ${({ $variant }) =>
        $variant === "danger"
          ? "rgba(234, 84, 85, 0.3)"
          : "rgba(115, 103, 240, 0.3)"};
  }

  svg {
    width: 16px;
    height: 16px;
  }

  .dark-layout & {
    background: ${({ $variant }) =>
      $variant === "danger"
        ? "rgba(234, 84, 85, 0.15)"
        : "rgba(115, 103, 240, 0.15)"};
    border-color: ${({ $variant }) =>
      $variant === "danger"
        ? "rgba(234, 84, 85, 0.3)"
        : "rgba(115, 103, 240, 0.3)"};

    &:hover {
      background: ${({ $variant }) =>
        $variant === "danger"
          ? "linear-gradient(135deg, #ea5455 0%, #ff6b6b 100%)"
          : "linear-gradient(135deg, #7367f0 0%, #9e95f5 100%)"};
    }
  }
`;
