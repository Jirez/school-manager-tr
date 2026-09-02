import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import dayjs from 'dayjs'
import StudentDelete from './StudentDelete'
import { concat } from '@/utils/helpers'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import { User, Calendar, MapPin, Hash, Activity, Clock } from 'lucide-react'
import {
  AgeBadge,
  CompactDate,
  GenderBadge,
  LocationText,
  RegistrationBadge,
} from '@/@core/components/ui/table/table.style'
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

export function useTableColumns(
  modal?: NiceModalHandler,
  refetch?: () => void,
) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, TStudent>> = useMemo(
    () => [
      {
        accessorFn: (row) =>
          `${row.lastName} ${row.firstName} ${row.registrationNumber}`,
        id: 'studentName',
        header: () => (
          <div className="flex items-center gap-0.5">
            <User size={14} className="text-[#7367f0]" /> {t('label-names')}
          </div>
        ),
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
              titleClassName="!font-semibold text-xs text-gray-800 dark:text-gray-200"
              subtitle={
                <div className="flex items-center gap-0.5 mt-0.5">
                  <Hash size={10} className="text-gray-400" />
                  <RegistrationBadge>{registrationNumber}</RegistrationBadge>
                </div>
              }
              onClick={() =>
                modal?.show({
                  student: original,
                  update: true,
                  refetch,
                })
              }
              size="sm"
              showRing
            />
          )
        },
      },
      {
        accessorKey: 'gender',
        header: () => (
          <div className="text-center w-full">{t('label-gender')}</div>
        ),
        cell: (info) => {
          const gender = (info.getValue() as string)?.charAt(0)
          return (
            <div className="flex justify-center">
              <GenderBadge gender={gender}>{gender}</GenderBadge>
            </div>
          )
        },
        size: 80,
      },
      {
        accessorKey: 'birthDate',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Calendar size={14} /> {t('label-birthDate')}
          </div>
        ),
        cell: (info) => (
          <CompactDate>
            {dayjs(info.getValue() as string).format('DD/MM/YYYY')}
          </CompactDate>
        ),
      },
      {
        accessorKey: 'birthplace',
        header: () => (
          <div className="flex items-center gap-0.5">
            <MapPin size={14} /> {t('label-birthplace')}
          </div>
        ),
        cell: (info) => (
          <LocationText>{info.getValue() as string}</LocationText>
        ),
      },
      {
        id: 'age',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Activity size={14} /> {t('label-age')}
          </div>
        ),
        cell: ({ row: { original } }) => {
          const age = dayjs().diff(dayjs(original?.birthDate), 'years')
          return <AgeBadge age={age}>{age} ans</AgeBadge>
        },
        size: 100,
      },
      {
        accessorKey: 'createdDate',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Clock size={14} /> {t('label-creationDate')}
          </div>
        ),
        cell: (info) =>
          info.getValue() ? (
            <CompactDate>
              {dayjs(info.getValue() as string).format('DD/MM/YYYY')}
            </CompactDate>
          ) : (
            '-'
          ),
      },
      {
        accessorFn: (row) => `${row.id}`,
        id: 'id',
        header: '#',
        size: 50,
        cell: (info) => (
          <span className="text-xs text-gray-400 font-mono">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        id: 'actions',
        header: () => <div className="text-right">{t('label-actions')}</div>,
        cell: ({ row: { original } }) => (
          <div className="flex justify-end w-full">
            <ActionRenderer
              params={original}
              deleteElement={<StudentDelete />}
              updateElement={<span />}
              formId="student"
              modal={modal}
              refetch={refetch}
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
