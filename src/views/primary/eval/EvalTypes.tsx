import { useState } from 'react'
import { Card } from 'reactstrap'
import { useModal } from '@ebay/nice-modal-react'
import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { CompetenceLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import { EvalTypeCreatedDocument, useEvalTypesQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import EvalTypeTable from './EvalTypeTable'
import EvalTypeModal from './EvalTypeModal'

const EvalTypes = () => {
  const [filterApi, setFilterApi] = useState<GlobalFilterApi>()
  const { enterpriseId } = useAuthentication()
  const modal = useModal(EvalTypeModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.primary.evalTypes'))

  const { data, error, loading, subscribeToMore, refetch } = useEvalTypesQuery({
    variables: { id: enterpriseId },
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={CompetenceLinks} />
      <Toolbar
        title={t('sidebar.primary.evalTypes')}
        globalFilter={filterApi?.globalFilter}
        setGlobalFilter={filterApi?.setGlobalFilter}
        setDefaultGlobalFilter={filterApi?.setDefaultGlobalFilter}
        actionLabel="action.add_evalType"
        onClick={() => modal.show()}
        refetch={refetch}
      />

      {/* Table here */}
      <Card className="text-sm">
        <LiveView
          document={EvalTypeCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="evalTypes"
          singleVar="evalType"
          sortField="name"
          triggerUpdate={false}
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {({ evalTypes }) => (
            <EvalTypeTable
              modal={modal}
              dataSource={evalTypes}
              onGlobalFilterChanged={setFilterApi}
            />
          )}
        </LiveView>
      </Card>
    </Scrollbar>
  )
}

export default EvalTypes
