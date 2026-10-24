import { useState } from 'react'
import { useModal } from '@ebay/nice-modal-react'
import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { PayrollLinks } from '@/navigation/links'
import { useTranslation } from 'react-i18next'
import { useTitle } from 'ahooks'
import { DeductionCreatedDocument, useDeductionsQuery } from '@/gql/graphql'
import DeductionModal from './DeductionModal'
import DeductionTable from './DeductionTable'
import { useLiveSubscription } from '#/hooks/useLiveSubscription'

const Deductions = () => {
  const [filterApi, setFilterApi] = useState<GlobalFilterApi>()
  const { enterpriseId } = useAuthentication()
  const modal = useModal(DeductionModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.payroll.deductions'))

  const { data, error, loading, subscribeToMore, refetch } = useDeductionsQuery(
    {
      variables: { id: enterpriseId },
    },
  )

  useLiveSubscription({
    subscribeToMore,
    document: DeductionCreatedDocument,
    listVar: 'deductions',
    singleVar: 'deduction',
    // sortField: 'name',
    triggerUpdate: true,
    enterpriseId,
  })

  return (
    <div className="flex flex-col w-full">
      <Navs links={PayrollLinks} />
      <Toolbar
        title={t('sidebar.payroll.deductions')}
        globalFilter={filterApi?.globalFilter}
        setGlobalFilter={filterApi?.setGlobalFilter}
        setDefaultGlobalFilter={filterApi?.setDefaultGlobalFilter}
        actionLabel="action.add_deduction"
        onClick={() => modal.show()}
        refetch={refetch}
      />

      {/* Table here */}
      <div className="text-sm">
        <DeductionTable
          modal={modal}
          dataSource={data?.deductions || []}
          onGlobalFilterChanged={setFilterApi}
          error={error}
          refetch={refetch}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default Deductions
