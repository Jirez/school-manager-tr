import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { SubjectLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import SubjectGroupModal from './SubjectGroupModal'
import {
  BranchSubjectGroupCreatedDocument,
  useSubjectGroupByBranchQuery,
} from '@/gql/graphql'
import { useTitle, useMount } from 'ahooks'
import { useTableColumns } from './subjectGroupModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useState } from 'react'

const SubjectGroups = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(SubjectGroupModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.subjects.subjectGroups'))
  const [isMount, setIsMount] = useState(false)

  const { data, error, loading, subscribeToMore, refetch } =
    useSubjectGroupByBranchQuery({
      variables: { id: enterpriseId },
    })

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.subjectGroups || [],
  })

  useMount(() => {
    setIsMount(true)
  })

  if (!isMount) {
    return null
  }

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={SubjectLinks} />
      <Toolbar
        title={t('sidebar.subjects.subjectGroups')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_subjectGroup"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={BranchSubjectGroupCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="subjectGroups"
          singleVar="subjectGroup"
          // sortField="name"
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

export default SubjectGroups
