import { useMemo, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from 'reactstrap'
import dayjs from 'dayjs'
import type { ColumnDef } from '@tanstack/react-table'

import { concat, showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import StudentDelete from '@/views/school/students/StudentDelete'
import StudentsDelete from './StudentsDelete'
import CommonTable from '@/@core/components/react-table/common-react-table'
import type { AppFeatures } from '#/hooks/table'

export type TStudent = {
  id: number
  lastName: string
  firstName?: string
  gender: string
  registrationNumber: string
  birthDate: string
  birthplace: string
}

const StudentTable: FC<CommonTableProps> = (props) => {
  const [checkedRows, setCheckedRows] = useState<any[]>([])
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<AppFeatures, TStudent>[]>(
    () => [
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
      {
        accessorFn: (row) => `${row.id}`,
        id: 'id',
        header: 'Id',
      },
      {
        id: 'actions',
        header: () => t('label-actions'),
        cell: ({ row: { original } }) => (
          <ActionRenderer
            params={original}
            deleteElement={<StudentDelete />}
            updateElement={<span />}
            formId="student"
            modal={props.modal}
            refetch={props.refetch}
          />
        ),
      },
    ],
    [t, props.modal],
  )

  return (
    <>
      {checkedRows.length > 0 && (
        <div className="mb-1">
          <StudentsDelete
            ids={checkedRows.map(({ original }) => original.id)}
            count={checkedRows.length}
          />
        </div>
      )}
      <Card>
        <CommonTable
          data={props.dataSource!}
          columns={columns}
          onModelUpdate={(rows) => showDisplayedRowCount(rows)}
          showQuickFilter={false}
          onGlobalFilterChanged={props.onGlobalFilterChanged}
          onRowSelected={(row) => setCheckedRows(row)}
          loading={props.loading}
        />
      </Card>
    </>
  )
}

export default StudentTable
