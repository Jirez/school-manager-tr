import { NumericFormat } from 'react-number-format'
import type { NumericFormatProps } from 'react-number-format'
import { Label, FormFeedback } from 'reactstrap'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'
import { preventSubmitting } from '@/utils/helpers'
import { useFieldContext } from '#/hooks/form/form-context'
import { useSelector } from '@tanstack/react-form'
import Required from '../forms/required'

interface Props extends Omit<NumericFormatProps, 'name' | 'customInput'> {
  // name: string // The numeric value field (e.g., purchasePrice)
  // nameF: string // The formatted string field (e.g., purchasePriceF)
  label?: string
  placeholder?: string
  required?: boolean
  prepend?: React.ReactNode
  className?: string
}

const InputContainer = styled.div<{ $error?: boolean }>`
  position: relative;
  width: 100%;
  margin-bottom: 0.5rem;
`

const StyledLabel = styled(Label)<{
  $error?: boolean
}>`
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  transition: color 0.2s ease;

  .dark-layout & {
    color: #d1d5db;
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

const InputWrapper = styled.div<{ $error?: boolean; $hasPrepend?: boolean }>`
  position: relative;
  width: 100%;

  .form-control {
    width: 100%;
    padding: 0.5rem 0.75rem;
    padding-left: ${({ $hasPrepend }) => ($hasPrepend ? '2.5rem' : '0.75rem')};
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
      border-color: ${({ $error }) => ($error ? '#ea5455' : '#2f8724')};
      box-shadow: ${({ $error }) =>
        $error
          ? '0 0 0 3px rgba(234, 84, 85, 0.1)'
          : '0 0 0 3px rgba(47, 135, 36, 0.1)'};
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
        $error ? '#ea5455' : 'rgba(47, 135, 36, 0.3)'};
      color: #e4e6eb;

      &:focus {
        border-color: ${({ $error }) => ($error ? '#ea5455' : '#2f8724')};
        box-shadow: ${({ $error }) =>
          $error
            ? '0 0 0 3px rgba(234, 84, 85, 0.2)'
            : '0 0 0 3px rgba(47, 135, 36, 0.2)'};
      }

      &:hover:not(:focus) {
        border-color: ${({ $error }) =>
          $error ? '#ea5455' : 'rgba(47, 135, 36, 0.4)'};
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

const PrependWrapper = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 10;
  color: #6e6b7b;

  .dark-layout & {
    color: #b4b7bd;
  }

  svg {
    width: 16px;
    height: 16px;
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

const NumericInput = ({
  label,
  placeholder = '0.00',
  required = false,
  prepend,
  className = 'flex flex-col gap-0.5',
  thousandSeparator = ' ',
  ...props
}: Props) => {
  const { t } = useTranslation()
  const field = useFieldContext<string>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  const hasError = errors.length > 0
  const errorMessage = errors?.[0]?.message
  // const inputName = field.name

  return (
    <InputContainer className={className} $error={hasError}>
      {label && (
        <StyledLabel $error={hasError} className="form-label">
          {label}
          {required && <Required />}
        </StyledLabel>
      )}

      <InputWrapper $error={hasError} $hasPrepend={!!prepend}>
        {prepend && <PrependWrapper>{prepend}</PrependWrapper>}
        <NumericFormat
          className="form-control"
          thousandSeparator={thousandSeparator}
          placeholder={placeholder}
          onKeyPress={preventSubmitting}
          value={field.state.value}
          onValueChange={(val) => {
            field.handleChange(val.value)
            // field.form.setFieldValue(inputName + 'F', val.formattedValue)
          }}
          {...props}
        />

        {hasError && (
          <ErrorIcon>
            <AlertCircle size={16} />
          </ErrorIcon>
        )}
      </InputWrapper>

      {hasError && (
        <StyledFormFeedback>{t(errorMessage as string)}</StyledFormFeedback>
      )}
    </InputContainer>
  )
}

export default NumericInput
