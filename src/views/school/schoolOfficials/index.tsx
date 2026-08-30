import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { OfficialLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import { useTranslation } from 'react-i18next'
import SchoolOfficialModal from '@/views/school/schoolOfficials/SchoolOfficialModal'
import {
  SchoolOfficialCreatedDocument,
  useSchoolOfficialsQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './schoolOfficialModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'

const SchoolOfficials = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(SchoolOfficialModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.school.liable'))

  const { data, error, loading, subscribeToMore, refetch } =
    useSchoolOfficialsQuery({
      variables: { id: enterpriseId },
    })

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    data: data?.schoolOfficials || [],
    columns,
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <div className="flex flex-col w-full">
      <Navs links={OfficialLinks} />
      <Toolbar
        title={t('sidebar.school.liable')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_schoolOfficial"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={SchoolOfficialCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="schoolOfficials"
          singleVar="schoolOfficial"
          sortField="name"
          triggerUpdate={true}
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {({ schoolOfficials }) => (
            <CustomTable modal={modal} table={table} loading={loading} />
          )}
        </LiveView>
      </div>
    </div>
  )
}

export default SchoolOfficials
