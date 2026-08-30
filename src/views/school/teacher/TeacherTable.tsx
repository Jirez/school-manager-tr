import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import { concat, showDisplayedRowCount } from '@/utils/helpers'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import type TeacherType from './Teacher.type'
import CommonTable from '@/@core/components/react-table/common-react-table'

interface Props extends CommonTableProps {
  onRowClicked: (data: any) => void
}

const TeacherTable: FC<Props> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<TeacherType>[]>(
    () => [
      {
        accessorFn: (row) => `${row.lastName} ${row.firstName}`,
        id: 'name',
        header: () => t('label-name'),
        cell: ({ row: { original } }) => {
          const name = concat(
            original?.lastName || '',
            original?.firstName || '',
          )
          const registrationNumber = original?.code

          return (
            <TextWithAvatar
              letter={name!.charAt(0)}
              title={name!}
              subtitle={registrationNumber}
            />
          )
        },
      },
      {
        accessorKey: 'gender',
        header: () => t('label-gender'),
        cell: (info) => (info.getValue() as string).charAt(0),
      },
      {
        accessorKey: 'function',
        header: () => t('label-function'),
      },
      {
        accessorKey: 'speciality',
        header: () => t('label-speciality'),
      },
      {
        accessorKey: 'id',
        header: 'Id',
      },
    ],
    [t],
  )

  return (
    <>
      <CommonTable
        data={props.dataSource!}
        columns={columns}
        onModelUpdate={(rows) => showDisplayedRowCount(rows)}
        showQuickFilter={true}
        onGlobalFilterChanged={props.onGlobalFilterChanged}
        onRowClicked={props.onRowClicked}
        showCheckbox={false}
        pageSize={10}
      />
    </>
  )
}

export default TeacherTable
