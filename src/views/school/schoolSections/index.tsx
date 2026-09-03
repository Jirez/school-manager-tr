import { useState } from 'react'
import { useModal } from '@ebay/nice-modal-react'
import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { SchoolYearLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import SchoolSectionTable from '@/views/school/schoolSections/SchoolSectionTable'
import SchoolSectionModal from '@/views/school/schoolSections/SchoolSectionModal'
import {
  SchoolSectionCreatedDocument,
  useSchoolSectionsQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'

const SchoolSections = () => {
  const [filterApi, setFilterApi] = useState<GlobalFilterApi>()
  const { enterpriseId } = useAuthentication()
  const modal = useModal(SchoolSectionModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.school.schoolSections'))

  const { data, error, loading, subscribeToMore } = useSchoolSectionsQuery({
    variables: { id: enterpriseId },
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={SchoolYearLinks} />
      <Toolbar
        title={t('sidebar.school.schoolSections')}
        globalFilter={filterApi?.globalFilter}
        setGlobalFilter={filterApi?.setGlobalFilter}
        setDefaultGlobalFilter={filterApi?.setDefaultGlobalFilter}
        actionLabel="action.add_schoolSection"
        onClick={() => modal.show()}
      />

      {/* Table here */}
      <div>
        <LiveView
          document={SchoolSectionCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="schoolSections"
          singleVar="schoolSection"
          sortField="name"
          triggerUpdate={true}
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {({ schoolSections }) => (
            <SchoolSectionTable
              modal={modal}
              dataSource={schoolSections}
              onGlobalFilterChanged={setFilterApi}
            />
          )}
        </LiveView>
      </div>
    </Scrollbar>
  )
}

export default SchoolSections
