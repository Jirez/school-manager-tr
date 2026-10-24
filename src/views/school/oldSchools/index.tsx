import { useState } from 'react'
import { useModal } from '@ebay/nice-modal-react'
import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { StudentsLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import OldSchoolTable from './OldSchoolTable'
import OldSchoolModal from './OldSchoolModal'
import { OldSchoolCreatedDocument, useOldSchoolsQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useLiveSubscription } from '#/hooks/useLiveSubscription'

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

  useLiveSubscription({
    subscribeToMore,
    document: OldSchoolCreatedDocument,
    listVar: 'oldSchools',
    singleVar: 'oldSchool',
    sortField: 'name',
    triggerUpdate: true,
    enterpriseId,
  })

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
        {data?.oldSchools && (
          <OldSchoolTable
            modal={modal}
            dataSource={data.oldSchools}
            onGlobalFilterChanged={setFilterApi}
            error={error}
            refetch={refetch}
            loading={loading}
          />
        )}
      </div>
    </Scrollbar>
  )
}

export default OldSchools
