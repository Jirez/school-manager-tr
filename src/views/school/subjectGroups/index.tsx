import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { SubjectLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import SubjectGroupModal from './SubjectGroupModal'
import {
  BranchSubjectGroupCreatedDocument,
  useSubjectGroupByBranchQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './subjectGroupModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useLiveSubscription } from '#/hooks/useLiveSubscription'

const SubjectGroups = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(SubjectGroupModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.subjects.subjectGroups'))

  const { data, error, loading, subscribeToMore, refetch } =
    useSubjectGroupByBranchQuery({
      variables: { id: enterpriseId },
    })

  useLiveSubscription({
    subscribeToMore,
    document: BranchSubjectGroupCreatedDocument,
    listVar: 'subjectGroups',
    singleVar: 'subjectGroup',
    sortField: 'name',
    triggerUpdate: true,
    enterpriseId,
  })

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.subjectGroups || [],
  })

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
        <CustomTable
          table={table as any}
          modal={modal}
          loading={loading}
          error={error}
          onRetry={() => refetch()}
        />
      </div>
    </Scrollbar>
  )
}

export default SubjectGroups
