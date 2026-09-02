import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import { concat, showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import TeacherDelete from '@/views/school/teacher/TeacherDelete'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import type TeacherType from './Teacher.type'
import CommonTable from '@/@core/components/react-table/common-react-table'
import TeachersDelete from './TeachersDelete'
import type { AppFeatures } from '#/hooks/table'

const PersonnelTable: FC<CommonTableProps> = (props) => {
  const [checkedRows, setCheckedRows] = useState<any[]>([])
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<AppFeatures, TeacherType>[]>(
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
        accessorKey: 'currentPost',
        header: () => t('label-currentPost'),
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
        accessorKey: 'status',
        header: () => t('label-status'),
        cell: (info) => t(info.getValue() as string),
      },
      {
        accessorKey: 'active',
        header: () => t('label-active'),
        cell: (info) => <ActiveRenderer active={info.getValue() as boolean} />,
      },
      {
        accessorFn: (row) => row.__typename,
        id: 'type',
        header: () => t('label-type'),
        cell: (info) => t(info.getValue() as string),
      },
      {
        accessorKey: 'id',
        id: 'id',
        header: 'Id',
      },
      {
        id: 'actions',
        header: () => t('label-actions'),
        cell: ({ row: { original } }) => (
          <ActionRenderer
            params={original}
            deleteElement={<TeacherDelete />}
            updateElement={<span />}
            formId="teacher"
            modal={props.modal}
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
          <TeachersDelete
            ids={checkedRows.map(({ original }) => original.id)}
            count={checkedRows.length}
          />
        </div>
      )}
      <CommonTable
        data={props.dataSource!}
        columns={columns}
        onModelUpdate={(rows) => showDisplayedRowCount(rows)}
        showQuickFilter={false}
        onGlobalFilterChanged={props.onGlobalFilterChanged}
        rowSelection={props.rowSelection}
        onRowSelected={(row) => setCheckedRows(row)}
        loading={props.loading}
      />
    </>
  )
}

export default PersonnelTable
