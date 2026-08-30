import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import SchoolFeeDelete from '@/views/payment/schoolFees/SchoolFeeDelete'
import type { SchoolFeeType } from './SchoolFee.type'
import CommonTable from '@/@core/components/react-table/common-react-table'

const SchoolFeeTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<SchoolFeeType>[]>(
    () => [
      {
        accessorKey: 'numberOrder',
        header: () => t('label-numberOrder'),
      },
      {
        accessorKey: 'code',
        header: () => t('label-code'),
      },
      {
        accessorKey: 'name',
        header: () => t('label-name'),
      },
      {
        accessorKey: 'name2',
        header: () => t('label-name2'),
      },
      {
        accessorKey: 'mandatory',
        header: () => t('label-mandatory'),
        cell: (info) => (
          <ActiveRenderer
            active={info.getValue() as boolean}
            activeText="label.yes"
            inactiveText="label.no"
          />
        ),
      },
      {
        accessorKey: 'active',
        header: () => t('label-active'),
        cell: (info) => <ActiveRenderer active={info.getValue() as boolean} />,
      },
      {
        accessorKey: 'note',
        header: () => t('label-note'),
      },
      {
        id: 'actions',
        header: () => t('label-actions'),
        cell: ({ row: { original } }) => (
          <ActionRenderer
            params={original}
            deleteElement={<SchoolFeeDelete />}
            updateElement={<span />}
            formId="schoolFee"
            modal={props.modal}
          />
        ),
      },
    ],
    [],
  )

  return (
    <CommonTable
      data={props.dataSource!}
      columns={columns}
      onModelUpdate={(rows) => showDisplayedRowCount(rows)}
      showQuickFilter={false}
      onGlobalFilterChanged={props.onGlobalFilterChanged}
      modal={props.modal}
    />
  )
}

export default SchoolFeeTable
