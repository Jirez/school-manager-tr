import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { SupplierLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import {
  useSupplierCreatedSubscription,
  useSuppliersQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './supplierModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import SupplierModal from './SupplierModal'
import { useEffect } from 'react'
import { useMount } from 'ahooks'
import { useState } from 'react'

const Suppliers = () => {
  const { enterpriseId } = useAuthentication()
  const [isMounted, setIsMounted] = useState(false)
  const modal = useModal(SupplierModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.sales.suppliers'))

  const { data, error, loading, refetch } = useSuppliersQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.suppliers || [],
  })

  const { data: subscriptionData } = useSupplierCreatedSubscription()

  useEffect(() => {
    if (
      subscriptionData &&
      subscriptionData.onSupplierCreated?.enterpriseId === enterpriseId
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
        title={t('sidebar.sales.suppliers')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_supplier"
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

export default Suppliers
