import type { FC } from 'react'
import { useMemo } from 'react'
import { Badge } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import SubjectGroupDelete from '@/views/school/subjectGroups/SubjectGroupDelete'
import CommonTable from '@/@core/components/react-table/common-react-table'
import type { AppFeatures } from '#/hooks/table'

type TSubjectGroup = {
  branch: {
    name: string
    id: number
  }
  subjectGroups: any[]
}

const SubjectGroupTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<AppFeatures, TSubjectGroup>[]>(
    () => [
      {
        accessorFn: (row) => row.branch.name,
        id: 'branch',
        header: () => t('label-branch'),
      },
      {
        id: 'subjectGroups',
        header: () => t('label-groups'),
        cell: (info) => {
          const groups = info.row.original?.subjectGroups || []
          return (
            <div className="flex flex-row gap-1">
              {groups.map(({ name }: any) => {
                let color = name.length > 5 ? 'secondary' : 'light-success'

                return (
                  <Badge color={color} key={name} className="badge-glow" pill>
                    {name}
                  </Badge>
                )
              })}
            </div>
          )
        },
      },
      {
        id: 'subjectCount',
        header: () => t('label-subjectCount'),
        cell: (info) => {
          const groups = info.row.original?.subjectGroups || []
          const count = groups
            .map(({ subjectGroupItemCollection }: any) => {
              return subjectGroupItemCollection.length
            })
            .reduce((a: number, b: number) => a + b)

          return <span>{count}</span>
        },
      },
      {
        id: 'actions',
        header: () => t('label-actions'),
        cell: (info) => (
          <ActionRenderer
            params={info.row.original}
            deleteElement={<SubjectGroupDelete />}
            updateElement={<span />}
            formId="groups"
            deleteId={Number(info.row.original.branch.id)}
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

export default SubjectGroupTable
