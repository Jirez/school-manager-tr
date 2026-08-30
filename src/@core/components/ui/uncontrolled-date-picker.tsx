import type { FC } from 'react'
import type { DateTimePickerProps } from 'react-flatpickr'
import DatePicker from 'react-flatpickr'
import styled from 'styled-components'
import { Calendar } from 'lucide-react'

interface UncontrolledDatePickerProps extends DateTimePickerProps {
  error?: boolean
  className?: string
}

const DatePickerContainer = styled.div<{ $error?: boolean }>`
  position: relative;
  width: 100%;

  .flatpickr-input {
    width: 100%;
    padding: 0.5rem 0.75rem 0.5rem 2.5rem;
    font-size: 0.95rem;
    font-weight: 400;
    line-height: 1.5;
    color: #2c3e50;
    background-color: #ffffff;
    border: 1px solid ${({ $error }) => ($error ? '#ea5455' : '#d0d7de')};
    border-radius: 8px;
    transition: all 0.2s ease;
    outline: none;

    &:focus {
      border-color: ${({ $error }) => ($error ? '#ea5455' : '#7367f0')};
      box-shadow: ${({ $error }) =>
        $error
          ? '0 0 0 3px rgba(234, 84, 85, 0.1)'
          : '0 0 0 3px rgba(115, 103, 240, 0.1)'};
    }

    &:hover:not(:focus) {
      border-color: ${({ $error }) => ($error ? '#ea5455' : '#a8b0b8')};
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
      border-color: ${({ $error }) =>
        $error ? '#ea5455' : 'rgba(115, 103, 240, 0.3)'};
      color: #e4e6eb;

      &:focus {
        border-color: ${({ $error }) => ($error ? '#ea5455' : '#7367f0')};
        box-shadow: ${({ $error }) =>
          $error
            ? '0 0 0 3px rgba(234, 84, 85, 0.2)'
            : '0 0 0 3px rgba(115, 103, 240, 0.2)'};
      }

      &:hover:not(:focus) {
        border-color: ${({ $error }) =>
          $error ? '#ea5455' : 'rgba(115, 103, 240, 0.4)'};
      }

      &::placeholder {
        color: #9ca3af;
      }

      &:disabled {
        background-color: #1b1e2b;
      }
    }
  }
`

const IconWrapper = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
  color: #7367f0;

  svg {
    width: 18px;
    height: 18px;
  }

  .dark-layout & {
    color: #9e95f5;
  }
`

const UncontrolledDatePicker: FC<UncontrolledDatePickerProps> = ({
  error = false,
  className,
  ...props
}) => {
  // @ts-ignore desc
  const DatePickerComponent = (DatePicker as any).default || DatePicker
  return (
    <DatePickerContainer $error={error} className={className}>
      <IconWrapper>
        <Calendar size={18} />
      </IconWrapper>
      <DatePickerComponent
        className={`flatpickr-input ${error ? 'is-invalid' : ''}`}
        options={{
          allowInput: true,
          dateFormat: 'd/m/Y',
          ...props.options,
        }}
        placeholder="DD/MM/YYYY"
        {...props}
      />
    </DatePickerContainer>
  )
}

export default UncontrolledDatePicker
