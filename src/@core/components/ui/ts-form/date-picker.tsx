import { useState, useCallback, useEffect, useRef } from 'react'
import type { FC } from 'react'
import Flatpickr from 'react-flatpickr'
import type { DateTimePickerProps } from 'react-flatpickr'
import { FormFeedback, Label } from 'reactstrap'
import cs from 'classnames'
import { useTranslation } from 'react-i18next'
import { Calendar, AlertCircle } from 'lucide-react'
import { styled } from 'styled-components'
import { useSelector } from '@tanstack/react-form'
import { useFieldContext } from '@/hooks/form/form-context'

import Required from '@/@core/components/ui/forms/required'

// Helper function to format date input with auto-slash insertion
const formatDateInput = (value: string, prevValue: string): string => {
  // Remove all non-numeric characters except /
  let cleaned = value.replace(/[^\d/]/g, '')

  // Remove all slashes to work with pure digits
  const digits = cleaned.replace(/\//g, '')

  // Limit to 8 digits (DDMMYYYY)
  const limitedDigits = digits.slice(0, 8)

  // Build formatted string with auto-slashes
  let formatted = ''
  for (let i = 0; i < limitedDigits.length; i++) {
    if (i === 2 || i === 4) {
      formatted += '/'
    }
    formatted += limitedDigits[i]
  }

  return formatted
}

interface Props extends DateTimePickerProps {
  label: string
  required?: boolean
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

const DatePicker: FC<Props> = ({
  label,
  required = false,
  className = 'mb-1',
  showIcon = true,
  ...props
}) => {
  const field = useFieldContext<Date[]>()
  const errors = useSelector(field.store, (state) => state.meta.errors)
  const { t } = useTranslation()

  const hasError = errors.length > 0

  const flatpickrRef = useRef<Flatpickr | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [inputValue, setInputValue] = useState('')
  const isInternalUpdate = useRef(false)

  // @ts-ignore desc
  const FlatpickrComponent = (Flatpickr as any).default || Flatpickr

  // Sync input value with field value (only for external updates)
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false
      return
    }

    if (field.state.value) {
      // Handle array format from Flatpickr
      const dateValue = Array.isArray(field.state.value)
        ? field.state.value[0]
        : field.state.value
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue)
      if (!isNaN(date.getTime())) {
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        setInputValue(`${day}/${month}/${year}`)
      }
    } else {
      setInputValue('')
    }
  }, [field.state.value])

  // Handle manual input with auto-slash formatting
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target
      const cursorPosition = input.selectionStart || 0
      const prevValue = inputValue
      const newValue = input.value

      const formatted = formatDateInput(newValue, prevValue)
      setInputValue(formatted)

      // Update cursor position after formatting
      requestAnimationFrame(() => {
        if (inputRef.current) {
          // Calculate new cursor position based on formatting
          let newCursorPos = cursorPosition

          // If we just added a slash, move cursor past it
          if (formatted.length > prevValue.length) {
            const charsAdded = formatted.length - prevValue.length
            if (charsAdded > 1) {
              // A slash was auto-inserted
              newCursorPos = cursorPosition + 1
            }
          }

          // Clamp cursor position
          newCursorPos = Math.min(newCursorPos, formatted.length)
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos)
        }
      })

      // Parse and update field if valid date
      if (formatted.length === 10) {
        const parts = formatted.split('/')
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10)
          const month = parseInt(parts[1], 10) - 1
          const year = parseInt(parts[2], 10)
          const date = new Date(year, month, day)

          if (
            !isNaN(date.getTime()) &&
            date.getDate() === day &&
            date.getMonth() === month
          ) {
            isInternalUpdate.current = true
            field.handleChange([date])
            // Update flatpickr calendar
            if (flatpickrRef.current?.flatpickr) {
              flatpickrRef.current.flatpickr.setDate(date, false)
            }
          }
        }
      }
    },
    [inputValue, field],
  )

  // Handle calendar date selection
  const handleCalendarChange = useCallback(
    (dates: Date[]) => {
      if (dates.length > 0) {
        const selectedDate = dates[0]
        isInternalUpdate.current = true
        field.handleChange(dates)

        // Update input value to show selected date
        const day = selectedDate.getDate().toString().padStart(2, '0')
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0')
        const year = selectedDate.getFullYear()
        setInputValue(`${day}/${month}/${year}`)
      }
    },
    [field],
  )

  return (
    <DatePickerContainer className={className} $error={hasError}>
      {label && (
        <StyledLabel for={field.name} $error={hasError}>
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
          id={field.name}
          options={{
            allowInput: true,
            dateFormat: 'd/m/Y',
            clickOpens: true,
            ...props.options,
          }}
          {...props}
          onChange={handleCalendarChange}
          ref={(ref: any) => {
            flatpickrRef.current = ref
            /* field.ref({
              focus: () => inputRef.current?.focus(),
            }) */
          }}
          // @ts-ignore desc
          render={({ defaultValue }, refCallback) => (
            <input
              ref={(el) => {
                inputRef.current = el
                if (el) {
                  refCallback(el)
                }
              }}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="DD/MM/YYYY"
              autoComplete="off"
              className={cs('flatpickr-input', { 'is-invalid': hasError })}
            />
          )}
        />
      </InputWrapper>
      {hasError && (
        <StyledFormFeedback>{t(errors[0].message)}</StyledFormFeedback>
      )}
    </DatePickerContainer>
  )
}

export default DatePicker
