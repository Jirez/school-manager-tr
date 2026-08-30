import { useState } from 'react'
import { useModal } from '@ebay/nice-modal-react'
import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { PayrollLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import { useTranslation } from 'react-i18next'
import ErrorComponent from '@/@core/components/ui/error-component'
import { formatError } from '@/utils/ErrorHelper'
import { useTitle } from 'ahooks'
import { DeductionCreatedDocument, useDeductionsQuery } from '@/gql/graphql'
import DeductionModal from './DeductionModal'
import DeductionTable from './DeductionTable'

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

  if (error) {
    return (
      <div className="mx-auto">
        <ErrorComponent
          message={formatError(error)}
          title={t('label-graphqlError')}
        />
      </div>
    )
  }

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
        <LiveView
          document={DeductionCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="deductions"
          singleVar="deduction"
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {({ deductions }) => (
            <DeductionTable
              modal={modal}
              dataSource={deductions}
              onGlobalFilterChanged={setFilterApi}
            />
          )}
        </LiveView>
      </div>
    </div>
  )
}

export default Deductions
