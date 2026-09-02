import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { CustomerLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import {
  useCustomerCreatedSubscription,
  useCustomersQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './customerModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import CustomerModal from './CustomerModal'
import { useEffect, useState } from 'react'
import { useMount } from 'ahooks'

const Customers = () => {
  const { enterpriseId } = useAuthentication()
  const [isMount, setIsMount] = useState(false)
  const modal = useModal(CustomerModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.sales.customers'))

  const { data, error, loading, refetch } = useCustomersQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.customers || [],
  })

  const { data: subscriptionData } = useCustomerCreatedSubscription()

  useEffect(() => {
    if (
      subscriptionData &&
      subscriptionData.onCustomerCreated?.enterpriseId === enterpriseId
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
      <Navs links={CustomerLinks} />
      <Toolbar
        title={t('sidebar.sales.customers')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_customer"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <CustomTable modal={modal} table={table as any} loading={loading} />
      </div>
    </Scrollbar>
  )
}

export default Customers
