import type { FC } from 'react'
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.cm'
import { useTranslation } from 'react-i18next'
import { Phone, AlertCircle } from 'lucide-react'
import { InputGroup, InputGroupText } from 'reactstrap'
import { styled } from 'styled-components'

import Required from '../forms/required'
import { useSelector } from '@tanstack/react-form'
import { useFieldContext } from '@/hooks/form/form-context'
import { StyledFormFeedback, StyledLabel } from '../forms/form.style'

interface PhoneInputProps {
  label?: string
  className?: string
  required?: boolean
  id?: string
  labelClassName?: string
  hint?: string
}

const InputContainer = styled.div<{ $error?: boolean }>`
  position: relative;
  width: 100%;
  margin-bottom: 0.5rem;
`

const InputWrapper = styled.div<{ $error?: boolean }>`
  position: relative;
  width: 100%;
`

const StyledInputGroup = styled(InputGroup)<{ $error?: boolean }>`
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;

  .input-group-text {
    background-color: #f8f9fa;
    border: 1px solid ${({ $error }) => ($error ? '#ea5455' : '#d0d7de')};
    border-right: none;
    border-radius: 8px 0 0 8px;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6c757d;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    transition: all 0.2s ease;

    .dark-layout & {
      background-color: #283046;
      border-color: ${({ $error }) =>
        $error ? '#ea5455' : 'rgba(115, 103, 240, 0.3)'};
      color: #9ca3af;
    }

    svg {
      width: 16px;
      height: 16px;
      color: #7367f0;
    }
  }

  &:focus-within .input-group-text {
    border-color: ${({ $error }) => ($error ? '#ea5455' : '#7367f0')};
    z-index: 1;
  }

  &:hover:not(:focus-within) .input-group-text {
    border-color: ${({ $error }) => ($error ? '#ea5455' : '#a8b0b8')};
  }
`

const StyledCleave = styled(Cleave)<{ $error?: boolean }>`
  flex: 1 1 auto;
  min-width: 0;
  padding: 0.5rem 0.75rem;
  padding-right: ${({ $error }) => ($error ? '2.5rem' : '0.75rem')};
  font-size: 0.95rem;
  font-weight: 400;
  line-height: 1.5;
  color: #2c3e50;
  background-color: #ffffff;
  border: 1px solid ${({ $error }) => ($error ? '#ea5455' : '#d0d7de')};
  border-left: none;
  border-radius: 0 8px 8px 0;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    border-color: ${({ $error }) => ($error ? '#ea5455' : '#7367f0')};
    box-shadow: ${({ $error }) =>
      $error
        ? '0 0 0 3px rgba(234, 84, 85, 0.1)'
        : '0 0 0 3px rgba(115, 103, 240, 0.1)'};
    z-index: 1;
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
  z-index: 2;
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

const PhoneInput: FC<PhoneInputProps> = ({
  className = 'mb-1',
  label,
  required = false,
  id,
  labelClassName,
  hint,
}) => {
  const field = useFieldContext<string>()
  const errors = useSelector(field.store, (state) => state.meta.errors)
  const { t } = useTranslation()

  const options = { phone: true, phoneRegionCode: 'CM' }
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

      <InputWrapper $error={hasError}>
        <StyledInputGroup $error={hasError} className="input-group-merge">
          <InputGroupText>
            <Phone size={16} />
            <span>+237</span>
          </InputGroupText>
          <StyledCleave
            $error={hasError}
            placeholder="650 00 01 02"
            options={options}
            id={id || field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            autoComplete="off"
          />
          {hasError && (
            <ErrorIcon>
              <AlertCircle size={16} />
            </ErrorIcon>
          )}
        </StyledInputGroup>
      </InputWrapper>

      {hint && !hasError && <HintText>{hint}</HintText>}

      {hasError && (
        <StyledFormFeedback>{t(errors[0].message)}</StyledFormFeedback>
      )}
    </InputContainer>
  )
}

export default PhoneInput
