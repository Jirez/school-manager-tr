import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import PaymentConditionDelete from './PaymentConditionDelete'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { PaymentConditionType } from './payment.condition.type'
import type { AppFeatures } from '#/hooks/table'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, PaymentConditionType>> = useMemo(
    () => [
      {
        header: `${t('label-name')}`,
        accessorKey: 'name',
      },
      {
        header: `${t('label-delayDays')}`,
        accessorKey: 'days',
      },
      {
        header: `${t('label-active')}`,
        accessorKey: 'active',
        cell: ({ row: { original } }: any) => (
          <ActiveRenderer active={original.active} />
        ),
      },
      {
        header: `${t('label-description')}`,
        accessorKey: 'description',
      },
      {
        header: 'Actions',
        accessor: 'id',
        cell: ({ row: { original } }) => (
          <ActionRenderer
            params={original}
            deleteElement={<PaymentConditionDelete />}
            updateElement={<span />}
            formId="paymentCondition"
            modal={modal}
          />
        ),
      },
    ],
    [modal, t],
  )

  return { columns }
}
