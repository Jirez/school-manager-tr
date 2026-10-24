import type { FC } from 'react'
// import { useTranslation } from 'react-i18next'

import { showDisplayedRowCount } from '@/utils/helpers'
import CommonTable from '@/@core/components/react-table/common-react-table'
import { useTableColumns } from './deductionModel'

const DeductionTable: FC<CommonTableProps> = (props) => {
  // const { t } = useTranslation()
  const { columns } = useTableColumns(props.modal)

  return (
    <CommonTable
      data={props.dataSource!}
      columns={columns}
      onModelUpdate={(rows) => showDisplayedRowCount(rows)}
      showQuickFilter={false}
      onGlobalFilterChanged={props.onGlobalFilterChanged}
      modal={props.modal}
      loading={props.loading}
      error={props.error}
      onRetry={props.refetch}
    />
  )
}

export default DeductionTable
