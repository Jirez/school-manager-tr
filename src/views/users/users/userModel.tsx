import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import type { UserType } from './User.type'
import UserDelete from './UserDelete'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import {
  User,
  Calendar,
  Clock,
  Shield,
  Smartphone,
  CheckCircle,
  Hash,
  Mail,
  Users,
} from 'lucide-react'
import {
  TypeBadge,
  SkuText,
  CompactDate,
} from '@/@core/components/ui/table/table.style'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import { concat } from '@/utils/helpers'
import dayjs from 'dayjs'
import { useUserToggleStatusMutation } from '@/gql/graphql'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()
  const [toggle, { loading }] = useUserToggleStatusMutation()

  const columns: Array<ColumnDef<UserType>> = useMemo(
    () => [
      {
        id: 'username',
        accessorKey: 'username',
        header: () => (
          <div className="flex items-center gap-0.5">
            <User size={14} className="text-primary" /> {t('label-username')}
          </div>
        ),
        cell: ({ row: { original } }) => {
          const name = original.username
          const type = t(original.person.__typename)
          return (
            <TextWithAvatar
              letter={name.charAt(0)}
              title={name}
              titleClassName="!font-semibold"
              subtitle={
                <div className="flex items-center gap-0.5">
                  <TypeBadge
                    $color="secondary"
                    className="!py-0 !px-1 truncate max-w-[100px]"
                  >
                    {type}
                  </TypeBadge>
                  {original.email && (
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                      <Mail size={10} /> {original.email}
                    </span>
                  )}
                </div>
              }
            />
          )
        },
        size: 250,
      },
      {
        id: 'person',
        accessorKey: 'person.lastName',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Users size={14} /> {t('label-accountHolder')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <div className="flex flex-col">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {concat(original.person.lastName, original.person.firstName)}
            </span>
          </div>
        ),
        size: 200,
      },
      {
        id: 'creationDate',
        accessorKey: 'creationDate',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Calendar size={14} /> {t('label-creationDate')}
          </div>
        ),
        cell: (info) => (
          <CompactDate>
            <Calendar size={12} />
            {dayjs(info.getValue() as string).format('DD MMM YYYY')}
          </CompactDate>
        ),
        size: 140,
      },
      {
        id: 'lastLogin',
        accessorKey: 'lastLogin',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Clock size={14} /> {t('label-lastLogin')}
          </div>
        ),
        cell: (info) => (
          <CompactDate>
            <Clock size={12} />
            {info.getValue()
              ? dayjs(info.getValue() as string).format('DD MMM YYYY')
              : '-'}
          </CompactDate>
        ),
        size: 140,
      },
      {
        id: 'isEnabled',
        accessorKey: 'isEnabled',
        header: () => (
          <div className="flex items-center gap-0.5 justify-center w-full">
            <Shield size={14} /> {t('label-active')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <ActiveRenderer
              active={info.getValue() as boolean}
              onClick={() =>
                toggle({ variables: { userId: info.row.original?.id! } })
              }
              loading={loading}
              activeText="label.yes"
              inactiveText="label.no"
            />
          </div>
        ),
        size: 100,
      },
      {
        id: 'mfa',
        accessorKey: 'mfa',
        header: () => (
          <div className="flex items-center gap-0.5 justify-center w-full">
            <Smartphone size={14} /> {t('label-mfa')}
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
        id: 'roles',
        accessorKey: 'roles',
        header: () => (
          <div className="flex items-center gap-0.5">
            <CheckCircle size={14} /> {t('label-roles')}
          </div>
        ),
        cell: (info) => (
          <div className="flex flex-wrap gap-1">
            {(info.getValue() as any[]).map(({ name }: any) => (
              <TypeBadge
                $color="primary"
                key={name}
                className="!text-[9px] !py-0 !px-1.5 uppercase font-bold"
              >
                {name}
              </TypeBadge>
            ))}
          </div>
        ),
        size: 200,
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
        meta: { align: 'right' },
        cell: (info) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={info.row.original}
              deleteElement={<UserDelete />}
              updateElement={<span />}
              formId="user"
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
