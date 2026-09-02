import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { ClassLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import CouncilDecisionModal from './CouncilDecisionModal'
import {
  CouncilDecisionCreatedDocument,
  useCouncilDecisionsQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './councilDecisionModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'

const CouncilDecisions = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(CouncilDecisionModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.school.councilDecisions'))

  const { data, error, loading, subscribeToMore, refetch } =
    useCouncilDecisionsQuery({
      variables: { id: enterpriseId },
    })

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.councilDecisions || [],
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={ClassLinks} />
      <Toolbar
        title={t('sidebar.school.councilDecisions')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_councilDecision"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={CouncilDecisionCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="councilDecisions"
          singleVar="councilDecision"
          sortField="name"
          triggerUpdate={true}
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {() => (
            <CustomTable table={table as any} modal={modal} loading={loading} />
          )}
        </LiveView>
      </div>
    </Scrollbar>
  )
}

export default CouncilDecisions
