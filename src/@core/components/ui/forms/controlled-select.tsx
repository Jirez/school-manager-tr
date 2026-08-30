import type { FC } from 'react'
import type { Control } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { FormFeedback, Label } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import type { MySelectProps } from '@/@core/components/ui/forms/custom-select'
import MySelect from '@/@core/components/ui/forms/custom-select'
import Required from '@/@core/components/ui/forms/required'
import styled from 'styled-components'

interface ControlledSelectProps extends MySelectProps {
  name: string
  label?: string
  required?: boolean
  control: Control<any>
  className?: string
  prepend?: React.ReactNode
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

const ControlledSelect: FC<ControlledSelectProps> = ({
  label,
  name,
  control,
  className = 'mb-0',
  required = false,
  prepend,
  ...props
}) => {
  const {
    field,
    formState: { errors },
  } = useController({ name, control })
  const { t } = useTranslation()

  return (
    <div className={className}>
      {label && (
        <Label
          for={name}
          className="form-label"
          style={{
            fontWeight: 600,
            fontSize: '0.875rem',
            color: '#2c3e50',
            marginBottom: '0.5rem',
            display: 'block',
            letterSpacing: '0.01em',
          }}
        >
          {label}
          {required ? <Required /> : ''}
        </Label>
      )}
      <SelectWrapper $hasPrepend={!!prepend}>
        {prepend && <PrependWrapper>{prepend}</PrependWrapper>}
        <MySelect
          id={name}
          error={errors[name] && true}
          {...field}
          {...props}
          ref={(ref: any) => {
            field.ref({
              focus: () => {},
            })
          }}
        />
      </SelectWrapper>
      {errors[name] && (
        <FormFeedback style={{ display: 'block' }}>
          {t(errors?.[name]?.message as string)}
        </FormFeedback>
      )}
    </div>
  )
}

export default ControlledSelect
