import type { FC } from 'react'
import { showDisplayedRowCount } from '@/utils/helpers'
import CommonTable from '@/@core/components/react-table/common-react-table'
import { useTableColumns } from './schoolSectionModel'

const SchoolSectionTable: FC<CommonTableProps> = (props) => {
  const { columns } = useTableColumns(props.modal)

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

export default SchoolSectionTable
