import type { FC } from 'react'
import { showDisplayedRowCount } from '@/utils/helpers'
import CommonTable from '@/@core/components/react-table/common-react-table'
import { useTableColumns } from './councilDecisionModel'

const CouncilDecisionTable: FC<CommonTableProps> = (props) => {
  const { columns } = useTableColumns(props.modal)

  return (
    <CommonTable
      data={props.dataSource!}
      columns={columns}
      onModelUpdate={(rows) => showDisplayedRowCount(rows)}
      showQuickFilter={false}
      onGlobalFilterChanged={props.onGlobalFilterChanged}
    />
  )
}

export default CouncilDecisionTable
