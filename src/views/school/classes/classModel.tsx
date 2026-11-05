import type { ColumnDef } from '@tanstack/react-table'
import type { ClassType } from './Class.type'
import ClassDelete from './ClassDelete'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { concat } from '@/utils/helpers'
import { formatError } from '@/utils/ErrorHelper'
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
import { m } from '@/paraglide/messages'
import { useClassToggleCompetenceClassMutation } from '@/gql/graphql'
import { toast } from 'react-toastify'

export function useTableColumns(modal?: NiceModalHandler) {
  const [toggleCompetenceClass] = useClassToggleCompetenceClassMutation()
  const togglingClassIdsRef = useRef(new Set<number>())
  const [togglingClassIds, setTogglingClassIds] = useState<Set<number>>(
    () => new Set(),
  )

  const handleToggleCompetenceClass = useCallback(
    async (id?: number) => {
      if (id == null || togglingClassIdsRef.current.has(id)) return

      togglingClassIdsRef.current.add(id)
      setTogglingClassIds(new Set(togglingClassIdsRef.current))

      try {
        await toggleCompetenceClass({ variables: { id } })
      } catch (error) {
        toast.error(
          `Impossible de modifier le type de classe : ${formatError(error)}`,
        )
      } finally {
        togglingClassIdsRef.current.delete(id)
        setTogglingClassIds(new Set(togglingClassIdsRef.current))
      }
    },
    [toggleCompetenceClass],
  )

  const columns: Array<ColumnDef<AppFeatures, ClassType>> = useMemo(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: () => (
          <div className="flex items-center gap-0.5">
            <BookOpen size={14} className="text-primary" /> {m.label_name()}
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
            <User size={14} /> {m.label_headTeacher()}
          </div>
        ),
        cell: ({ row: { original } }) => {
          const headTeacher = original.headTeacher
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
            <Layers size={14} /> {m.label_branch()}
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
            <GraduationCap size={14} /> {m.label_level()}
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
            <Trophy size={14} /> {m.label_cycle()}
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
            <Activity size={14} /> {m.label_competenceClass()}
          </div>
        ),
        cell: ({ row, getValue }) => (
          <div className="flex justify-center">
            <ActiveRenderer
              active={getValue() as boolean}
              inactiveText="label.no"
              activeText="label.yes"
              onClick={() => void handleToggleCompetenceClass(row.original.id)}
              loading={
                row.original.id != null && togglingClassIds.has(row.original.id)
              }
              title={m.label_competenceClassDesc()}
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
        header: () => <div className="text-right">{m.label_actions()}</div>,
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
    [handleToggleCompetenceClass, modal, togglingClassIds],
  )

  return { columns }
}
