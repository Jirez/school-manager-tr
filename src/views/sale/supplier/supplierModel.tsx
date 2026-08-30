import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import MyDropdown, {
  DeleteMenuItem,
  MyDivider,
  MyMenuItem,
} from '@/@core/components/dropdown'
import { Edit } from 'react-feather'
import type { SupplierType } from './supplier.type'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import SupplierDelete from './SupplierDelete'
import { User, Mail, Phone, MapPin, CheckCircle } from 'lucide-react'

export function useTableColumns(
  modal?: NiceModalHandler,
  refetch?: () => void,
) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<SupplierType>> = useMemo(
    () => [
      {
        id: 'name',
        accessorKey: 'displayName',
        header: () => (
          <div className="flex items-center gap-0.5">
            <User size={14} className="text-primary" /> {t('label-name')}
          </div>
        ),
        cell: ({ row: { original } }) => {
          const name = original.displayName
          const category = original.category?.name

          return (
            <TextWithAvatar
              letter={name!.trim().charAt(0)}
              title={name!}
              titleClassName="!font-semibold"
              subtitle={category}
            />
          )
        },
        size: 250,
      },
      {
        id: 'contact',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Phone size={14} /> {t('label-contact')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <div className="flex flex-col text-sm">
            {original.contactInfo?.mobile && (
              <div className="flex items-center gap-0.5">
                <Phone size={12} className="text-muted" />
                <span>{original.contactInfo.mobile}</span>
              </div>
            )}
            {original.contactInfo?.email && (
              <div className="flex items-center gap-0.5">
                <Mail size={12} className="text-muted" />
                <span className="text-xs text-muted font-medium truncate max-w-[150px]">
                  {original.contactInfo.email}
                </span>
              </div>
            )}
          </div>
        ),
        size: 200,
      },
      {
        id: 'address',
        header: () => (
          <div className="flex items-center gap-0.5">
            <MapPin size={14} /> {t('label-address')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <div className="flex flex-col text-sm">
            <span className="font-medium">
              {original.address?.town || t('label-noTown')}
            </span>
            <span className="text-xs text-muted truncate max-w-[180px]">
              {original.address?.street || ''}
            </span>
          </div>
        ),
        size: 200,
      },
      {
        id: 'active',
        accessorKey: 'active',
        header: () => (
          <div className="flex items-center gap-0.5 justify-center w-full">
            <CheckCircle size={14} /> {t('label-active')}
          </div>
        ),
        cell: ({
          row: {
            original: { active },
          },
        }) => (
          <div className="flex justify-center">
            <ActiveRenderer
              active={active}
              activeText={t('label.yes')}
              inactiveText={t('label.no')}
            />
          </div>
        ),
        size: 80,
      },
      {
        id: 'actions',
        header: () => <div className="text-right">{t('label-actions')}</div>,
        cell: ({ row: { original } }) => (
          <div className="flex justify-end">
            <MyDropdown
              label={t('label-update')}
              onClick={() => modal?.show({ supplier: original, update: true })}
            >
              <MyMenuItem
                label={t('label-update')}
                onClick={() =>
                  modal?.show({ supplier: original, update: true })
                }
                icon={<Edit size={15} />}
              />
              <DeleteMenuItem>
                <MyDivider />
                <SupplierDelete refetch={refetch} id={original?.id} />
              </DeleteMenuItem>
            </MyDropdown>
          </div>
        ),
        size: 80,
      },
    ],
    [modal, t, refetch],
  )

  return { columns }
}
