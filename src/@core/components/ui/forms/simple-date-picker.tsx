import type { FC } from 'react'
import type { Control } from 'react-hook-form'
import { useController } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import type { DateTimePickerProps } from 'react-flatpickr'
import { FormFeedback, Label } from 'reactstrap'
import cs from 'classnames'
import { useTranslation } from 'react-i18next'
import { Calendar, AlertCircle } from 'lucide-react'
import { styled } from 'styled-components'

import Required from '@/@core/components/ui/forms/required'

interface Props extends DateTimePickerProps {
  name: string
  label?: string
  required?: boolean
  control: Control<any>
  className?: string
  showIcon?: boolean
}

const DatePickerContainer = styled.div<{ $error?: boolean }>`
  position: relative;
  width: 100%;
  margin-bottom: 0.5rem;
`

const StyledLabel = styled(Label)<{ $error?: boolean }>`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 0.01em;
  transition: color 0.2s ease;

  .dark-layout & {
    color: #e4e6eb;
  }

  ${({ $error }) =>
    $error &&
    `
    color: #ea5455;

    .dark-layout & {
      color: #ea5455;
    }
  `}
`

const InputWrapper = styled.div<{ $error?: boolean }>`
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

const IconWrapper = styled.div<{ $error?: boolean }>`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
  color: ${({ $error }) => ($error ? '#ea5455' : '#7367f0')};
  transition: color 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  .dark-layout & {
    color: ${({ $error }) => ($error ? '#ea5455' : '#9e95f5')};
  }
`

const ErrorIcon = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
  color: #ea5455;

  svg {
    width: 16px;
    height: 16px;
  }
`

const StyledFormFeedback = styled(FormFeedback)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.375rem;
  font-size: 0.875rem;
  color: #ea5455;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const SimpleDatePicker: FC<Props> = ({
  name,
  label,
  required = false,
  control,
  className = 'mb-1',
  showIcon = true,
  ...props
}) => {
  const {
    field,
    formState: { errors },
  } = useController({ name, control })
  const { t } = useTranslation()

  const hasError = !!errors?.[name]

  // @ts-ignore desc
  const FlatpickrComponent = (Flatpickr as any).default || Flatpickr

  return (
    <DatePickerContainer className={className} $error={hasError}>
      {label && (
        <StyledLabel for={name} $error={hasError}>
          {label}
          {required ? <Required /> : ''}
        </StyledLabel>
      )}
      <InputWrapper $error={hasError}>
        {showIcon && (
          <IconWrapper $error={hasError}>
            <Calendar size={18} />
          </IconWrapper>
        )}
        {hasError && (
          <ErrorIcon>
            <AlertCircle size={16} />
          </ErrorIcon>
        )}
        <FlatpickrComponent
          id={name}
          className={cs('flatpickr-input', { 'is-invalid': hasError })}
          options={{
            allowInput: true,
            dateFormat: 'd/m/Y',
            ...props.options,
          }}
          {...field}
          {...props}
          autoComplete="off"
          ref={(ref: any) => {
            field.ref({
              focus: () => {
                // Handle focus if needed
              },
            })
          }}
        />
      </InputWrapper>
      {hasError && (
        <StyledFormFeedback>
          <AlertCircle size={14} />
          {t(errors?.[name]?.message as string)}
        </StyledFormFeedback>
      )}
    </DatePickerContainer>
  )
}

export default SimpleDatePicker
