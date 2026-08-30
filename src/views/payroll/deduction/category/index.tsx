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
import {
  DeductionCategoryCreatedDocument,
  useDeductionCategoryQuery,
} from '@/gql/graphql'
import DeductionCategoryModal from './DeductionCategoryModal'
import DeductionCategoryTable from './DeductionCategoryTable'

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
        <LiveView
          document={DeductionCategoryCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="deductionCategories"
          singleVar="deductionCategory"
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {({ deductionCategories }) => (
            <DeductionCategoryTable
              modal={modal}
              dataSource={deductionCategories}
              onGlobalFilterChanged={setFilterApi}
            />
          )}
        </LiveView>
      </div>
    </div>
  )
}

export default DeductionCategories
