import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import { concat, showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import ClassDelete from '@/views/school/classes/ClassDelete'
import type { ClassType } from './Class.type'
import CommonTable from '@/@core/components/react-table/common-react-table'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'

const ClassTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<ClassType>[]>(
    () => [
      {
        header: () => t('label-name'),
        accessorKey: 'name',
      },
      {
        accessorKey: 'competenceClass',
        header: () => t('label-competenceClass'),
        cell: (info) => (
          <ActiveRenderer
            active={info.getValue() as boolean}
            inactiveText="label.no"
            activeText="label.yes"
          />
        ),
      },
      {
        id: 'headTeacher',
        accessorFn: (row) => row.headTeacher?.lastName,
        header: () => t('label-headTeacher'),
        cell: (info) => {
          const headTeacher = info.row.original?.headTeacher
          return headTeacher ? (
            <span>{concat(headTeacher.lastName, headTeacher.firstName)}</span>
          ) : (
            ''
          )
        },
      },
      {
        id: 'branch',
        header: () => t('label-branch'),
        accessorFn: (row) => row.branch.name,
      },
      {
        id: 'level',
        header: () => t('label-level'),
        accessorFn: (row) => row.branch.level.name,
      },
      {
        id: 'cycle',
        header: () => t('label-cycle'),
        accessorFn: (row) => row.branch.level.cycle.name,
      },
      {
        header: 'Id',
        accessorKey: 'id',
      },
      {
        id: 'actions',
        header: () => t('label-actions'),
        cell: (info) => (
          <ActionRenderer
            params={info.row.original}
            deleteElement={<ClassDelete />}
            updateElement={<span />}
            formId="clazz"
            modal={props.modal}
          />
        ),
      },
    ],
    [t, props.modal],
  )

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

export default ClassTable
