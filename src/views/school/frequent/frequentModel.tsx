import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useModal } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import dayjs from 'dayjs'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import MyDropdown, {
  DeleteMenuItem,
  MyDivider,
  MyMenuItem,
} from '@/@core/components/dropdown'
import {
  User,
  Calendar,
  GraduationCap,
  Coins,
  CreditCard,
  Activity,
  MoreVertical,
  Edit,
  Printer,
  Eye,
  Baby,
  Clock,
  ArrowRightCircle,
  AlertCircle,
  Check,
} from 'lucide-react'
import FrequentDelete from './FrequentDelete'
import SchoolCertificateModal from './SchoolCertificateModal'
import { inArrayFilterFn } from '@/utils/SearchFn'
import { useNavigate } from '@tanstack/react-router'
import { cutText, toCurrency } from '@/utils/helpers'
import {
  useStudentInvoiceCreateMutation,
  useStudentInvoiceSyncMutation,
} from '@/gql/graphql'
import { toast } from 'react-toastify'
import { TOAST_OPTIONS } from '@/utils/constants'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useApolloClient } from '@apollo/client'
import {
  SkuText,
  CompactDate,
  GenderBadge,
  AgeBadge,
} from '@/@core/components/ui/table/table.style'
import FrequentExcludeModal from './FrequentExcludeModal'

