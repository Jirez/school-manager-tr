import { useEffect, useState } from 'react'
import { SplitButton } from '@/@core/components/ui/buttons/split-button'
import { FileText, CreditCard } from 'lucide-react'
import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { operationLinks } from '@/navigation/links'
import { useTranslation } from 'react-i18next'
import ErrorComponent from '@/@core/components/ui/error-component'
import { formatError } from '@/utils/ErrorHelper'
import { useKeyPress, useMount, useTitle } from 'ahooks'
import { useVendorOperationsQuery } from '@/gql/graphql'
import PaymentInfo from '@/@core/components/payment/PaymentInfo'
import dayjs from 'dayjs'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import { useForm } from 'react-hook-form'
import PeriodSelect from '@/views/report/report-helper'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useTableColumns } from './billModel'
import { INPUT_DATE_FORMAT } from '@/utils/constants'
import VendorOperationModal from '../vendorOperations/VendorOperationModal'
import { styled } from 'styled-components'
import { FieldGrid } from '@/views/school/configuration/config-form-helper'

const FilterSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  //gap: 1rem;
  margin-bottom: 1rem;
  padding-top: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e5e7eb;

  @media (min-width: 768px) {
    grid-template-columns: auto 1fr;
    align-items: end;
  }

  .dark-layout & {
    background: #283046;
    border-color: rgba(115, 103, 240, 0.2);
  }
`

const Bills = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(VendorOperationModal)
  const { t } = useTranslation()
  const [isMounted, setIsMounted] = useState(false)
  useTitle(t('text-sales'))

  interface FormValues {
    period: [Date, Date]
  }

  const methods = useForm<FormValues>({
    defaultValues: {
      period: [dayjs().add(-30, 'days').toDate(), dayjs().toDate()],
    },
  })

  const period = methods.watch('period') || []

  const { data, error, refetch, loading, subscribeToMore } =
    useVendorOperationsQuery({
      variables: {
        id: enterpriseId,
        startDate: dayjs().add(-30, 'days').format(INPUT_DATE_FORMAT),
        endDate: dayjs().format(INPUT_DATE_FORMAT),
      },
    })

  const { columns } = useTableColumns(modal, refetch)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.vendorOperations?.operations || [],
  })

  const paymentInfo = data?.vendorOperations?.paymentInfo

  const onPeriodFilterChanged = (period: any) => {
    refetch({
      startDate: dayjs(period[0]).format(INPUT_DATE_FORMAT),
      endDate: dayjs(period[1]).format(INPUT_DATE_FORMAT),
    })
  }

  useEffect(() => {
    onPeriodFilterChanged(period)
  }, [period])

  useMount(() => {
    setIsMounted(true)
  })

  const extraButton = () => (
    <SplitButton
      primaryAction={{
        label: t('action.add_invoice'),
        onClick: () => modal.show({ type: 'INVOICE', refetch }),
        shortcut: 'ALT + N',
        icon: <FileText size={16} />,
      }}
      dropdownActions={[
        {
          label: t('action.add_payment'),
          onClick: () => modal.show({ type: 'PAYMENT', refetch }),
          shortcut: 'ALT + P',
          icon: <CreditCard size={16} />,
        },
      ]}
    />
  )

  // shortcuts
  useKeyPress('alt+n', () => {
    modal.show({ type: 'SCHOOL_FEES', refetch })
  })

  useKeyPress('alt+i', () => {
    modal.show({ type: 'INVOICE', refetch })
  })

  useKeyPress('alt+p', () => {
    modal.show({ type: 'PAYMENT', refetch })
  })

  useKeyPress('alt+a', () => {
    modal.show({ type: 'CREDIT', refetch })
  })

  useKeyPress('alt+f', () => {
    modal.show({ type: 'PROFORMA', refetch })
  })

  if (error) {
    return (
      <div className="mx-auto">
        <ErrorComponent
          message={formatError(error)}
          title={t('label-graphqlError')}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full overflow-auto">
      <Navs links={operationLinks} />
      <Toolbar
        title={t('sidebar.expenses.purchases')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        extraButton={extraButton()}
        refetch={refetch}
        onClick={() => modal.show({ type: 'INVOICE', refetch })}
        totalCount={totalCount}
        actionLabel="action.add_invoice"
      />

      {/* Table here */}
      <>
        <FilterSection>
          <FieldGrid $columns={2}>
            <PeriodSelect methods={methods} />
            <DatePicker
              name="period"
              label=""
              control={methods.control}
              options={{
                dateFormat: 'd/m/Y',
                mode: 'range',
                //defaultDate: [dayjs().toDate(), dayjs().toDate()],
                allowInput: true,
              }}
            />
          </FieldGrid>
        </FilterSection>

        {isMounted && (
          <>
            <PaymentInfo
              estimate={0}
              estimateCount={0}
              overdue={paymentInfo?.overdue || 0}
              overdueCount={paymentInfo?.overdueCount || 0}
              openInvoice={paymentInfo?.openBill || 0}
              openInvoiceCount={paymentInfo?.openBillCount || 0}
              paid={paymentInfo?.paid || 0}
              paidCount={paymentInfo?.paidCount || 0}
            />
            <div className="mt-1 text-[0.8rem]">
              <CustomTable table={table} modal={modal} loading={loading} />
            </div>
          </>
        )}
      </>
    </div>
  )
}

export default Bills
