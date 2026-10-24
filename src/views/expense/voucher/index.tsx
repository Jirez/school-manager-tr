import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { SupplierLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import {
  useCashVouchersQuery,
  useCashVoucherCreatedSubscription,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useEffect } from 'react'
import CashVoucherModal from './CashVoucherModal'
import { useTableColumns } from './cashVoucherModel'

const CashVouchers = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(CashVoucherModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.expenses.vouchers'))

  const { data, error, loading, refetch } = useCashVouchersQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal, refetch)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.cashVouchers || [],
  })

  const { data: subscriptionData } = useCashVoucherCreatedSubscription()

  useEffect(() => {
    if (
      subscriptionData &&
      subscriptionData.cashVoucher?.enterpriseId === enterpriseId
    ) {
      refetch()
    }
  }, [subscriptionData])

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={SupplierLinks} />
      <Toolbar
        title={t('sidebar.expenses.vouchers')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_cashVoucher"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
        abilitySubject="expense"
      />

      {/* Table here */}
      <div className="text-sm">
        <CustomTable
          modal={modal}
          table={table as any}
          loading={loading}
          error={error}
          onRetry={refetch}
        />
      </div>
    </Scrollbar>
  )
}

export default CashVouchers
