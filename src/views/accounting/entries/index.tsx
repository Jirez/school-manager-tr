import { useState } from 'react'
import { useModal } from '@ebay/nice-modal-react'
import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { AccountEntriesLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import AccountingEntryTable from './AccountingEntryTable'
import AccountingEntryModal from './AccountingEntryModal'
import { OperationCreatedDocument, useOperationsQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useLiveSubscription } from '#/hooks/useLiveSubscription'

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

  useLiveSubscription({
    subscribeToMore,
    document: OperationCreatedDocument,
    listVar: 'operations',
    singleVar: 'operation',
    // sortField: 'name',
    triggerUpdate: true,
    enterpriseId,
  })

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
        <AccountingEntryTable
          modal={modal}
          dataSource={
            data?.operations?.filter(
              ({ __typename }: any) => __typename === 'AccountingEntry',
            ) || []
          }
          onGlobalFilterChanged={setFilterApi}
          loading={loading}
          refetch={refetch}
          error={error}
        />
      </div>
    </Scrollbar>
  )
}

export default AccountingEntries
