import type { ChangeEvent } from 'react'
import type { AnyFieldApi } from '@tanstack/react-form'
import type { PermissionItemItem } from './role.type'
import { StyledCheckbox } from '@/@core/components/ui/styled-checkbox'
import { m } from '@/paraglide/messages'
import { translateMessage } from '@/utils/helpers'

interface RoleItemProps {
  nestIndex: number
  groupName: string
  field: AnyFieldApi
}

const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(' ')

const COLORS = [
  {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-700 dark:text-orange-300',
    badge: 'bg-orange-500 text-white',
    checkboxActive: 'bg-orange-500 border-orange-500 hover:bg-orange-600',
    countBadge:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  },
  {
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    text: 'text-teal-700 dark:text-teal-300',
    badge: 'bg-teal-500 text-white',
    checkboxActive: 'bg-teal-500 border-teal-500 hover:bg-teal-600',
    countBadge:
      'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  },
  {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-300',
    badge: 'bg-blue-500 text-white',
    checkboxActive: 'bg-blue-500 border-blue-500 hover:bg-blue-600',
    countBadge:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  {
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    text: 'text-indigo-700 dark:text-indigo-300',
    badge: 'bg-indigo-500 text-white',
    checkboxActive: 'bg-indigo-500 border-indigo-500 hover:bg-indigo-600',
    countBadge:
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  },
]

const RoleItem = ({ nestIndex, groupName, field }: RoleItemProps) => {
  const currentItems = (field.state.value ?? []) as PermissionItemItem[]
  const checkedCount = currentItems.filter((item) => item.checked).length
  const totalCount = currentItems.length
  const isAllChecked = totalCount > 0 && checkedCount === totalCount
  const isIndeterminate = checkedCount > 0 && !isAllChecked

  const colorScheme = COLORS[nestIndex % COLORS.length]

  const handleToggleAll = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    currentItems.forEach((item, index) => {
      void field.replaceValue(index, { ...item, checked })
    })
  }

  const handleToggleItem = (index: number, checked: boolean) => {
    void field.replaceValue(index, { ...currentItems[index], checked })
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-all hover:shadow-md">
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between px-2 py-1',
          colorScheme.bg,
        )}
      >
        <div className="flex items-center gap-1">
          <span
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-lg text-sm font-bold shadow-sm',
              colorScheme.badge,
            )}
          >
            {nestIndex + 1}
          </span>
          <span className={cn('font-bold', colorScheme.text)}>
            {translateMessage(groupName)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span
            className={cn(
              'px-2 py-0.5 rounded-md text-xs font-bold',
              colorScheme.countBadge,
            )}
          >
            {checkedCount}/{totalCount}
          </span>
          <StyledCheckbox
            checked={isAllChecked}
            indeterminate={isIndeterminate}
            onChange={handleToggleAll}
            activeColorClass={colorScheme.checkboxActive}
            title={m.label_checkAllPermissions()}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-2">
        <div className="flex flex-col gap-1">
          {currentItems.map((item, index) => (
            <label
              key={item.id}
              className="group flex cursor-pointer items-center gap-1 rounded-lg px-3 py-0.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div className="relative flex items-center">
                <StyledCheckbox
                  checked={item.checked}
                  onChange={(event) =>
                    handleToggleItem(index, event.target.checked)
                  }
                  activeColorClass="bg-primary border-primary hover:bg-primary/90 text-white"
                />
              </div>

              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                {translateMessage(item.code)}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RoleItem
