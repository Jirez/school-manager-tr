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
  DeductionCategoryCreatedDocument,
  useDeductionCategoryQuery,
} from '@/gql/graphql'
import DeductionCategoryModal from './DeductionCategoryModal'
import DeductionCategoryTable from './DeductionCategoryTable'
import { useLiveSubscription } from '#/hooks/useLiveSubscription'

const DeductionCategories = () => {
  const [filterApi, setFilterApi] = useState<GlobalFilterApi>()
  const { enterpriseId } = useAuthentication()
  const modal = useModal(DeductionCategoryModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.payroll.deductionCategories'))

  const { data, error, loading, subscribeToMore, refetch } =
    useDeductionCategoryQuery({
      variables: { id: enterpriseId },
    })

  useLiveSubscription({
    subscribeToMore,
    document: DeductionCategoryCreatedDocument,
    listVar: 'deductionCategories',
    singleVar: 'deductionCategory',
    // sortField: 'name',
    triggerUpdate: true,
    enterpriseId,
  })

  return (
    <div className="flex flex-col w-full">
      <Navs links={PayrollLinks} />
      <Toolbar
        title={t('sidebar.payroll.deductionCategories')}
        globalFilter={filterApi?.globalFilter}
        setGlobalFilter={filterApi?.setGlobalFilter}
        setDefaultGlobalFilter={filterApi?.setDefaultGlobalFilter}
        actionLabel="action.add_deductionCategory"
        onClick={() => modal.show()}
        refetch={refetch}
      />

      {/* Table here */}
      <div className="text-sm">
        <DeductionCategoryTable
          modal={modal}
          dataSource={data?.deductionCategories || []}
          onGlobalFilterChanged={setFilterApi}
          error={error}
          loading={loading}
          refetch={refetch}
        />
      </div>
    </div>
  )
}

export default DeductionCategories
