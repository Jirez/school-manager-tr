import { useEffect, useState } from 'react'
import { SplitButton } from '@/@core/components/ui/buttons/split-button'
import { GraduationCap, FileText, CreditCard } from 'lucide-react'
import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { operationLinks } from '@/navigation/links'
import { useTranslation } from 'react-i18next'
import ErrorComponent from '@/@core/components/ui/error-component'
import { formatError } from '@/utils/ErrorHelper'
import { useKeyPress, useMount, useTitle } from 'ahooks'
// import { useHotkeys } from "react-hotkeys-hook";
import { useCustomerOperationsQuery } from '@/gql/graphql'
import PaymentInfo from '@/@core/components/payment/PaymentInfo'
import dayjs from 'dayjs'
// import DatePicker from "@/@core/components/ui/forms/date-picker";
import { useForm } from 'react-hook-form'
import PeriodSelect from '@/views/report/report-helper'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useTableColumns } from './invoiceModel'
import { INPUT_DATE_FORMAT } from '@/utils/constants'
import CustomerOperationModal from '../customerOperations/CustomerOperationModal'
import { styled } from 'styled-components'
import { FieldGrid } from '@/views/school/configuration/config-form-helper'
import SimpleDatePicker from '@/@core/components/ui/forms/simple-date-picker'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
  padding: 0.25rem;

  @media (min-width: 768px) {
    padding: 0;
  }
`

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

const FilterLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }

  .dark-layout & {
    color: #e4e6eb;
  }

  svg {
    width: 16px;
    height: 16px;
    color: #7367f0;
  }
`

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: end;
    gap: 1rem;
  }
`

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  //margin-top: 1rem;
`

const TableWrapper = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
`

const Invoices = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(CustomerOperationModal)
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
    useCustomerOperationsQuery({
      variables: {
        id: enterpriseId,
        startDate: dayjs().add(-30, 'days').format(INPUT_DATE_FORMAT),
        endDate: dayjs().format(INPUT_DATE_FORMAT),
      },
    })

  const { columns } = useTableColumns(modal, refetch)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.customerOperations?.operations || [],
  })

  const paymentInfo = data?.customerOperations?.paymentInfo

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
        label: t('action.add_schoolFees'),
        onClick: () => modal.show({ type: 'SCHOOL_FEES', refetch }),
        shortcut: 'ALT + N',
        icon: <GraduationCap size={16} />,
      }}
      dropdownActions={[
        {
          label: t('action.add_invoice'),
          onClick: () => modal.show({ type: 'INVOICE', refetch }),
          shortcut: 'ALT + I',
          icon: <FileText size={16} />,
        },
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
    <Container>
      <Navs links={operationLinks} />
      <Toolbar
        title={t('sidebar.sales.operations')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        extraButton={extraButton()}
        refetch={refetch}
        onClick={() => modal.show({ type: 'PROFORMA', refetch })}
        totalCount={totalCount}
      />

      <FilterSection>
        {/* <FilterLabel>
          <Calendar size={16} />
          <span>{t("label-filterPeriod") || "Filtrer par période"}</span>
        </FilterLabel> */}
        <FieldGrid $columns={2}>
          <PeriodSelect methods={methods} />
          <SimpleDatePicker
            name="period"
            // label=""
            control={methods.control}
            options={{
              dateFormat: 'd/m/Y',
              mode: 'range',
              allowInput: true,
            }}
          />
        </FieldGrid>
      </FilterSection>

      {isMounted && (
        <ContentSection>
          <PaymentInfo
            estimate={0}
            estimateCount={0}
            overdue={paymentInfo?.overdue || 0}
            overdueCount={paymentInfo?.overdueCount || 0}
            openInvoice={paymentInfo?.openInvoice || 0}
            openInvoiceCount={paymentInfo?.openInvoiceCount || 0}
            paid={paymentInfo?.paid || 0}
            paidCount={paymentInfo?.paidCount || 0}
          />
          <TableWrapper>
            <CustomTable table={table} modal={modal} loading={loading} />
          </TableWrapper>
        </ContentSection>
      )}
    </Container>
  )
}

export default Invoices
