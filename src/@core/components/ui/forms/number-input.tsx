import type { FC } from 'react'
import Cleave from 'cleave.js/react'
import { useController } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { FormFeedback, Label } from 'reactstrap'
import { useTranslation } from 'react-i18next'

import Required from './required'

interface NumberInputProps {
  label?: string
  name: string
  control: Control<any>
  className?: string
  required?: boolean
}

const NumberInput: FC<NumberInputProps> = ({
  name,
  control,
  className = 'mb-1',
  label,
  required = false,
}) => {
  const {
    field,
    formState: { errors },
  } = useController({ control, name })
  const { t } = useTranslation()
  // const options = { numeral: true, numeralThousandsGroupStyle: 'thousand' }

  return (
    <div className={className}>
      <Label
        for={name}
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
      <Cleave
        className="form-control"
        options={{
          numeral: true,
          numeralThousandsGroupStyle: 'thousand',
        }}
        id={name}
        {...field}
      />
      {errors[name] && (
        <FormFeedback>{t(errors?.[name]?.message as string)}</FormFeedback>
      )}
    </div>
  )
}

export default NumberInput
