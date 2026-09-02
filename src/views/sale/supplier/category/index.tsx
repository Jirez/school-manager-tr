import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { SupplierLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import {
  useSupplierCategoriesQuery,
  useSupplierCategoryCreatedSubscription,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './supplierCategoryModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import SupplierCategoryModal from './SupplierCategoryModal'
import { useEffect } from 'react'
import { useMount } from 'ahooks'
import { useState } from 'react'

const SupplierCategories = () => {
  const { enterpriseId } = useAuthentication()
  const [isMounted, setIsMounted] = useState(false)
  const modal = useModal(SupplierCategoryModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.sales.supplierCategories'))

  const { data, error, loading, refetch } = useSupplierCategoriesQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.supplierCategories || [],
  })

  const { data: subscriptionData } = useSupplierCategoryCreatedSubscription()

  useEffect(() => {
    if (
      subscriptionData &&
      subscriptionData.onSupplierCategoryCreated?.enterpriseId === enterpriseId
    ) {
      refetch()
    }
  }, [subscriptionData])

  useMount(() => {
    setIsMounted(true)
  })

  if (!isMounted) {
    return null
  }

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={SupplierLinks} />
      <Toolbar
        title={t('sidebar.sales.supplierCategories')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_supplierCategory"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
        abilitySubject="vendor"
      />

      {/* Table here */}
      <div className="text-sm">
        <CustomTable modal={modal} table={table as any} loading={loading} />
      </div>
    </Scrollbar>
  )
}

export default SupplierCategories
