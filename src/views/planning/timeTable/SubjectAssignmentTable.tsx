import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import CommonTable from '#/@core/components/react-table/common-react-table'

interface Props extends CommonTableProps {
  onRowClicked: (data: any) => void
  onAddButtonClick?: () => void
  initialFilter?: string
}

interface TableType {
  subjectId: number
  subjectName: string
  teacherId: number
  teacherName: string
}

const SubjectAssignmentTable: FC<Props> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<TableType>[]>(
    () => [
      {
        header: `${t('label-subject')}`,
        accessorKey: 'subjectName',
        cell: (info) => (
          <span className="font-semibold">{info.getValue() as string}</span>
        ),
      },
      {
        header: `${t('label-teacher')}`,
        accessorFn: (row) => row.teacherName,
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

export default SubjectAssignmentTable
