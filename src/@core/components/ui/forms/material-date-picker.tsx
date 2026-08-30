import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import type { FC } from 'react'
import { useController } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Calendar, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'

import Required from '@/@core/components/ui/forms/required'

interface MaterialDatePickerProps {
  name: string
  label: string
  required?: boolean
  control: Control<any>
  className?: string
  disabled?: boolean
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  dateFormat?: string
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const formatDate = (
  date: Date | null,
  format: string = 'dd/MM/yyyy',
): string => {
  if (!date) return ''
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', year.toString())
}

const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null
  const parts = dateString.split('/')
  if (parts.length !== 3) return null
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  const year = parseInt(parts[2], 10)
  const date = new Date(year, month, day)
  return isNaN(date.getTime()) ? null : date
}

const MaterialDatePicker: FC<MaterialDatePickerProps> = ({
  name,
  label,
  required = false,
  control,
  className = '',
  disabled = false,
  placeholder = 'DD/MM/YYYY',
  minDate,
  maxDate,
  dateFormat = 'dd/MM/yyyy',
}) => {
  const {
    field,
    formState: { errors },
  } = useController({ name, control })
  const { t } = useTranslation()

  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [viewDate, setViewDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days')

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const hasError = !!errors[name]
  const hasValue = !!field.value || inputValue.length > 0
  const isFloating = isFocused || hasValue

  // Initialize input value from field value
  useEffect(() => {
    if (field.value) {
      const date =
        field.value instanceof Date ? field.value : new Date(field.value)
      if (!isNaN(date.getTime())) {
        setInputValue(formatDate(date, dateFormat))
        setViewDate(date)
      }
    }
  }, [field.value, dateFormat])

  // Handle click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setViewMode('days')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    const parsed = parseDate(value)
    if (parsed) {
      field.onChange(parsed)
      setViewDate(parsed)
    }
  }

  const handleDateSelect = useCallback(
    (date: Date) => {
      field.onChange(date)
      setInputValue(formatDate(date, dateFormat))
      setViewDate(date)
      setIsOpen(false)
      setViewMode('days')
    },
    [field, dateFormat],
  )

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(viewDate)
    newDate.setMonth(monthIndex)
    setViewDate(newDate)
    setViewMode('days')
  }

  const handleYearSelect = (year: number) => {
    const newDate = new Date(viewDate)
    newDate.setFullYear(year)
    setViewDate(newDate)
    setViewMode('months')
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate)
    newDate.setMonth(viewDate.getMonth() + (direction === 'next' ? 1 : -1))
    setViewDate(newDate)
  }

  const navigateYear = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate)
    newDate.setFullYear(
      viewDate.getFullYear() + (direction === 'next' ? 1 : -1),
    )
    setViewDate(newDate)
  }

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days: (Date | null)[] = []

    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }

    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const isToday = (date: Date): boolean => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date: Date): boolean => {
    if (!field.value) return false
    const selected =
      field.value instanceof Date ? field.value : new Date(field.value)
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    )
  }

  const days = useMemo(() => getDaysInMonth(viewDate), [viewDate])

  const yearRange = useMemo(() => {
    const currentYear = viewDate.getFullYear()
    const startYear = currentYear - 6
    return Array.from({ length: 12 }, (_, i) => startYear + i)
  }, [viewDate])

  const handleClear = () => {
    field.onChange(null)
    setInputValue('')
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Input Container with Floating Label */}
      <div
        className={`
          relative rounded-lg border transition-all duration-200
          ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-[#283046] cursor-text'}
          ${
            hasError
              ? 'border-red-500 dark:border-red-500'
              : isFocused
                ? 'border-primary dark:border-primary shadow-[0_0_0_2px_rgba(115,103,240,0.2)]'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
        `}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        {/* Floating Label */}
        <label
          className={`
            absolute left-3 transition-all duration-200 pointer-events-none z-10
            ${
              isFloating
                ? '-top-2.5 text-xs px-1 bg-white dark:bg-[#283046]'
                : 'top-1/2 -translate-y-1/2 text-base'
            }
            ${
              hasError
                ? 'text-red-500'
                : isFocused
                  ? 'text-primary'
                  : 'text-gray-500 dark:text-gray-400'
            }
          `}
        >
          {label}
          {required && <Required />}
        </label>

        {/* Input Field */}
        <div className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true)
              setIsOpen(true)
            }}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            placeholder={isFloating ? placeholder : ''}
            autoComplete="off"
            className={`
              w-full py-3.5 pl-3 pr-10 text-base bg-transparent outline-none
              text-gray-900 dark:text-gray-100
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              disabled:cursor-not-allowed
            `}
          />

          {/* Calendar Icon / Clear Button */}
          <div className="absolute right-3 flex items-center gap-1">
            {hasValue && !disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClear()
                }}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (!disabled) {
                  setIsOpen(!isOpen)
                  inputRef.current?.focus()
                }
              }}
              className={`
                p-1.5 rounded-full transition-colors
                ${
                  hasError
                    ? 'text-red-500'
                    : isFocused
                      ? 'text-primary'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }
                ${disabled ? 'cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
              disabled={disabled}
            >
              <Calendar className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {hasError && (
        <div className="flex items-center gap-1 mt-1.5 text-sm text-red-500 animate-[fadeIn_0.2s_ease-in-out]">
          <AlertCircle className="w-4 h-4" />
          <span>{t(errors?.[name]?.message as string)}</span>
        </div>
      )}

      {/* Calendar Dropdown */}
      {isOpen && !disabled && (
        <div
          className="
            absolute z-50 mt-2 w-72 bg-white dark:bg-[#283046] 
            rounded-xl shadow-xl border border-gray-200 dark:border-gray-700
            animate-[slideDown_0.2s_ease-out]
            overflow-hidden
          "
          style={{
            animation: 'slideDown 0.2s ease-out',
          }}
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-white">
            <button
              type="button"
              onClick={() =>
                viewMode === 'days'
                  ? navigateMonth('prev')
                  : navigateYear('prev')
              }
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setViewMode(viewMode === 'months' ? 'days' : 'months')
                }
                className="px-2 py-1 rounded hover:bg-white/20 transition-colors font-medium"
              >
                {MONTHS[viewDate.getMonth()]}
              </button>
              <button
                type="button"
                onClick={() =>
                  setViewMode(viewMode === 'years' ? 'days' : 'years')
                }
                className="px-2 py-1 rounded hover:bg-white/20 transition-colors font-medium"
              >
                {viewDate.getFullYear()}
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                viewMode === 'days'
                  ? navigateMonth('next')
                  : navigateYear('next')
              }
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Days View */}
          {viewMode === 'days' && (
            <div className="p-3">
              {/* Day Headers */}
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-0.5">
                {days.map((date, index) => (
                  <div
                    key={index}
                    className="aspect-square flex items-center justify-center"
                  >
                    {date ? (
                      <button
                        type="button"
                        onClick={() =>
                          !isDateDisabled(date) && handleDateSelect(date)
                        }
                        disabled={isDateDisabled(date)}
                        className={`
                          w-9 h-9 rounded-full text-sm font-medium transition-all duration-150
                          flex items-center justify-center
                          ${
                            isDateDisabled(date)
                              ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                              : isSelected(date)
                                ? 'bg-primary text-white shadow-md'
                                : isToday(date)
                                  ? 'border-2 border-primary text-primary dark:text-primary'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        {date.getDate()}
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>

              {/* Today Button */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => handleDateSelect(new Date())}
                  className="
                    w-full py-2 text-sm font-medium text-primary 
                    hover:bg-primary/10 rounded-lg transition-colors
                  "
                >
                  Today
                </button>
              </div>
            </div>
          )}

          {/* Months View */}
          {viewMode === 'months' && (
            <div className="p-3 grid grid-cols-3 gap-2">
              {MONTHS.map((month, index) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => handleMonthSelect(index)}
                  className={`
                    py-3 px-2 rounded-lg text-sm font-medium transition-all
                    ${
                      viewDate.getMonth() === index
                        ? 'bg-primary text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {month.slice(0, 3)}
                </button>
              ))}
            </div>
          )}

          {/* Years View */}
          {viewMode === 'years' && (
            <div className="p-3 grid grid-cols-3 gap-2">
              {yearRange.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => handleYearSelect(year)}
                  className={`
                    py-3 px-2 rounded-lg text-sm font-medium transition-all
                    ${
                      viewDate.getFullYear() === year
                        ? 'bg-primary text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Global Styles for Animation */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
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
      `}</style>
    </div>
  )
}

export default MaterialDatePicker
