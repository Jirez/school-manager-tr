import { useTranslation } from 'react-i18next'
import MySelect from '@/@core/components/ui/forms/custom-select'
import type { MySelectProps } from '@/@core/components/ui/forms/custom-select'
import Required from '@/@core/components/ui/forms/required'
import styled from 'styled-components'
import { useFieldContext } from '#/hooks/form/form-context'
import { useSelector } from '@tanstack/react-form'
import { StyledFormFeedback, StyledLabel } from '../forms/form.style'

interface ControlledSelectProps extends MySelectProps {
  label?: string
  required?: boolean
  className?: string
  prepend?: React.ReactNode
  labelClassName?: string
}

const SelectWrapper = styled.div<{ $hasPrepend?: boolean }>`
  position: relative;
  width: 100%;

  ${({ $hasPrepend }) =>
    $hasPrepend &&
    `
    .select__control {
      padding-left: 2.1rem !important;
    }
    .select__value-container {
      padding-left: 0.5rem !important;
    }
  `}
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
  z-index: 1001;
  color: #6e6b7b;

  .dark-layout & {
    color: #b4b7bd;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

const ControlledSelect = ({
  label,
  className = 'mb-0',
  required = false,
  prepend,
  labelClassName,
  name,
  onChange,
  ...props
}: ControlledSelectProps) => {
  const field = useFieldContext<any>()
  const errors = useSelector(field.store, (state) => state.meta.errors)
  const { t } = useTranslation()

  const hasError = errors.length > 0
  const fieldName = name || field.name

  return (
    <div className={className}>
      {label && (
        <StyledLabel
          for={fieldName}
          $error={hasError}
          $customClassName={labelClassName}
          className={labelClassName}
        >
          {label}
          {required && <Required />}
        </StyledLabel>
      )}
      <SelectWrapper $hasPrepend={!!prepend}>
        {prepend && <PrependWrapper>{prepend}</PrependWrapper>}
        <MySelect
          id={fieldName}
          name={fieldName}
          error={hasError}
          value={field.state.value}
          onChange={(value) => {
            field.handleChange(value)
            onChange?.(value)
          }}
          onBlur={field.handleBlur}
          {...props}
        />
      </SelectWrapper>

      {hasError &&
        errors.map((error: any, index: number) => {
          const message =
            typeof error === 'string'
              ? error
              : error?.message || String(error)
          return (
            <StyledFormFeedback key={index}>{t(message)}</StyledFormFeedback>
          )
        })}
    </div>
  )
}

export default ControlledSelect
