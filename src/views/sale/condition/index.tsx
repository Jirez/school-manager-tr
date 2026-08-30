import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { SupplierLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import {
  usePaymentConditionCreatedSubscription,
  usePaymentConditionsQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useEffect, useState } from 'react'
import { useTableColumns } from './paymentConditionModel'
import PaymentCodnitionModal from './PaymentCodnitionModal'
import { useMount } from 'ahooks'

const PaymentConditions = () => {
  const { enterpriseId } = useAuthentication()
  const [isMount, setIsMount] = useState(false)
  const modal = useModal(PaymentCodnitionModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.sales.conditions'))

  const { data, error, loading, refetch } = usePaymentConditionsQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.paymentConditions || [],
  })

  const { data: subscriptionData } = usePaymentConditionCreatedSubscription()

  useEffect(() => {
    if (
      subscriptionData &&
      subscriptionData.onPaymentConditionCreated?.enterpriseId === enterpriseId
    ) {
      refetch()
    }
  }, [subscriptionData])

  useMount(() => {
    setIsMount(true)
  })

  if (!isMount) {
    return null
  }

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={SupplierLinks} />
      <Toolbar
        title={t('sidebar.sales.conditions')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_paymentCondition"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <CustomTable modal={modal} table={table} loading={loading} />
      </div>
    </Scrollbar>
  )
}

export default PaymentConditions
