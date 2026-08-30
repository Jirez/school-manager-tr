import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { OperationClassType } from './operation.class.type'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import OperationClassDelete from './OperationClassDelete'
import { cutText } from '@/utils/helpers'
import { Layers, CheckCircle } from 'lucide-react'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<OperationClassType>> = useMemo(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Layers size={14} className="text-primary" /> {t('label-name')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <TextWithAvatar
            letter={original.name.charAt(0)}
            title={original.name}
            titleClassName="!font-semibold"
            subtitle={
              original.description ? cutText(original.description, 40) : ''
            }
          />
        ),
        size: 300,
      },
      {
        id: 'active',
        accessorKey: 'active',
        header: () => (
          <div className="flex items-center gap-0.5 justify-center w-full">
            <CheckCircle size={14} /> {t('label-active')}
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
        id: 'actions',
        header: () => <div className="text-right">{t('label-actions')}</div>,
        cell: (info) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={info.row.original}
              deleteElement={<OperationClassDelete />}
              updateElement={<span />}
              formId="operationClass"
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
