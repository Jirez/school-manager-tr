import type { FC } from 'react'
import { useState } from 'react'
import useConfirm from '@/@core/components/confirm/useConfirm'
import { useTranslation } from 'react-i18next'
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown,
  Spinner,
} from 'reactstrap'
import { useKeyPress, useSize } from 'ahooks'
// import { useHotkeys } from "react-hotkeys-hook";
import { Save, X, ChevronDown } from 'lucide-react'
import styled, { css } from 'styled-components'
import { motion } from 'motion/react'

interface ActionButtonsProps {
  cancelAction?: () => void
  deleteBackup?: () => void
  saveLabel?: string
  saveCloseLabel?: string
  isSubmitting?: boolean
  cancelLoading?: boolean
  disabled?: boolean
  dirty?: boolean
  popover?: boolean
  onSubmit?: (e: any, close: boolean) => void
  fixed?: boolean
}

const ButtonGroup = styled.div<{ $atBottom?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
  margin-top: ${(props) => (props.$atBottom ? '2rem' : '0.5rem')};
`

const BaseButton = styled(motion.button)<{
  $variant: 'danger' | 'primary' | 'secondary'
  $outline?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  outline: none !important;

  ${(props) =>
    props.$variant === 'danger' &&
    css`
      background: rgba(234, 84, 85, 0.1);
      color: #ea5455;
      border-color: rgba(234, 84, 85, 0.2);
      &:hover {
        background: #ea5455;
        color: white;
        box-shadow: 0 4px 12px rgba(234, 84, 85, 0.3);
      }
    `}

  ${(props) =>
    props.$variant === 'primary' &&
    css`
      background: linear-gradient(135deg, #7367f0 0%, #8b7ff0 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(115, 103, 240, 0.2);

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
      }
    `}

    ${(props) =>
      props.$variant === 'secondary' &&
      css`
        background: rgba(180, 183, 189, 0.15);
        color: #6e6b7b;
        border-color: rgba(180, 183, 189, 0.2);

        .dark-layout & {
          background: rgba(255, 255, 255, 0.1);
          color: #b4b7bd;
          border-color: rgba(255, 255, 255, 0.1);
        }

        &:hover {
          background: rgba(180, 183, 189, 0.25);
          color: #2c3e50;

          .dark-layout & {
            background: rgba(255, 255, 255, 0.15);
            color: white;
          }
        }
      `}
`

const SplitButtonGroupWrapper = styled(motion.div)`
  display: inline-flex;
  align-items: stretch;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(115, 103, 240, 0.2);

  &:hover:not(:has(button:disabled)) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(115, 103, 240, 0.3);
  }
`

const SplitButtonGroup = styled(UncontrolledButtonDropdown)`
  display: flex !important;
  align-items: stretch;

  .btn-primary {
    background: linear-gradient(135deg, #7367f0 0%, #8b7ff0 100%) !important;
    border: none !important;
    border-top-left-radius: 10px !important;
    border-bottom-left-radius: 10px !important;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    padding-right: 1.25rem !important;
    box-shadow: none !important; // Controlled by wrapper

    &:hover {
      filter: brightness(1.05);
    }
  }

  .dropdown-toggle-split {
    background: linear-gradient(135deg, #7367f0 0%, #8b7ff0 100%) !important;
    border: none !important;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-top-right-radius: 10px !important;
    border-bottom-right-radius: 10px !important;
    border-left: 1px solid rgba(255, 255, 255, 0.2) !important;
    padding: 0 0.6rem !important;
    margin-left: 0 !important;
    box-shadow: none !important;

    &::after {
      display: none !important;
    }

    &:hover {
      filter: brightness(1.1);
    }
  }

  .dropdown-menu {
    border-radius: 12px;
    border: 1px solid rgba(115, 103, 240, 0.1);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    padding: 0.5rem;
    margin-top: 8px !important;

    .dropdown-item {
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.2s ease;
      &:hover {
        background: rgba(115, 103, 240, 0.08);
        color: #7367f0;
      }
    }
  }
`

const ActionButtons: FC<ActionButtonsProps> = ({
  dirty = true,
  cancelLoading = false,
  popover = false,
  fixed = false,
  saveCloseLabel,
  ...props
}) => {
  const { confirm } = useConfirm()
  const { t } = useTranslation()
  const [defaultButton, setDefaultButton] = useState<boolean>(
    localStorage.getItem('eps_school_button') === 'true' || false,
  )
  const size = useSize(document.querySelector('body'))
  const atBottom = fixed || (size && size.width <= 400)

  useKeyPress(
    'ctrl + alt + c',
    () => {
      document.getElementById('cancelAction')?.click()
    },
    // { enableOnContentEditable: true }
  )

  const isLoading = props.isSubmitting || false

  return (
    <ButtonGroup $atBottom={atBottom}>
      <BaseButton
        id="cancelAction"
        type="button"
        $variant="danger"
        whileTap={{ scale: 0.97 }}
        onClick={async () => {
          if (dirty) {
            const isConfirmed = await confirm(t('label-onFormCancel'))
            if (isConfirmed) {
              props.cancelAction?.()
              props.deleteBackup?.()
            }
          } else {
            props.cancelAction?.()
          }
        }}
      >
        {cancelLoading ? (
          <Spinner size="sm" />
        ) : (
          <X size={16} strokeWidth={2.5} />
        )}
        {t('label-cancel')}
      </BaseButton>

      <div className="flex items-center">
        {popover ? (
          <BaseButton
            type="submit"
            $variant="primary"
            whileTap={{ scale: 0.97 }}
            disabled={props.disabled || isLoading}
            onClick={(e) => props.onSubmit?.(e, true)}
            style={{
              boxShadow: '0 4px 12px rgba(115, 103, 240, 0.2)',
            }}
            whileHover={{
              y: -2,
              boxShadow: '0 8px 20px rgba(115, 103, 240, 0.3)',
            }}
          >
            {isLoading ? (
              <Spinner size="sm" />
            ) : (
              <Save size={16} strokeWidth={2.5} />
            )}
            {props.saveLabel
              ? props.saveLabel
              : popover
                ? t('label-add')
                : t('label-save')}
          </BaseButton>
        ) : (
          <SplitButtonGroupWrapper whileTap={{ scale: 0.97 }}>
            <SplitButtonGroup>
              <BaseButton
                type="button"
                $variant="primary"
                className="btn btn-primary"
                disabled={props.disabled || isLoading}
                onClick={(event) => props.onSubmit?.(event, defaultButton)}
              >
                {isLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <Save size={16} strokeWidth={2.5} />
                )}
                {defaultButton
                  ? saveCloseLabel || t('label-saveClose')
                  : t('label-save')}
              </BaseButton>
              <DropdownToggle
                className="dropdown-toggle-split text-white"
                caret
                tag="button"
                disabled={props.disabled || isLoading}
                onClick={(event) => event.preventDefault()}
              >
                <ChevronDown size={14} strokeWidth={3} />
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem
                  onClick={(event: any) => {
                    props.onSubmit?.(event, !defaultButton)
                    localStorage.setItem(
                      'eps_school_button',
                      String(!defaultButton),
                    )
                    setDefaultButton(!defaultButton)
                  }}
                >
                  {!defaultButton
                    ? saveCloseLabel || t('label-saveClose')
                    : t('label-save')}
                </DropdownItem>
              </DropdownMenu>
            </SplitButtonGroup>
          </SplitButtonGroupWrapper>
        )}
      </div>
    </ButtonGroup>
  )
}

export const UpdateActionButtons: FC<ActionButtonsProps> = ({
  dirty = true,
  ...props
}) => {
  const { confirm } = useConfirm()
  const { t } = useTranslation()

  return (
    <ButtonGroup>
      <BaseButton
        $variant="secondary"
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={async () => {
          if (dirty) {
            const isConfirmed = await confirm(t('label-onFormCancel'))
            if (isConfirmed) {
              props.cancelAction?.()
            }
          } else {
            props.cancelAction?.()
          }
        }}
      >
        <X size={16} strokeWidth={2.5} />
        {t('label-cancel')}
      </BaseButton>

      <BaseButton
        $variant="primary"
        type="submit"
        whileTap={{ scale: 0.97 }}
        disabled={props.isSubmitting}
        whileHover={{ y: -2, boxShadow: '0 8px 18px rgba(115, 103, 240, 0.3)' }}
      >
        {props.isSubmitting ? (
          <Spinner size="sm" />
        ) : (
          <Save size={16} strokeWidth={2.5} />
        )}
        {props.saveLabel ? props.saveLabel : t('label-save')}
      </BaseButton>
    </ButtonGroup>
  )
}

export default ActionButtons
