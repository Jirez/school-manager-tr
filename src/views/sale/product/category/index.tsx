import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { ProductLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import {
  useProductCategoriesQuery,
  useProductCategoryCreatedSubscription,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useEffect } from 'react'
import ProductCategoryModal from './ProductCategoryModal'
import { useTableColumns } from './productCategoryModel'
import { useMount } from 'ahooks'
import { useState } from 'react'

const ProductCategories = () => {
  const { enterpriseId } = useAuthentication()
  const [isMounted, setIsMounted] = useState(false)
  const modal = useModal(ProductCategoryModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.sales.productCategories'))

  const { data, error, loading, refetch } = useProductCategoriesQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.productCategories || [],
  })

  const { data: subscriptionData } = useProductCategoryCreatedSubscription()

  useEffect(() => {
    if (
      subscriptionData &&
      subscriptionData.productCategory?.enterpriseId === enterpriseId
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
      <Navs links={ProductLinks} />
      <Toolbar
        title={t('sidebar.sales.productCategories')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_productCategory"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
        abilitySubject="product"
      />

      {/* Table here */}
      <div className="text-sm">
        <CustomTable modal={modal} table={table} loading={loading} />
      </div>
    </Scrollbar>
  )
}

export default ProductCategories
