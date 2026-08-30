import type { FC } from 'react'
import { Input as BaseInput, Label, FormFeedback } from 'reactstrap'
import type { InputProps } from 'reactstrap'
import { useController } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'
import { styled } from 'styled-components'

import Required from '@/@core/components/ui/forms/required'

interface Props extends InputProps {
  name: string
  label?: string
  required?: boolean
  control: Control<any>
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

const StyledLabel = styled(Label)<{
  $error?: boolean
  $customClassName?: string
}>`
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

const InputWrapper = styled.div<{ $error?: boolean; $hasPrepend?: boolean }>`
  position: relative;
  width: 100%;

  input,
  textarea,
  select {
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

const Input: FC<Props> = ({
  label,
  required = false,
  control,
  id,
  className = 'mb-',
  name,
  labelClassName,
  hint,
  prepend,
  append,
  ...props
}) => {
  const {
    formState: { errors },
    field,
  } = useController({
    name,
    control,
  })
  const { t } = useTranslation()

  const hasError = !!errors[name]

  return (
    <InputContainer className={className} $error={hasError}>
      {label && (
        <StyledLabel
          for={id || name}
          $error={hasError}
          $customClassName={labelClassName}
          className={labelClassName}
        >
          {label}
          {required && <Required />}
        </StyledLabel>
      )}

      <InputWrapper $error={hasError} $hasPrepend={!!prepend}>
        {prepend && <PrependWrapper>{prepend}</PrependWrapper>}
        <BaseInput
          id={id || name}
          invalid={hasError}
          {...field}
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
        <StyledFormFeedback>
          {t(errors?.[name]?.message as string)}
        </StyledFormFeedback>
      )}
    </InputContainer>
  )
}

export default Input
