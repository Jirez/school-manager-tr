import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import SubjectGroupDelete from './SubjectGroupDelete'
import { GitBranch, Layers, Hash, List } from 'lucide-react'
import { TypeBadge } from '@/@core/components/ui/table/table.style'

type TSubjectGroup = {
  branch: {
    name: string
    id: number
  }
  subjectGroups: any[]
}

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<TSubjectGroup>> = useMemo(
    () => [
      {
        accessorFn: (row) => row.branch?.name,
        id: 'branch',
        header: () => (
          <div className="flex items-center gap-1">
            <GitBranch size={14} className="text-primary" />
            {t('label-branch')}
          </div>
        ),
        cell: (info) => (
          <TypeBadge $color="primary" className="!py-0 !px-2">
            {info.getValue() as string}
          </TypeBadge>
        ),
        size: 150,
      },
      {
        id: 'subjectGroups',
        header: () => (
          <div className="flex items-center gap-1">
            <Layers size={14} />
            {t('label-groups')}
          </div>
        ),
        cell: (info) => {
          const groups = info.row.original?.subjectGroups || []
          return (
            <div className="flex flex-wrap gap-1">
              {groups.map(({ name }: any) => (
                <TypeBadge
                  key={name}
                  $color="secondary"
                  className="!py-0 !px-1.5 !text-[10px]"
                >
                  {name}
                </TypeBadge>
              ))}
            </div>
          )
        },
        size: 300,
      },
      {
        id: 'subjectCount',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <Hash size={14} />
            {t('label-subjectCount')}
          </div>
        ),
        cell: (info) => {
          const groups = info.row.original?.subjectGroups || []
          const count = groups
            .map(({ subjectGroupItemCollection }: any) => {
              return subjectGroupItemCollection?.length || 0
            })
            .reduce((a: number, b: number) => a + b, 0)

          return (
            <div className="flex justify-center">
              <span className="font-bold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                {count}
              </span>
            </div>
          )
        },
        size: 100,
      },
      {
        id: 'actions',
        header: () => (
          <div className="text-right w-full">{t('label-actions')}</div>
        ),
        cell: (info) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={info.row.original}
              deleteElement={<SubjectGroupDelete />}
              updateElement={<span />}
              formId="groups"
              deleteId={Number(info.row.original.branch?.id)}
              modal={modal}
            />
          </div>
        ),
        size: 80,
      },
    ],
    [modal, t],
  )

  return { columns }
}
