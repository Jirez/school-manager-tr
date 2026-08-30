import { Input as BaseInput } from 'reactstrap'
import type { InputProps } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'
import { styled } from 'styled-components'

import Required from '@/@core/components/ui/forms/required'
import { useSelector } from '@tanstack/react-form'
import { useFieldContext } from '@/hooks/form/form-context'
import { StyledFormFeedback, StyledLabel } from '../forms/form.style'

interface Props extends InputProps {
  label?: string
  required?: boolean
  id?: string
  className?: string
  labelClassName?: string
  hint?: string
  prepend?: React.ReactNode
  append?: React.ReactNode
}

const InputContainer = styled.div<{ $error?: boolean }>`
  position: relative;
  width: 100%;
  margin-bottom: 0.5rem;
`

const InputWrapper = styled.div<{
  $error?: boolean
  $hasPrepend?: boolean
  $hasAppend?: boolean
}>`
  position: relative;
  width: 100%;

  input,
  textarea,
  select {
    width: 100%;
    padding: 0.5rem 0.75rem;
    padding-left: ${({ $hasPrepend }) => ($hasPrepend ? '2.5rem' : '0.75rem')};
    padding-right: ${({ $hasAppend, $error }) =>
      $hasAppend || $error ? '2.5rem' : '0.75rem'};
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
  z-index: 1;
  color: #6e6b7b;

  .dark-layout & {
    color: #b4b7bd;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

const AppendWrapper = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  color: #6e6b7b;
  cursor: pointer;
  padding: 0.25rem;

  &:hover {
    color: #374151;
  }

  .dark-layout & {
    color: #b4b7bd;

    &:hover {
      color: #e5e7eb;
    }
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

const HintText = styled.p`
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: #6c757d;

  .dark-layout & {
    color: #9ca3af;
  }
`

const Input = ({
  label,
  required = false,
  id,
  className = 'mb-',
  labelClassName,
  hint,
  prepend,
  append,
  ...props
}: Props) => {
  const field = useFieldContext<string>()
  const errors = useSelector(field.store, (state) => state.meta.errors)
  const { t } = useTranslation()

  const hasError = errors.length > 0

  return (
    <InputContainer className={className} $error={hasError}>
      {label && (
        <StyledLabel
          for={id || field.name}
          $error={hasError}
          $customClassName={labelClassName}
          className={labelClassName}
        >
          {label}
          {required && <Required />}
        </StyledLabel>
      )}

      <InputWrapper
        $error={hasError}
        $hasPrepend={!!prepend}
        $hasAppend={!!append}
      >
        {prepend && <PrependWrapper>{prepend}</PrependWrapper>}
        <BaseInput
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          invalid={hasError}
          autoComplete="off"
          {...props}
        />

        {append && !hasError && <AppendWrapper>{append}</AppendWrapper>}

        {hasError && (
          <ErrorIcon>
            <AlertCircle size={16} />
          </ErrorIcon>
        )}
      </InputWrapper>

      {hint && !hasError && <HintText>{hint}</HintText>}

      {hasError && (
        <StyledFormFeedback>{t(errors[0].message)}</StyledFormFeedback>
      )}
    </InputContainer>
  )
}

export default Input
