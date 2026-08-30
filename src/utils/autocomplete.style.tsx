import { FormFeedback, Label } from "reactstrap";
import styled, { keyframes, css } from "styled-components";

export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(115, 103, 240, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(115, 103, 240, 0); }
  100% { box-shadow: 0 0 0 0 rgba(115, 103, 240, 0); }
`;

export const InputGroup = styled.div<{
  $isFocused?: boolean;
  $isLoading?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
  border-radius: 8px;
  background: white;
  border: 1px solid rgba(115, 103, 240, 0.15);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  overflow: hidden;

  ${(props) =>
    props.$isFocused &&
    css`
      border-color: #7367f0;
      box-shadow: 0 0 0 3px rgba(115, 103, 240, 0.1);
    `}

  &:hover:not(:focus-within) {
    border-color: rgba(115, 103, 240, 0.4);
  }

  .dark-layout & {
    background: rgba(40, 48, 70, 0.4);
    border-color: rgba(115, 103, 240, 0.2);
    backdrop-filter: blur(8px);

    ${(props) =>
      props.$isFocused &&
      css`
        background: rgba(40, 48, 70, 0.8);
        border-color: #7367f0;
      `}
  }
`;

export const PrependAction = styled.button<{ $isLoading?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  background: rgba(115, 103, 240, 0.05);
  border: none;
  border-right: 1px solid rgba(115, 103, 240, 0.1);
  color: #7367f0;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: rgba(115, 103, 240, 0.1);
    color: #4839eb;
  }

  svg {
    animation: ${(props) => (props.$isLoading ? spin : "none")} 1s linear
      infinite;
  }

  .dark-layout & {
    background: rgba(115, 103, 240, 0.1);
    border-right-color: rgba(115, 103, 240, 0.2);
  }
`;

export const ContentArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.25rem;
`;

export const SearchIconBox = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 0.5rem;
  color: ${(props) => (props.$active ? "#7367f0" : "#94a3b8")};
  transition: color 0.2s ease;
`;

export const InputContainer = styled.div`
  flex: 1;

  .simple-input {
    width: 100%;
    height: 34px;
    border: none !important;
    background: transparent !important;
    padding: 0 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #334155;
    box-shadow: none !important;

    &::placeholder {
      color: #94a3b8;
      font-weight: 400;
      transition: opacity 0.2s ease;
    }

    &:focus::placeholder {
      opacity: 0.6;
    }

    .dark-layout & {
      color: #cbd5e1;
    }
  }
`;

export const AppendAction = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.75rem;
  background: transparent;
  border: none;
  border-left: 1px solid rgba(115, 103, 240, 0.1);
  color: #7367f0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.7rem;
  font-weight: 600;

  &:hover {
    background: rgba(115, 103, 240, 0.05);
    color: #4839eb;
  }

  .shortcut-text {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }

  &:hover .shortcut-text {
    opacity: 1;
  }

  kbd {
    background: rgba(115, 103, 240, 0.1);
    border: 1px solid rgba(115, 103, 240, 0.2);
    border-radius: 4px;
    padding: 0.1rem 0.3rem;
    font-family: inherit;
    font-size: 0.65rem;
    color: #7367f0;
    box-shadow: 0 1px 0 rgba(115, 103, 240, 0.3);

    .dark-layout & {
      background: rgba(115, 103, 240, 0.2);
      border-color: rgba(115, 103, 240, 0.3);
      box-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
    }
  }

  @media (max-width: 768px) {
    .shortcut-text {
      display: none;
    }
  }
`;

export const LoadingBar = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #7367f0, transparent);
  width: 100%;
  transform: translateX(-100%);
  animation: ${keyframes`
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  `} 1.5s infinite;
  display: ${(props) => (props.$visible ? "block" : "none")};
`;

export const InputContainer2 = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 0.5rem;
`;

export const StyledLabel = styled(Label)`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  transition: color 0.2s ease;

  .dark-layout & {
    color: #d1d5db;
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;

  input.simple-input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    padding-left: 2.5rem;
    font-size: 0.95rem;
    font-weight: 400;
    line-height: 1.5;
    color: #2c3e50;
    background-color: #ffffff;
    border: 1px solid #d0d7de;
    border-radius: 8px;
    transition: all 0.2s ease;
    outline: none;

    &:focus {
      border-color: #7367f0;
      box-shadow: 0 0 0 3px rgba(115, 103, 240, 0.1);
    }

    &:hover:not(:focus) {
      border-color: #a8b0b8;
    }

    &::placeholder {
      color: #6c757d;
      opacity: 0.7;
    }

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .dark-layout & {
      background-color: #283046;
      border-color: rgba(115, 103, 240, 0.3);
      color: #e4e6eb;

      &:focus {
        border-color: #7367f0;
        box-shadow: 0 0 0 3px rgba(115, 103, 240, 0.2);
      }

      &:hover:not(:focus) {
        border-color: rgba(115, 103, 240, 0.4);
      }

      &::placeholder {
        color: #9ca3af;
      }

      &:disabled {
        background-color: #1b1e2b;
      }
    }
  }
`;

export const PrependWrapper = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
  color: #6e6b7b;

  .dark-layout & {
    color: #b4b7bd;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const StyledFormFeedback = styled(FormFeedback)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.375rem;
  font-size: 0.875rem;
  color: #ea5455;
`;
