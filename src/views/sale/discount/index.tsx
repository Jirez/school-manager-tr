import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { SupplierLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import {
  useDiscountsQuery,
  useDiscountCreatedSubscription,
} from '@/gql/graphql'
import { useMount, useTitle } from 'ahooks'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useEffect, useState } from 'react'
import DiscountModal from './DiscountModal'
import { useTableColumns } from './discountModel'

const Discounts = () => {
  const [isMount, setIsMount] = useState(false)
  const { enterpriseId } = useAuthentication()
  const modal = useModal(DiscountModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.sales.discounts'))

  const { data, error, loading, refetch } = useDiscountsQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.discounts || [],
  })

  const { data: subscriptionData } = useDiscountCreatedSubscription()

  useEffect(() => {
    if (
      subscriptionData &&
      subscriptionData.discount?.enterpriseId === enterpriseId
    ) {
      refetch()
    }
  }, [subscriptionData])

  useMount(() => {
    setIsMount(true)
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={SupplierLinks} />
      <Toolbar
        title={t('sidebar.sales.discounts')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_discount"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      {isMount && (
        <div className="text-sm">
          <CustomTable modal={modal} table={table as any} loading={loading} />
        </div>
      )}
    </Scrollbar>
  )
}

export default Discounts
