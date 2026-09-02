import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import CommonTable from '@/@core/components/react-table/common-react-table'
import type { DeductionType } from './deduction.type'
import type { AppFeatures } from '#/hooks/table'

interface Props extends CommonTableProps {
  onRowClicked: (data: any) => void
  onAddButtonClick?: () => void
  initialFilter?: string
}

const SimpleDeductionTable: FC<Props> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<AppFeatures, DeductionType>[]>(
    () => [
      {
        header: `${t('label-name')}`,
        accessorKey: 'name',
        cell: (info) => (
          <span className="font-semibold">{info.getValue() as string}</span>
        ),
      },
      {
        header: `${t('label-category')}`,
        accessorFn: (row) => row.category?.name,
      },
      {
        header: `${t('label-calculationType')}`,
        accessorFn: (row) => t(row.calculationType),
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

export default SimpleDeductionTable
