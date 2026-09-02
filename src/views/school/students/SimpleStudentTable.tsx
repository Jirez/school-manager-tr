import { useMemo, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { ColumnDef } from '@tanstack/react-table'

import { concat } from '@/utils/helpers'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import type { TStudent } from './StudentTable'
import CommonTable from '@/@core/components/react-table/common-react-table'
import type { AppFeatures } from '#/hooks/table'

interface Props extends CommonTableProps {
  onRowClicked: (data: any) => void
  onAddButtonClick?: () => void
}

const SimpleStudentTable: FC<Props> = (props) => {
  const [currentRows, setCurrentRows] = useState<number>(0)
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<AppFeatures, TStudent>[]>(
    () => [
      {
        accessorKey: 'registrationNumber',
        header: () => t('label-registrationNumber'),
      },
      {
        accessorFn: (row) => `${row.lastName} ${row.firstName}`,
        id: 'studentName',
        header: () => t('label-names'),
        cell: ({ row: { original } }) => {
          const name = concat(
            original?.lastName || '',
            original?.firstName || '',
          )
          const registrationNumber = original?.registrationNumber

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
        cell: (info) => (info.getValue() as string)?.charAt(0),
      },
      {
        accessorKey: 'birthDate',
        header: () => t('label-birthDate'),
        cell: (info) => dayjs(info.getValue() as string).format('DD MMM YYYY'),
      },
      {
        accessorKey: 'birthplace',
        header: () => t('label-birthplace'),
      },
      {
        id: 'age',
        header: () => t('label-age'),
        cell: ({ row: { original } }) =>
          dayjs().diff(dayjs(original?.birthDate), 'years'),
      },
      /* table.createDataColumn('id', {
            id: 'id',
            header: 'Id'
        }), */
    ],
    [],
  )

  //console.log(currentRows);

  return (
    <div className="text-sm">
      <CommonTable
        data={props.dataSource!}
        columns={columns}
        onModelUpdate={(rows) => {
          setCurrentRows(rows.length)
          //showDisplayedRowCount(rows)
        }}
        showQuickFilter={true}
        onGlobalFilterChanged={props.onGlobalFilterChanged}
        showCheckbox={false}
        onRowClicked={props.onRowClicked}
        pageSize={10}
        showAddButton={currentRows === 0}
        onAddButtonClick={props.onAddButtonClick}
      />
    </div>
  )
}

export default SimpleStudentTable
