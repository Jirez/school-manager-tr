import { createFormHook } from '@tanstack/react-form'
import type { SubmitEventHandler } from 'react'
import { lazy } from 'react'
import { fieldContext, formContext, useFormContext } from './form-context'

const Input = lazy(() => import('@components/ui/ts-form/input'))
const Switch = lazy(() => import('@components/ui/ts-form/switch'))
const ControlledSelect = lazy(
  () => import('@components/ui/ts-form/controlled-select'),
)
const NumericInput = lazy(() => import('@components/ui/ts-form/numeric-input'))
const InputPasswordToggle = lazy(
  () => import('@components/ui/ts-form/input-password-toggle'),
)
const ActionButtons = lazy(() => import('@components/ui/forms/action-buttons'))

function SubmitButton({
  cancelAction,
  popover,
  onSubmit,
}: {
  cancelAction?: () => void
  isSubmitting?: boolean
  popover?: boolean
  dirty?: boolean
  onSubmit?: (e: SubmitEventHandler<HTMLFormElement>, meta: FormMeta) => void
}) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state}>
      {(state) => (
        <ActionButtons
          cancelAction={cancelAction}
          isSubmitting={state.isSubmitting}
          popover={popover}
          dirty={state.isDirty}
          onSubmit={(e, close) => onSubmit?.(e, { close })}
        />
      )}
    </form.Subscribe>
  )
}

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  formComponents: {
    SubmitButton,
  },
  fieldComponents: {
    Input,
    Switch,
    ControlledSelect,
    NumericInput,
    InputPasswordToggle,
  },
  fieldContext,
  formContext,
})

export type FormMeta = {
  close: Boolean
}

export const defaultMeta: FormMeta = {
  close: false,
}
