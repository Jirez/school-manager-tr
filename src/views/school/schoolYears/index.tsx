import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { SchoolYearLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import SchoolYearModal from './SchoolYearModal'
import { SchoolYearCreatedDocument, useSchoolYearsQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './schoolYearModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useLiveSubscription } from '#/hooks/useLiveSubscription'

const SchoolYears = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(SchoolYearModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.school.schoolYears'))

  const { data, error, loading, subscribeToMore, refetch } =
    useSchoolYearsQuery({
      variables: { id: enterpriseId },
    })

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    data: data?.schoolYears || [],
    columns,
  })

  useLiveSubscription({
    subscribeToMore,
    document: SchoolYearCreatedDocument,
    listVar: 'schoolYears',
    singleVar: 'schoolYear',
    sortField: 'label',
    triggerUpdate: true,
    enterpriseId,
  })

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={SchoolYearLinks} />
      <Toolbar
        title={t('sidebar.school.schoolYears')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_schoolYear"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <CustomTable
          table={table as any}
          modal={modal}
          error={error}
          loading={loading}
          onRetry={() => refetch()}
        />
      </div>
    </Scrollbar>
  )
}

export default SchoolYears
