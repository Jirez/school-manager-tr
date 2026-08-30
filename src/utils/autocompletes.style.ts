import styled from "styled-components";
import { Label, FormFeedback } from "reactstrap";

export const InputContainer = styled.div`
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
