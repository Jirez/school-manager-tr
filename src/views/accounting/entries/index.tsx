import { useState } from 'react'
import { useModal } from '@ebay/nice-modal-react'
import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { AccountEntriesLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import AccountingEntryTable from './AccountingEntryTable'
import AccountingEntryModal from './AccountingEntryModal'
import { OperationCreatedDocument, useOperationsQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'

const AccountingEntries = () => {
  const [filterApi, setFilterApi] = useState<GlobalFilterApi>()
  const { enterpriseId } = useAuthentication()
  const modal = useModal(AccountingEntryModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.accounting.journal'))

  const { data, loading, error, subscribeToMore, refetch } = useOperationsQuery(
    {
      variables: { id: enterpriseId },
    },
  )

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={AccountEntriesLinks} />
      <Toolbar
        title={t('sidebar.accounting.journal')}
        globalFilter={filterApi?.globalFilter}
        setGlobalFilter={filterApi?.setGlobalFilter}
        setDefaultGlobalFilter={filterApi?.setDefaultGlobalFilter}
        actionLabel="action.add_journal"
        onClick={() => modal.show()}
        refetch={refetch}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={OperationCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="operations"
          singleVar="operation"
          triggerUpdate={true}
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {({ operations }) => (
            <AccountingEntryTable
              modal={modal}
              dataSource={
                operations &&
                operations.filter(
                  ({ __typename }: any) => __typename === 'AccountingEntry',
                )
              }
              onGlobalFilterChanged={setFilterApi}
            />
          )}
        </LiveView>
      </div>
    </Scrollbar>
  )
}

export default AccountingEntries
