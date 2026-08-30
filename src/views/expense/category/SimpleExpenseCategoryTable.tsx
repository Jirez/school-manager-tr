import { useMemo } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import CommonTable from '@/@core/components/react-table/common-react-table'
import type { ExpenseCategoryType } from './expense.category.type'

interface Props extends CommonTableProps {
  onRowClicked: (data: any) => void
  onAddButtonClick?: () => void
  initialFilter?: string
}

const SimpleExpenseCategoryTable: FC<Props> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<ExpenseCategoryType>[]>(
    () => [
      {
        header: `${t('label-name')}`,
        accessorKey: 'name',
        cell: (info) => (
          <span className="font-semibold">{info.getValue() as string}</span>
        ),
      },
      {
        header: `${t('label-account')}`,
        accessorFn: (row) => row.account?.name,
      },
      {
        header: `${t('label-description')}`,
        accessorKey: 'description',
      },
    ],
    [t, props.modal],
  )

  return (
    <CommonTable
      data={props.dataSource!}
      columns={columns}
      showQuickFilter={true}
      onGlobalFilterChanged={props.onGlobalFilterChanged}
      modal={props.modal}
      showCheckbox={false}
      onRowClicked={props.onRowClicked}
      pageSize={15}
      initialFilter={props.initialFilter}
    />
  )
}

export default SimpleExpenseCategoryTable
