import { useState } from 'react'
import { useModal } from '@ebay/nice-modal-react'
import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { PayrollLinks } from '@/navigation/links'
import { useTranslation } from 'react-i18next'
import { useTitle } from 'ahooks'
import { EarningCreatedDocument, useEarningsQuery } from '@/gql/graphql'
import EarningModal from './EarningModal'
import EarningTable from './EarningTable'
import { useLiveSubscription } from '#/hooks/useLiveSubscription'

const Earnings = () => {
  const [filterApi, setFilterApi] = useState<GlobalFilterApi>()
  const { enterpriseId } = useAuthentication()
  const modal = useModal(EarningModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.payroll.earnings'))

  const { data, error, loading, subscribeToMore, refetch } = useEarningsQuery({
    variables: { id: enterpriseId },
  })

  useLiveSubscription({
    subscribeToMore,
    document: EarningCreatedDocument,
    listVar: 'earnings',
    singleVar: 'earning',
    sortField: 'createdAt',
    triggerUpdate: true,
    enterpriseId,
  })

  return (
    <div className="flex flex-col w-full">
      <Navs links={PayrollLinks} />
      <Toolbar
        title={t('sidebar.payroll.earnings')}
        globalFilter={filterApi?.globalFilter}
        setGlobalFilter={filterApi?.setGlobalFilter}
        setDefaultGlobalFilter={filterApi?.setDefaultGlobalFilter}
        actionLabel="action.add_earning"
        onClick={() => modal.show()}
        refetch={refetch}
      />

      {/* Table here */}
      <div className="text-sm">
        <EarningTable
          modal={modal}
          dataSource={data?.earnings || []}
          onGlobalFilterChanged={setFilterApi}
          error={error}
          loading={loading}
          refetch={refetch}
        />
      </div>
    </div>
  )
}

export default Earnings
