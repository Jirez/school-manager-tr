import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { ClassType } from './Class.type'
import ClassDelete from './ClassDelete'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import { concat } from '@/utils/helpers'
import {
  BookOpen,
  User,
  Layers,
  GraduationCap,
  Trophy,
  Activity,
  Hash,
} from 'lucide-react'
import { TypeBadge, SkuText } from '@/@core/components/ui/table/table.style'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import type { AppFeatures } from '#/hooks/table'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, ClassType>> = useMemo(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: () => (
          <div className="flex items-center gap-0.5">
            <BookOpen size={14} className="text-primary" /> {t('label-name')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {original.name}
            </span>
            <span className="text-[10px] text-gray-400 font-mono tracking-tighter">
              {original.code}
            </span>
          </div>
        ),
        size: 200,
      },
      {
        id: 'headTeacher',
        accessorFn: (row) => row.headTeacher?.lastName,
        header: () => (
          <div className="flex items-center gap-0.5">
            <User size={14} /> {t('label-headTeacher')}
          </div>
        ),
        cell: ({ row: { original } }) => {
          const headTeacher = original?.headTeacher
          if (!headTeacher)
            return (
              <span className="text-sm text-gray-400 italic">Non défini</span>
            )
          return (
            <TextWithAvatar
              letter={headTeacher.lastName.charAt(0)}
              title={concat(headTeacher.lastName, headTeacher.firstName)}
              size="sm"
            />
          )
        },
        size: 200,
      },
      {
        id: 'branch',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Layers size={14} /> {t('label-branch')}
          </div>
        ),
        accessorFn: (row) => row.branch.name,
        cell: (info) => (
          <TypeBadge $color="primary">{info.getValue() as string}</TypeBadge>
        ),
        size: 150,
      },
      {
        id: 'level',
        header: () => (
          <div className="flex items-center gap-0.5">
            <GraduationCap size={14} /> {t('label-level')}
          </div>
        ),
        accessorFn: (row) => row.branch.level.name,
        cell: (info) => (
          <TypeBadge $color="success">{info.getValue() as string}</TypeBadge>
        ),
        size: 150,
      },
      {
        id: 'cycle',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Trophy size={14} /> {t('label-cycle')}
          </div>
        ),
        accessorFn: (row) => row.branch.level.cycle.name,
        cell: (info) => (
          <TypeBadge $color="warning">{info.getValue() as string}</TypeBadge>
        ),
        size: 150,
      },
      {
        id: 'competenceClass',
        accessorKey: 'competenceClass',
        header: () => (
          <div className="flex items-center gap-0.5 justify-center w-full">
            <Activity size={14} /> {t('label-competenceClass')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <ActiveRenderer
              active={info.getValue() as boolean}
              inactiveText="label.no"
              activeText="label.yes"
            />
          </div>
        ),
        size: 100,
      },
      {
        id: 'id',
        header: () => (
          <div className="flex items-center gap-0.5 justify-center w-full">
            <Hash size={14} /> ID
          </div>
        ),
        accessorKey: 'id',
        cell: (info) => (
          <div className="flex justify-center">
            <SkuText>{info.getValue() as string}</SkuText>
          </div>
        ),
        size: 80,
      },
      {
        id: 'actions',
        header: () => <div className="text-right">{t('label-actions')}</div>,
        cell: (info) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={info.row.original}
              deleteElement={<ClassDelete />}
              updateElement={<span />}
              formId="clazz"
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
