import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import TeacherDelete from './TeacherDelete'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import { concat } from '@/utils/helpers'
import type TeacherType from './Teacher.type'
import {
  User,
  Briefcase,
  GraduationCap,
  Activity,
  Hash,
  CheckCircle,
} from 'lucide-react'
import { TypeBadge, SkuText } from '@/@core/components/ui/table/table.style'
import type { AppFeatures } from '#/hooks/table'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, TeacherType>> = useMemo(
    () => [
      {
        accessorFn: (row) => `${row.lastName} ${row.firstName}`,
        id: 'name',
        header: () => (
          <div className="flex items-center gap-1">
            <User size={14} className="text-primary" />
            {t('label-name')}
          </div>
        ),
        cell: ({ row: { original } }) => {
          const name = concat(
            original?.lastName || '',
            original?.firstName || '',
          )
          const registrationNumber = original?.code

          return (
            <TextWithAvatar
              letter={name?.charAt(0)}
              title={name}
              subtitle={registrationNumber}
              titleClassName="!font-semibold"
            />
          )
        },
        size: 250,
      },
      {
        accessorKey: 'gender',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <User size={14} />
            {t('label-gender')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <span className="font-bold text-gray-800 dark:text-gray-200 uppercase">
              {(info.getValue() as string)?.charAt(0)}
            </span>
          </div>
        ),
        size: 80,
      },
      {
        accessorKey: 'currentPost',
        header: () => (
          <div className="flex items-center gap-1">
            <Briefcase size={14} />
            {t('label-currentPost')}
          </div>
        ),
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300">
            {info.getValue() as string}
          </span>
        ),
        size: 150,
      },
      {
        accessorKey: 'function',
        header: () => (
          <div className="flex items-center gap-1">
            <Briefcase size={14} />
            {t('label-function')}
          </div>
        ),
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300">
            {info.getValue() as string}
          </span>
        ),
        size: 150,
      },
      {
        accessorKey: 'speciality',
        header: () => (
          <div className="flex items-center gap-1">
            <GraduationCap size={14} />
            {t('label-speciality')}
          </div>
        ),
        cell: (info) => (
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {info.getValue() as string}
          </span>
        ),
        size: 150,
      },
      {
        accessorKey: 'status',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <CheckCircle size={14} />
            {t('label-status')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <TypeBadge $color="secondary" className="!py-0 !px-2 !text-xs">
              {t(info.getValue() as string)}
            </TypeBadge>
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: 'active',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <Activity size={14} />
            {t('label-active')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <ActiveRenderer
              active={info.getValue() as boolean}
              activeText="label.yes"
              inactiveText="label.no"
            />
          </div>
        ),
        size: 100,
      },
      {
        accessorFn: (row) => row.__typename,
        id: 'type',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <Hash size={14} />
            {t('label-type')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <SkuText>{info.getValue() as string}</SkuText>
          </div>
        ),
        size: 100,
      },
      {
        accessorKey: 'id',
        id: 'id',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <Hash size={14} />
            ID
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <SkuText>{info.getValue() as string}</SkuText>
          </div>
        ),
        size: 80,
      },
      {
        id: 'actions',
        header: () => (
          <div className="text-right w-full">{t('label-actions')}</div>
        ),
        cell: ({ row: { original } }) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={original}
              deleteElement={<TeacherDelete />}
              updateElement={<span />}
              formId="teacher"
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
