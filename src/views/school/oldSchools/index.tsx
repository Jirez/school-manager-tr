import { useState } from 'react'
import { useModal } from '@ebay/nice-modal-react'
import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { StudentsLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import OldSchoolTable from './OldSchoolTable'
import OldSchoolModal from './OldSchoolModal'
import { OldSchoolCreatedDocument, useOldSchoolsQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'

const OldSchools = () => {
  const [filterApi, setFilterApi] = useState<GlobalFilterApi>()
  const { enterpriseId } = useAuthentication()
  const modal = useModal(OldSchoolModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.students.oldSchools'))

  const { data, error, loading, subscribeToMore, refetch } = useOldSchoolsQuery(
    {
      variables: { id: enterpriseId },
    },
  )

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={StudentsLinks} />
      <Toolbar
        title={t('sidebar.students.oldSchools')}
        globalFilter={filterApi?.globalFilter}
        setGlobalFilter={filterApi?.setGlobalFilter}
        setDefaultGlobalFilter={filterApi?.setDefaultGlobalFilter}
        actionLabel="action.add_oldSchool"
        onClick={() => modal.show()}
        refetch={refetch}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={OldSchoolCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="oldSchools"
          singleVar="oldSchool"
          sortField="name"
          triggerUpdate={true}
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {({ oldSchools }) => (
            <OldSchoolTable
              modal={modal}
              dataSource={oldSchools}
              onGlobalFilterChanged={setFilterApi}
            />
          )}
        </LiveView>
      </div>
    </Scrollbar>
  )
}

export default OldSchools
