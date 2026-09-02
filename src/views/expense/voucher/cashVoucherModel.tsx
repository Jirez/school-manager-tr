import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import { cutText, toCurrency } from '@/utils/helpers'
import CashVoucherDelete from './CashVoucherDelete'
import type { CashVoucherType } from './cash.voucher.type'
import dayjs from 'dayjs'
import { Badge } from 'reactstrap'
import { useCashVoucherApproveMutation } from '@/gql/graphql'
import MyDropdown, {
  DeleteMenuItem,
  MyDivider,
  MyMenuItem,
} from '@/@core/components/dropdown'
import { Edit } from 'react-feather'
import { useAuthentication } from '@/hooks/useAuthentication'
import { toast } from 'react-toastify'
import {
  FileText,
  DollarSign,
  User,
  Layers,
  Building2,
  CheckCircle,
  AlignLeft,
} from 'lucide-react'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import type { AppFeatures } from '#/hooks/table'

export function useTableColumns(modal?: NiceModalHandler, refetch?: any) {
  const { t } = useTranslation()
  const [approve] = useCashVoucherApproveMutation()
  const { username } = useAuthentication()

  const columns: Array<ColumnDef<AppFeatures, CashVoucherType>> = useMemo(
    () => [
      {
        id: 'number',
        accessorKey: 'number',
        header: () => (
          <div className="flex items-center gap-0.5">
            <FileText size={14} className="text-primary" /> {t('label-number')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <TextWithAvatar
            letter={original.number ? original.number.charAt(0) : 'B'}
            title={original.number || 'N/A'}
            titleClassName="!font-semibold"
            subtitle={dayjs(original.date).format('DD/MM/YYYY')}
          />
        ),
        size: 200,
      },
      {
        id: 'amount',
        accessorKey: 'amount',
        header: () => (
          <div className="flex items-center gap-0.5 justify-end w-full">
            <DollarSign size={14} /> {t('label-amount')}
          </div>
        ),
        cell: (info) => (
          <div className="text-right font-bold text-danger">
            {toCurrency(info.getValue() as number)}
          </div>
        ),
        size: 150,
      },
      {
        id: 'destination',
        header: () => (
          <div className="flex items-center gap-0.5">
            <User size={14} /> {t('label-destination')}
          </div>
        ),
        accessorFn: (row) =>
          row.person.lastName + ' ' + (row.person.firstName ?? ''),
        cell: ({ row: { original } }) => (
          <div className="flex flex-col">
            <span className="font-medium text-sm">
              {original.person.lastName} {original.person.firstName ?? ''}
            </span>
            <span className="text-gray-500 text-xs">{original.personType}</span>
          </div>
        ),
        size: 200,
      },
      {
        id: 'category',
        accessorKey: 'category.name',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Layers size={14} /> {t('label-category')}
          </div>
        ),
        size: 150,
      },
      {
        id: 'department',
        accessorKey: 'department.name',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Building2 size={14} /> {t('label-department')}
          </div>
        ),
        size: 150,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: () => (
          <div className="flex items-center gap-0.5 justify-center w-full">
            <CheckCircle size={14} /> {t('label-status')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <Badge
              color={info.getValue() === 'APPROVED' ? 'success' : 'danger'}
              className="badge-glow"
            >
              {info.getValue() as string}
            </Badge>
          </div>
        ),
        size: 120,
      },
      {
        id: 'reason',
        accessorKey: 'reason',
        header: () => (
          <div className="flex items-center gap-0.5">
            <AlignLeft size={14} /> {t('label-reason')}
          </div>
        ),
        cell: (info) => (
          <span
            title={info.getValue() as string}
            className="text-sm text-gray-600"
          >
            {cutText(info.getValue() as string, 60)}
          </span>
        ),
        size: 250,
      },
      {
        id: 'actions',
        header: () => <div className="text-right">{t('label-actions')}</div>,
        cell: ({
          cell: {
            row: { original },
          },
        }: any) => (
          <div className="flex justify-end">
            <MyDropdown
              label={t('label-update')}
              onClick={() =>
                modal?.show({
                  voucher: original,
                  update: true,
                  refetch: refetch,
                })
              }
            >
              <span>
                <MyDivider />
                <MyMenuItem
                  label={t('label-update')}
                  onClick={() => {
                    modal?.show({
                      voucher: original,
                      update: true,
                      refetch: refetch,
                    })
                  }}
                  icon={<Edit size={15} />}
                />
              </span>

              {original.status === 'WAITING' && (
                <MyMenuItem
                  label={t('label-markAsApproved')}
                  onClick={() =>
                    approve({
                      variables: { id: original?.id, operator: username },
                    })
                      .then(() => {
                        refetch?.()
                        toast.success(t('toast-markAsApprovedSuccess'))
                      })
                      .catch((error) => {
                        toast.error(error.message)
                      })
                  }
                  icon={<Edit size={15} />}
                />
              )}

              <DeleteMenuItem>
                <MyDivider />
                <CashVoucherDelete refetch={refetch} id={original?.id} />
              </DeleteMenuItem>
            </MyDropdown>
          </div>
        ),
        size: 80,
      },
    ],
    [modal, t, approve, username, refetch],
  )

  return { columns }
}
