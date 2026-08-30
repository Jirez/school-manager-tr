import type { FC } from 'react'
import type { Control } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'
import { Label } from 'reactstrap'

interface RadioOption {
  value: string
  label: string
  icon?: React.ReactNode
}

interface RadioGroupProps {
  name: string
  control: Control<any>
  options: RadioOption[]
  label?: string
  className?: string
  required?: boolean
}

const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
  margin-bottom: 0.5rem;
`

const StyledLabel = styled(Label)`
  margin-bottom: 0.25rem !important;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;

  .dark-layout & {
    color: #d1d5db;
  }
`

const OptionsWrapper = styled.div`
  display: flex;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 10px;
  gap: 0.25rem;
  width: 100%;
  max-width: fit-content;

  .dark-layout & {
    background: #1b1e2b;
  }

  @media (max-width: 576px) {
    max-width: 100%;
  }
`

const OptionCard = styled.label<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 500;

  color: ${({ $isActive }) => ($isActive ? '#7367f0' : '#6e6b7b')};
  background: ${({ $isActive }) => ($isActive ? '#ffffff' : 'transparent')};
  box-shadow: ${({ $isActive }) =>
    $isActive ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'};

  .dark-layout & {
    color: ${({ $isActive }) => ($isActive ? '#ffffff' : '#b4b7bd')};
    background: ${({ $isActive }) => ($isActive ? '#283046' : 'transparent')};
    box-shadow: ${({ $isActive }) =>
      $isActive ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'};
  }

  &:hover {
    color: ${({ $isActive }) => ($isActive ? '#7367f0' : '#374151')};

    .dark-layout & {
      color: ${({ $isActive }) => ($isActive ? '#ffffff' : '#d1d5db')};
    }
  }

  input {
    display: none;
  }

  svg {
    width: 16px;
    height: 16px;
    opacity: ${({ $isActive }) => ($isActive ? 1 : 0.7)};
  }
`

const RadioGroup: FC<RadioGroupProps> = ({
  name,
  control,
  options,
  label,
  className,
  required,
}) => {
  const { field } = useController({
    name,
    control,
  })
  const { t } = useTranslation()

  return (
    <GroupContainer className={className}>
      {label && (
        <StyledLabel className="form-label">
          {label}
          {required && <span className="text-danger ms-25">*</span>}
        </StyledLabel>
      )}
      <OptionsWrapper>
        {options.map((option) => (
          <OptionCard
            key={option.value}
            $isActive={field.value === option.value}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={field.value === option.value}
              onChange={() => field.onChange(option.value)}
            />
            {option.icon}
            <span>{t(option.label)}</span>
          </OptionCard>
        ))}
      </OptionsWrapper>
    </GroupContainer>
  )
}

export default RadioGroup
