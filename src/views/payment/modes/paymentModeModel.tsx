import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { PaymentModeType } from './PaymentMode.type'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import PaymentModeDelete from './PaymentModeDelete'
import { cutText } from '@/utils/helpers'
import { CreditCard, FileText, Shield, Settings } from 'lucide-react'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import { SkuText } from '@/@core/components/ui/table/table.style'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<PaymentModeType>> = useMemo(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: () => (
          <div className="flex items-center gap-0.5">
            <CreditCard size={14} className="text-primary" /> {t('label-name')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <TextWithAvatar
            letter={original.name.charAt(0)}
            title={original.name}
            titleClassName="!font-semibold text-gray-800 dark:text-gray-200"
          />
        ),
        size: 200,
      },
      {
        id: 'active',
        accessorKey: 'active',
        header: () => (
          <div className="flex items-center gap-0.5 justify-center w-full">
            <Shield size={14} /> {t('label-active')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <ActiveRenderer active={info.getValue() as boolean} />
          </div>
        ),
        size: 80,
      },
      {
        id: 'description',
        accessorKey: 'description',
        header: () => (
          <div className="flex items-center gap-0.5">
            <FileText size={14} /> {t('label-description')}
          </div>
        ),
        cell: (info) => {
          const description = info.getValue() as string
          if (!description)
            return <span className="text-gray-400 italic text-xs">---</span>
          return (
            <SkuText
              title={description}
              className="!text-gray-500 !font-normal"
            >
              {cutText(description, 100)}
            </SkuText>
          )
        },
        size: 300,
      },
      {
        id: 'actions',
        header: () => (
          <div className="flex items-center gap-0.5 justify-end w-full px-2">
            <Settings size={14} /> {t('label-actions')}
          </div>
        ),
        meta: { align: 'right' },
        cell: ({ row: { original } }) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={original}
              deleteElement={<PaymentModeDelete />}
              updateElement={<span />}
              formId="paymentMode"
              modal={modal}
            />
          </div>
        ),
        size: 80,
      },
    ],
    [modal, t],
  )

  return { columns }
}
