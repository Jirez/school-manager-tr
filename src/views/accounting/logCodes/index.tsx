import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { AccountLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import LogCodeModal from '@/views/accounting/logCodes/LogCodeModal'
import { LogCodeCreatedDocument, useLogCodesQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './logCodeModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'

const LogCodes = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(LogCodeModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.accounting.codes'))

  const { data, error, loading, subscribeToMore, refetch } = useLogCodesQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.logCodes || [],
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={AccountLinks} />
      <Toolbar
        title={t('sidebar.accounting.codes')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_logCode"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={LogCodeCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="logCodes"
          singleVar="logCode"
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

export default LogCodes
