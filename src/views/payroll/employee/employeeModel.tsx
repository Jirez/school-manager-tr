import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import { concat } from '@/utils/helpers'
import EmployeeDelete from './EmployeeDelete'
import type { EmployeeType } from './employee.type'
import {
  User,
  Briefcase,
  IdCard,
  Calendar,
  Activity,
  Hash,
  Settings,
  FileText,
} from 'lucide-react'
import { TypeBadge, SkuText } from '@/@core/components/ui/table/table.style'
import dayjs from 'dayjs'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<EmployeeType>> = useMemo(
    () => [
      {
        accessorFn: (row) =>
          `${row.personnel.lastName} ${row.personnel.firstName}`,
        id: 'name',
        header: () => (
          <div className="flex items-center gap-1">
            <User size={14} className="text-primary" />
            {t('label-name')}
          </div>
        ),
        cell: ({ row: { original } }) => {
          const name = concat(
            original?.personnel?.lastName || '',
            original?.personnel?.firstName || '',
          )
          const registrationNumber = original?.personnel?.code

          return (
            <TextWithAvatar
              letter={name!.charAt(0)}
              title={name!}
              subtitle={registrationNumber}
            />
          )
        },
        size: 250,
      },
      {
        accessorKey: 'position.title',
        header: () => (
          <div className="flex items-center gap-1">
            <Briefcase size={14} className="text-primary" />
            {t('label-position')}
          </div>
        ),
        cell: (info) => (
          <span className="font-medium text-dark">
            {info.getValue() as string}
          </span>
        ),
        size: 180,
      },
      {
        accessorKey: 'nsifNumber',
        header: () => (
          <div className="flex items-center gap-1">
            <IdCard size={14} className="text-secondary" />
            {t('label-nsifNumber')}
          </div>
        ),
        cell: (info) => (
          <SkuText className="text-[11px]">
            {(info.getValue() as string) || '-'}
          </SkuText>
        ),
        size: 140,
      },
      {
        accessorKey: 'hireDate',
        header: () => (
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-info" />
            {t('label-hireDate')}
          </div>
        ),
        cell: (info) => {
          const val = info.getValue() as string
          return val ? (
            <span className="text-muted text-[11px]">
              {dayjs(val).format('DD MMM YYYY')}
            </span>
          ) : (
            '-'
          )
        },
        size: 130,
      },
      {
        accessorKey: 'employmentStatus',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <Activity size={14} className="text-warning" />
            {t('label-status')}
          </div>
        ),
        cell: (info) => {
          const status = info.getValue() as string
          let color: any = 'secondary'
          if (status === 'ACTIVE') color = 'success'
          if (status === 'SUSPENDED') color = 'warning'
          if (status === 'TERMINATED') color = 'danger'
          if (status === 'RETIRED') color = 'secondary'
          if (status === 'ON_LEAVE') color = 'info'

          return (
            <div className="text-center w-full">
              <TypeBadge $color={color} className="!py-0 !px-2 !text-[10px]">
                {t(status)}
              </TypeBadge>
            </div>
          )
        },
        size: 120,
      },
      {
        accessorKey: 'employmentType',
        header: () => (
          <div className="flex items-center gap-1 justify-center w-full">
            <FileText size={14} className="text-info" />
            {t('label-employmentType')}
          </div>
        ),
        cell: (info) => {
          const type = info.getValue() as string
          let color: any = 'primary'
          if (type === 'FULL_TIME') color = 'primary'
          if (type === 'PART_TIME') color = 'info'
          if (type === 'CONTRACT') color = 'warning'
          if (type === 'TEMPORARY') color = 'secondary'

          return (
            <div className="text-center w-full">
              <TypeBadge $color={color} className="!py-0 !px-2 !text-[10px]">
                {t(type)}
              </TypeBadge>
            </div>
          )
        },
        size: 120,
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
          <div className="flex items-center gap-1 justify-center w-full text-secondary">
            <Settings size={14} />
            {t('label-actions')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <div className="flex justify-center">
            <ActionRenderer
              params={original}
              deleteElement={<EmployeeDelete />}
              updateElement={<span />}
              formId="employee"
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
