import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { TuitionLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import {
  useInstallmentCreatedSubscription,
  useInstallmentsQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useEffect } from 'react'
import { useTableColumns } from './installmentModel'
import InstallmentModal from './InstallmentModal'
import { useState } from 'react'
import { useMount } from 'ahooks'

const Installments = () => {
  const { enterpriseId } = useAuthentication()
  const [isMount, setIsMount] = useState(false)
  const modal = useModal(InstallmentModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.sales.installments'))

  const { data, error, loading, refetch } = useInstallmentsQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.installments || [],
  })

  const { data: subscriptionData } = useInstallmentCreatedSubscription()

  useEffect(() => {
    if (
      subscriptionData //&&
      //subscriptionData.installment?.enterpriseId === enterpriseId
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
      <Navs links={TuitionLinks} />
      <Toolbar
        title={t('sidebar.sales.installments')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_installment"
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

export default Installments