export function useTableColumns(
  modal?: NiceModalHandler,
  refetch?: () => void,
) {
  const { t } = useTranslation()
  const certificateModal = useModal(SchoolCertificateModal)
  const navigate = useNavigate()
  const { enterpriseId } = useAuthentication()
  const [studentInvoiceCreate, { loading: studentInvoiceCreateLoading }] =
    useStudentInvoiceCreateMutation()

  const [studentInvoiceSync, { loading: studentInvoiceSyncLoading }] =
    useStudentInvoiceSyncMutation()
  const client = useApolloClient()

  const refetchCustomerOperationsQueries = async () => {
    await client.refetchQueries({
      updateCache(cache) {
        cache.evict({ fieldName: 'customerOperations' })
      },
    })
  }

  const excludeModal = useModal(FrequentExcludeModal)

  const columns: Array<ColumnDef<any>> = useMemo(
    () => [
      {
        accessorFn: (row) => `${row.fullName} ${row.registrationNumber}`,
        id: 'studentName',
        header: () => (
          <div className="flex items-center gap-0.5">
            <User size={14} className="text-primary" /> {t('label-names')}
          </div>
        ),
        cell: ({ row: { original } }) => {
          const name = original?.fullName
          const registrationNumber = original.registrationNumber

          return (
            <TextWithAvatar
              letter={name!.charAt(0)}
              title={name!}
              titleClassName="!font-semibold text-gray-800 dark:text-gray-200"
              subtitle={
                <div className="flex items-center gap-0.5">
                  <SkuText className="text-[10px]">
                    {registrationNumber} - {original.id}
                  </SkuText>
                </div>
              }
              titleMaxLength={40}
              onClick={() =>
                modal?.show({
                  frequent: original,
                  update: true,
                  refetch,
                })
              }
            />
          )
        },
        size: 250,
      },
      {
        accessorFn: (row) => row.sex,
        id: 'gender',
        header: () => (
          <div className="flex items-center gap-0.5">
            <User size={14} className="text-secondary" /> {t('label-gender')}
          </div>
        ),
        cell: ({ getValue }) => (
          <GenderBadge gender={getValue() as string}>
            {getValue() as string}
          </GenderBadge>
        ),
        size: 60,
      },
      {
        accessorKey: 'birthDate',
        id: 'birth',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Baby size={14} className="text-warning" /> {t('label-birth')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <div className="flex flex-col leading-tight">
            <CompactDate className="font-semibold">
              <Calendar size={12} />
              {dayjs(original.birthDate).format('DD/MM/YYYY')}
            </CompactDate>
            <span className="text-[10px] text-gray-400 italic truncate max-w-[120px]">
              {original.birthplace}
            </span>
          </div>
        ),
        size: 130,
      },
      {
        id: 'age',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Clock size={14} className="text-info" /> {t('label-age')}
          </div>
        ),
        cell: ({ row: { original } }) => {
          const age = dayjs().diff(dayjs(original?.birthDate), 'years')
          return <AgeBadge age={age}>{age}</AgeBadge>
        },
        size: 60,
      },
      {
        accessorKey: 'frequentPK.classId',
        id: 'classId',
        filterFn: inArrayFilterFn,
        visibility: false,
      },
      {
        accessorKey: 'className',
        id: 'clazz',
        header: () => (
          <div className="flex items-center gap-0.5">
            <GraduationCap size={14} className="text-success" />{' '}
            {t('label-class')}
          </div>
        ),
        cell: (row) => (
          <span
            className="text-xs font-medium"
            title={row.getValue() as string}
          >
            {cutText(row.getValue() as string, 20)}
          </span>
        ),
        visibility: false,
        size: 120,
      },
      {
        accessorKey: 'repeater',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Activity size={14} className="text-danger" />{' '}
            {t('label-shortRepeater')}
          </div>
        ),
        cell: (info) => (
          <ActiveRenderer
            active={info.getValue() as boolean}
            activeText="label.yes"
            inactiveText="label.no"
          />
        ),
        size: 80,
      },
      {
        accessorKey: 'socialCase',
        header: () => (
          <div className="flex items-center gap-0.5">
            <AlertCircle size={14} className="text-warning" />{' '}
            {t('label-socialCase')}
          </div>
        ),
        cell: (info) => (
          <ActiveRenderer
            active={info.getValue() as boolean}
            activeText="label.yes"
            inactiveText="label.no"
          />
        ),
        size: 80,
      },
      {
        accessorKey: 'id',
        header: () => (
          <div className="flex items-center gap-0.5">
            <AlertCircle size={14} className="text-warning" /> {'Id'}
          </div>
        ),
      },
      {
        accessorFn: (row) => row.totalRequiredAmount,
        id: 'totalRequiredAmount',
        header: () => (
          <div className="flex items-center gap-0.5 text-right justify-end w-full">
            <Coins size={14} className="text-primary" />{' '}
            {t('label-shortSchoolFees')}
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="text-right font-mono font-bold text-xs text-primary">
            {getValue() ? toCurrency(getValue() as number) : '-'}
          </div>
        ),
        size: 120,
      },
      {
        accessorFn: (row) =>
          (row.totalRequiredAmount ?? 0) - (row.totalPaidAmount ?? 0),
        id: 'balance',
        header: () => (
          <div className="flex items-center gap-0.5 text-right justify-end w-full">
            <CreditCard size={14} className="text-danger" />{' '}
            {t('label-balance')}
          </div>
        ),
        cell: ({ getValue }) => (
          <div
            className={`text-right font-mono font-bold text-xs ${
              (getValue() as number) > 0 ? 'text-danger' : 'text-success'
            }`}
          >
            {toCurrency(getValue() as number)}
          </div>
        ),
        size: 120,
      },
      {
        accessorFn: (row) => row.lastPaymentDate,
        id: 'lastPaymentDate',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Clock size={14} className="text-secondary" />{' '}
            {t('label-lastPayment')}
          </div>
        ),
        cell: (info) => (
          <div className="text-xs">
            {info.getValue() ? (
              <CompactDate>
                <Clock size={12} />
                {dayjs(info.getValue() as string).format('DD MMM YYYY')}
              </CompactDate>
            ) : (
              '-'
            )}
          </div>
        ),
        size: 110,
      },
      {
        id: 'actions',
        header: () => (
          <div className="text-right w-full pr-2">
            <MoreVertical size={14} className="ml-auto" />
          </div>
        ),
        cell: ({ row: { original } }) => (
          <div className="flex justify-end pr-1">
            <MyDropdown
              label={<Edit size={14} />}
              onClick={() =>
                modal?.show({
                  frequent: original,
                  update: true,
                  refetch,
                })
              }
            >
              <MyMenuItem
                label={t('label-update')}
                onClick={() =>
                  modal?.show({
                    frequent: original,
                    update: true,
                    refetch,
                  })
                }
                icon={<Edit size={14} className="text-primary" />}
              />
              <DeleteMenuItem>
                <MyDivider />
                <FrequentDelete
                  refetch={refetch}
                  id={{
                    studentId: Number(original.frequentPK.studentId),
                    classId: Number(original.frequentPK.classId),
                    schoolYearId: Number(original.frequentPK.schoolYearId),
                  }}
                  classic={false}
                />
              </DeleteMenuItem>
              <MyDivider />
              <MyMenuItem
                label={t('label-schoolCertificate')}
                onClick={() =>
                  certificateModal.show({ id: original?.frequentPK.studentId })
                }
                icon={<Printer size={14} className="text-secondary" />}
              />
              {!original.totalRequiredAmount && (
                <>
                  <MyDivider />
                  <MyMenuItem
                    label={t('label-createInvoice')}
                    onClick={() =>
                      studentInvoiceCreate({
                        variables: {
                          studentId: original.frequentPK.studentId,
                          schoolYearId: original.frequentPK.schoolYearId,
                          schoolId: enterpriseId,
                        },
                      })
                        .then(() => {
                          toast.success('Facture créée avec succès', {
                            ...TOAST_OPTIONS,
                          })
                          refetch?.()
                          refetchCustomerOperationsQueries()
                        })
                        .catch((error) => {
                          toast.error(error.message, {
                            ...TOAST_OPTIONS,
                          })
                        })
                    }
                    icon={
                      <ArrowRightCircle size={14} className="text-success" />
                    }
                  />
                </>
              )}
              <MyDivider />
              {true && (
                <>
                  <MyDivider />
                  <MyMenuItem
                    label={t('label-updateInvoice', 'Mettre à jour la facture')}
                    onClick={() =>
                      studentInvoiceSync({
                        variables: {
                          studentId: original.frequentPK.studentId,
                          schoolYearId: original.frequentPK.schoolYearId,
                          schoolId: enterpriseId,
                        },
                      })
                        .then(() => {
                          toast.success('Facture créée avec succès', {
                            ...TOAST_OPTIONS,
                          })
                          refetch?.()
                          refetchCustomerOperationsQueries()
                        })
                        .catch((error) => {
                          toast.error(error.message, {
                            ...TOAST_OPTIONS,
                          })
                        })
                    }
                    icon={
                      <ArrowRightCircle size={14} className="text-success" />
                    }
                  />
                </>
              )}
              <MyDivider />
              <MyMenuItem
                label={t('label-changeStudentStatus')}
                onClick={() =>
                  excludeModal.show({
                    studentId: original.frequentPK.studentId,
                    schoolYearId: original.frequentPK.schoolYearId,
                    classId: original.frequentPK.classId,
                  })
                }
                icon={<Check size={14} className="text-danger" />}
              />
              <MyDivider />
              <MyMenuItem
                label={t('label-see')}
                onClick={() =>
                  navigate(`/frequents/${original.frequentPK.studentId}`)
                }
                icon={<Eye size={14} className="text-info" />}
              />
            </MyDropdown>
          </div>
        ),
        size: 60,
      },
    ],
    [modal, t],
  )

  return { columns }
}
