import { useState } from 'react'
import { useModal } from '@ebay/nice-modal-react'
import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { CompetenceLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import { CompetenceCreatedDocument, useCompetencesQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import CompetenceTable from './CompetenceTable'
import CompetenceModal from './CompetenceModal'

const Competences = () => {
  const [filterApi, setFilterApi] = useState<GlobalFilterApi>()
  const { enterpriseId } = useAuthentication()
  const modal = useModal(CompetenceModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.primary.competences'))

  const { data, error, loading, subscribeToMore, refetch } =
    useCompetencesQuery({
      variables: { id: enterpriseId },
    })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={CompetenceLinks} />
      <Toolbar
        title={t('sidebar.primary.competences')}
        globalFilter={filterApi?.globalFilter}
        setGlobalFilter={filterApi?.setGlobalFilter}
        setDefaultGlobalFilter={filterApi?.setDefaultGlobalFilter}
        actionLabel="action.add_competence"
        onClick={() => modal.show()}
        refetch={refetch}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={CompetenceCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="competences"
          singleVar="competence"
          sortField="name"
          triggerUpdate={false}
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {({ competences }) => (
            <CompetenceTable
              modal={modal}
              dataSource={competences}
              onGlobalFilterChanged={setFilterApi}
            />
          )}
        </LiveView>
      </div>
    </Scrollbar>
  )
}

export default Competences
