import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { SupplierLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import {
  usePositionCreatedSubscription,
  usePositionsQuery,
} from '@/gql/graphql'
import { useMount, useTitle } from 'ahooks'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useEffect, useState } from 'react'
import { useTableColumns } from './positionModel'
import PositionModal from './PositionModal'

const Positions = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(PositionModal)
  const [isMount, setIsMount] = useState(false)
  const { t } = useTranslation()
  useTitle(t('sidebar.payroll.positions'))

  const { data, error, loading, refetch } = usePositionsQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.positions || [],
  })

  const { data: subscriptionData } = usePositionCreatedSubscription()

  useEffect(() => {
    if (
      subscriptionData &&
      subscriptionData.position?.enterpriseId === enterpriseId
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
        title={t('sidebar.payroll.positions')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_position"
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

export default Positions
