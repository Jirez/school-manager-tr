import React from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import SubjectDepartmentDelete from './SubjectDepartmentDelete'
import CommonTable from '@/@core/components/react-table/common-react-table'
import { showDisplayedRowCount } from '@/utils/helpers'

interface IDepartment {
  id: number
  code: string
  name: string
  active: boolean
  schoolSection: any
}

const DepartmentTable: React.FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = React.useMemo<ColumnDef<IDepartment>[]>(
    () => [
      /* {
            accessorKey: 'code',
            id: 'code',
            header: () => t('label-code')
        }, */
      {
        accessorKey: 'name',
        header: () => t('label-name'),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'active',
        id: 'active',
        header: () => t('label-active'),
        cell: (info) => <ActiveRenderer active={info.getValue() as boolean} />,
      },
      {
        accessorFn: (row) => row.schoolSection.name,
        id: 'schoolSection',
        header: () => t('label-schoolSection'),
        footer: () => t('label-schoolSection'),
        enableGlobalFilter: true,
      },
      {
        accessorFn: (row) => `${row.name} ${row.schoolSection.name}`,
        id: 'searchText',
        enableHiding: false,
      },
      {
        id: 'actions',
        header: () => t('label-actions'),
        enableHiding: false,
        cell: (info) => (
          <ActionRenderer
            params={info.row.original}
            deleteElement={<SubjectDepartmentDelete />}
            updateElement={<span />}
            formId="department"
            modal={props.modal}
          />
        ),
      },
    ],
    [],
  )

  // const [columns] = React.useState<typeof defaultColumns>(() => [...defaultColumns,])

  return (
    <CommonTable
      columns={columns}
      data={props.dataSource!}
      onGlobalFilterChanged={props.onGlobalFilterChanged}
      onModelUpdate={(rows: any[]) => showDisplayedRowCount(rows)}
    />
  )
}

export default DepartmentTable
