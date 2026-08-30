import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import { concat, showDisplayedRowCount } from '@/utils/helpers'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import GuardianDelete from '@/views/school/guardians/GuardianDelete'
import type { GuardianType } from './Guardian.type'
import CommonTable from '@/@core/components/react-table/common-react-table'
import {
  User,
  Briefcase,
  Globe,
  Phone,
  Hash,
  MapPin,
  Heart,
} from 'lucide-react'
import {
  GenderBadge,
  LocationText,
} from '@/@core/components/ui/table/table.style'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'

interface GuardianTableProps {
  dataSource?: GuardianType[]
  onGlobalFilterChanged?: (filterApi: any) => void
  modal: NiceModalHandler
  refetch: () => void
}

const GuardianTable: FC<GuardianTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<GuardianType>[]>(
    () => [
      {
        id: 'name',
        accessorFn: (row) => `${row.lastName} ${row.firstName}`,
        header: () => (
          <div className="flex items-center gap-0.5">
            <User size={14} className="text-[#7367f0]" /> {t('label-name')}
          </div>
        ),
        cell: ({ row: { original } }) => {
          const name = concat(
            original?.lastName || '',
            original?.firstName || '',
          )

          return (
            <TextWithAvatar
              letter={name!.charAt(0)}
              title={name!}
              titleClassName="text-xs font-semibold"
              subtitle={
                <div className="flex items-center gap-0.5 text-gray-400">
                  <Heart size={10} />
                  <span>{t('label-guardian')}</span>
                </div>
              }
              size="sm"
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
        header: () => (
          <div className="flex items-center gap-0.5">
            <Briefcase size={14} /> {t('label-profession')}
          </div>
        ),
        accessorKey: 'profession',
        cell: (info) => (
          <span className="text-gray-700 font-medium">
            {(info.getValue() as string) || '-'}
          </span>
        ),
      },
      {
        id: 'language',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Globe size={14} /> {t('label-language')}
          </div>
        ),
        accessorFn: (row) => `${row.language?.name}`,
        cell: ({ row: { original } }) => (
          <span className="text-gray-600">
            {original.language?.name || '-'}
          </span>
        ),
      },
      {
        id: 'address',
        header: () => (
          <div className="flex items-center gap-0.5">
            <MapPin size={14} /> {t('label-address')}
          </div>
        ),
        accessorFn: (row) => `${row.address?.town} ${row.address?.street}`,
        cell: ({ row: { original } }) => (
          <LocationText>
            {original.address ? (
              <>
                <span className="font-semibold">{original.address.town}</span>
                {original.address.street && (
                  <span className="text-gray-400">
                    / {original.address.street}
                  </span>
                )}
              </>
            ) : (
              '-'
            )}
          </LocationText>
        ),
      },
      {
        id: 'telephone',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Phone size={14} /> {t('label-telephone')}
          </div>
        ),
        accessorFn: (row) => `${row.contactInfo?.telephone}`,
        cell: ({ row: { original } }) => (
          <div className="flex items-center gap-1 text-gray-700 font-mono">
            {original.contactInfo?.telephone || '-'}
          </div>
        ),
      },
      {
        id: 'guardianId',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Hash size={14} /> #
          </div>
        ),
        accessorFn: (row) => `${row.id}`,
        cell: (info) => (
          <span className="text-xs text-gray-400 font-mono">
            {info.getValue() as string}
          </span>
        ),
        size: 80,
      },
      {
        id: 'actions',
        header: () => <div className="text-right">{t('label-actions')}</div>,
        cell: ({ row: { original } }) => (
          <div className="flex justify-end w-full">
            <ActionRenderer
              params={original}
              deleteElement={
                <GuardianDelete
                  refetch={props.refetch}
                  id={original.id}
                  classic={false}
                />
              }
              updateElement={<span />}
              formId="guardian"
              modal={props.modal}
              refetch={props.refetch}
            />
          </div>
        ),
        size: 80,
      },
    ],
    [t, props.modal, props.refetch],
  )

  return (
    <CommonTable
      data={props.dataSource || []}
      columns={columns}
      onModelUpdate={(rows) => showDisplayedRowCount(rows)}
      showQuickFilter={false}
      onGlobalFilterChanged={props.onGlobalFilterChanged}
      modal={props.modal}
      onRowClicked={(data) =>
        props.modal.show({
          guardian: data,
          update: true,
          refetch: props.refetch,
        })
      }
    />
  )
}

export default GuardianTable
