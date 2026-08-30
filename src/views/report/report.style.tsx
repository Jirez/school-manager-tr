import Button from '@/@core/components/button'
import styled, { keyframes } from 'styled-components'

export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

export const FilterSection = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid rgba(115, 103, 240, 0.1);

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  .dark-layout & {
    border-bottom-color: rgba(115, 103, 240, 0.2);
  }
`

export const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: rgba(115, 103, 240, 0.03);
  border: 1px solid rgba(115, 103, 240, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    background: rgba(115, 103, 240, 0.06);
    border-color: rgba(115, 103, 240, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(115, 103, 240, 0.1);
  }

  .dark-layout & {
    background: rgba(115, 103, 240, 0.08);
    border-color: rgba(115, 103, 240, 0.2);

    &:hover {
      background: rgba(115, 103, 240, 0.12);
    }
  }
`

export const CheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #7367f0;
  flex-shrink: 0;

  &:checked {
    filter: drop-shadow(0 2px 4px rgba(115, 103, 240, 0.4));
  }
`

export const CheckboxLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #2c3e50;
  flex: 1;

  .dark-layout & {
    color: #e4e6eb;
  }
`

export const CheckboxIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #7367f0;
  flex-shrink: 0;
`

export const DatePickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6c757d;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .dark-layout & {
      color: #9ca3af;
    }
  }
`

export const SectionTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #7367f0;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  .dark-layout & {
    color: #9e95f5;
  }
`

export const ActionButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(115, 103, 240, 0.1);

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  .dark-layout & {
    border-top-color: rgba(115, 103, 240, 0.2);
  }
`

export const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 140px;
  transition: all 0.2s ease;

  svg {
    flex-shrink: 0;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(115, 103, 240, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`

export const ExportButton = styled(StyledButton)`
  background-color: #16a34a !important;
  border-color: #16a34a !important;
  color: #ffffff !important;

  &:hover {
    background-color: #15803d !important;
    border-color: #15803d !important;
    color: #ffffff !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
  }

  &:active {
    background-color: #166534 !important;
    border-color: #166534 !important;
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

export const PdfContainer = styled.div`
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 4rem;
  animation: ${fadeIn} 0.6s ease-out;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(255, 255, 255, 0.95) 100%
  );
  border: 1px solid rgba(115, 103, 240, 0.2);
  border-radius: 16px;
  padding: 0rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(115, 103, 240, 0.05);

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(40, 48, 70, 0.98) 0%,
      rgba(40, 48, 70, 0.95) 100%
    );
    border-color: rgba(115, 103, 240, 0.3);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.3),
      0 2px 4px -1px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(115, 103, 240, 0.1);
  }
`

export const FilterCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(255, 255, 255, 0.95) 100%
  );
  border: 1px solid rgba(115, 103, 240, 0.2);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(115, 103, 240, 0.05);
  animation: ${fadeIn} 0.4s ease-out;
  backdrop-filter: blur(10px);

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(40, 48, 70, 0.98) 0%,
      rgba(40, 48, 70, 0.95) 100%
    );
    border-color: rgba(115, 103, 240, 0.3);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.3),
      0 2px 4px -1px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(115, 103, 240, 0.1);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

export const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(115, 103, 240, 0.1);

  .dark-layout & {
    border-bottom-color: rgba(115, 103, 240, 0.2);
  }
`

export const FilterIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #7367f0 0%, #9e95f5 100%);
  box-shadow: 0 2px 8px rgba(115, 103, 240, 0.3);

  svg {
    color: #ffffff;
  }
`

export const FilterTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .dark-layout & {
    color: #e4e6eb;
  }
`

export const FilterSubtitle = styled.p`
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  color: #6c757d;

  .dark-layout & {
    color: #9ca3af;
  }
`

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 0.5rem;
  animation: ${slideIn} 0.5s ease-out;
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #9ca3af;
  text-align: center;

  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 1rem;
    opacity: 0.5;
    color: #7367f0;
  }

  p {
    font-size: 0.95rem;
    margin: 0;
  }

  .dark-layout & {
    color: #6b7280;
  }
`

/// ******************* new

// Styled Components
export const ReportContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
`

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: end;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr auto;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr auto auto;
  }
`

/* const DatePickerWrapper = styled.div`
  position: relative;

  .flatpickr-input {
    padding-left: 2.5rem !important;
  }
`; */

export const ActionButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 42px;
  padding: 0.625rem 1.25rem;
  font-weight: 500;
  border-radius: 10px;
  transition: all 0.2s ease;

  &.btn-primary {
    background: linear-gradient(135deg, #2f8724 0%, #45a039 100%) !important;
    border: none !important;
    box-shadow: 0 3px 10px rgba(47, 135, 36, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(47, 135, 36, 0.4);
    }
  }

  &.btn-secondary {
    color: #6e6b7b !important;
    background: transparent !important;
    border: 1px solid #d8d6de !important;

    &:hover {
      background: rgba(47, 135, 36, 0.08) !important;
      border-color: #2f8724 !important;
      color: #2f8724 !important;
    }

    .dark-layout & {
      color: #b4b7bd !important;
      border-color: #404656 !important;

      &:hover {
        background: rgba(47, 135, 36, 0.12) !important;
        border-color: #2f8724 !important;
        color: #45a039 !important;
      }
    }
  }
`

export const ActionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(47, 135, 36, 0.1);

  .dark-layout & {
    border-top-color: rgba(47, 135, 36, 0.2);
  }
`
