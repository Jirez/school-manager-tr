import { type InputProps } from 'reactstrap'
import { useId } from 'react'
import styled, { css } from 'styled-components'
import { motion } from 'motion/react'
import { useFieldContext } from '@/hooks/form/form-context'
import { useStore } from '@tanstack/react-form'

interface Props extends Omit<InputProps, 'type'> {
  label: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const trackSizes = {
  sm: { width: '36px', height: '20px', knob: '14px', translate: '16px' },
  md: { width: '44px', height: '24px', knob: '18px', translate: '20px' },
  lg: { width: '56px', height: '30px', knob: '22px', translate: '26px' },
}

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
`

const Track = styled(motion.div)<{
  $active: boolean
  $size: 'sm' | 'md' | 'lg'
  $hasError: boolean
}>`
  position: relative;
  width: ${(props) => trackSizes[props.$size].width};
  height: ${(props) => trackSizes[props.$size].height};
  border-radius: 999px;
  padding: 3px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;

  ${(props) =>
    props.$active
      ? css`
          background: linear-gradient(135deg, #2f8724 0%, #45a039 100%);
          box-shadow: 0 4px 12px rgba(47, 135, 36, 0.25);
        `
      : css`
          background: rgba(180, 183, 189, 0.2);
          border: 1px solid rgba(180, 183, 189, 0.3);

          .dark-layout & {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
          }
        `}

  ${(props) =>
    props.$hasError &&
    css`
      border-color: #ea5455;
      background: rgba(234, 84, 85, 0.1);
    `}

  &:hover {
    ${(props) =>
      props.$active
        ? css`
            box-shadow: 0 6px 16px rgba(47, 135, 36, 0.35);
          `
        : css`
            background: rgba(180, 183, 189, 0.3);
          `}
  }
`

const Knob = styled(motion.div)<{
  $size: 'sm' | 'md' | 'lg'
  $active: boolean
}>`
  width: ${(props) => trackSizes[props.$size].knob};
  height: ${(props) => trackSizes[props.$size].knob};
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0.5) 100%
    );
    opacity: ${(props) => (props.$active ? 1 : 0)};
    transition: opacity 0.3s ease;
  }
`

const Label = styled.label<{
  $size: 'sm' | 'md' | 'lg'
  $active: boolean
  $hasError: boolean
}>`
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  font-size: ${(props) =>
    props.$size === 'sm'
      ? '0.85rem'
      : props.$size === 'md'
        ? '0.95rem'
        : '1.1rem'};

  color: ${(props) =>
    props.$hasError ? '#ea5455' : props.$active ? '#2c3e50' : '#6e6b7b'};

  .dark-layout & {
    color: ${(props) =>
      props.$hasError ? '#ea5455' : props.$active ? '#e4e6eb' : '#b4b7bd'};
  }

  &:hover {
    color: ${(props) => (props.$active ? '#2f8724' : '#45a039')};
  }
`

const HiddenInput = styled.input`
  display: none;
`

const Switch = ({
  name,
  label,
  className = '',
  size = 'md',
  ...props
}: Props) => {
  const uniqueId = useId()
  const inputId = `switch-${name}-${uniqueId}`

  const field = useFieldContext<boolean>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  const hasError = !!errors[name]
  const isChecked = field.state.value === true

  return (
    <SwitchContainer className={className}>
      <HiddenInput
        type="checkbox"
        id={inputId}
        checked={isChecked}
        onChange={(e) => {
          field.handleChange(e.target.checked)
          props.onChange?.(e)
        }}
        onBlur={field.handleBlur}
        {...props}
      />
      <Track
        $size={size}
        $active={isChecked}
        $hasError={hasError}
        onClick={() => {
          field.handleChange(!isChecked)
        }}
      >
        <Knob
          $size={size}
          $active={isChecked}
          animate={{
            x: isChecked ? trackSizes[size].translate : '0px',
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        />
      </Track>
      <Label
        htmlFor={inputId}
        $size={size}
        $active={isChecked}
        $hasError={hasError}
      >
        {label}
      </Label>
    </SwitchContainer>
  )
}

export default Switch
