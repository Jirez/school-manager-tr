import { useState } from 'react'
import { useModal } from '@ebay/nice-modal-react'
import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { PayrollLinks } from '@/navigation/links'
import { useTranslation } from 'react-i18next'
import { useTitle } from 'ahooks'
import {
  EarningCategoryCreatedDocument,
  useEarningCategoryQuery,
} from '@/gql/graphql'
import EarningCategoryModal from './EarningCategoryModal'
import EarningCategoryTable from './EarningCategoryTable'
import { useLiveSubscription } from '#/hooks/useLiveSubscription'

const EarningCategories = () => {
  const [filterApi, setFilterApi] = useState<GlobalFilterApi>()
  const { enterpriseId } = useAuthentication()
  const modal = useModal(EarningCategoryModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.payroll.earningCategories'))

  const { data, error, loading, subscribeToMore, refetch } =
    useEarningCategoryQuery({
      variables: { id: enterpriseId },
    })

  useLiveSubscription({
    subscribeToMore,
    document: EarningCategoryCreatedDocument,
    listVar: 'earningCategories',
    singleVar: 'earningCategory',
    sortField: 'createdAt',
    triggerUpdate: true,
    enterpriseId,
  })

  return (
    <div className="flex flex-col w-full">
      <Navs links={PayrollLinks} />
      <Toolbar
        title={t('sidebar.payroll.earningCategories')}
        globalFilter={filterApi?.globalFilter}
        setGlobalFilter={filterApi?.setGlobalFilter}
        setDefaultGlobalFilter={filterApi?.setDefaultGlobalFilter}
        actionLabel="action.add_earningCategory"
        onClick={() => modal.show()}
        refetch={refetch}
      />

      {/* Table here */}
      <div className="text-sm">
        <EarningCategoryTable
          modal={modal}
          dataSource={data?.earningCategories || []}
          onGlobalFilterChanged={setFilterApi}
          error={error}
          loading={loading}
          refetch={refetch}
        />
      </div>
    </div>
  )
}

export default EarningCategories
