import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { CustomerLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import {
  useCustomerCategoriesQuery,
  useCustomerCategoryCreatedSubscription,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useEffect } from 'react'
import CustomerCategoryModal from './CustomerCategoryModal'
import { useTableColumns } from './customerCategoryModel'
import { useState } from 'react'
import { useMount } from 'ahooks'

const CustomerCategories = () => {
  const { enterpriseId } = useAuthentication()
  const [isMount, setIsMount] = useState(false)
  const modal = useModal(CustomerCategoryModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.sales.customerCategories'))

  const { data, error, loading, refetch } = useCustomerCategoriesQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.customerCategories || [],
  })

  const { data: subscriptionData } = useCustomerCategoryCreatedSubscription()

  useEffect(() => {
    if (
      subscriptionData &&
      subscriptionData.customerCategory?.enterpriseId === enterpriseId
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
        title={t('sidebar.sales.customerCategories')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_customerCategory"
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

export default CustomerCategories
