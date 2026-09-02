import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { OfficialLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import OfficialFunctionModal from '@/views/school/officialFunctions/OfficialFunctionModal'
import {
  OfficialTypeCreatedDocument,
  useOfficialTypesQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './officialFunctionModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'

const OfficialFunctions = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(OfficialFunctionModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.school.liableTypes'))

  const { data, error, loading, subscribeToMore, refetch } =
    useOfficialTypesQuery()

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.officialTypes || [],
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={OfficialLinks} />
      <Toolbar
        title={t('sidebar.school.liableTypes')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_officialFunction"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={OfficialTypeCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="officialTypes"
          singleVar="officialType"
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

export default OfficialFunctions
