import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { ClassLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import ClassModal from '@/views/school/classes/ClassModal'
import { ClassCreatedDocument, useClassesQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './classModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'

const Classes = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(ClassModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.school.classes'))

  const { data, error, loading, subscribeToMore, refetch } = useClassesQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    data: data?.clazzes || [],
    columns,
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={ClassLinks} />
      <Toolbar
        title={t('sidebar.school.classes')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_class"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={ClassCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="clazzes"
          singleVar="clazz"
          sortField="name"
          triggerUpdate={true}
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {() => <CustomTable table={table as any} modal={modal} />}
        </LiveView>
      </div>
    </Scrollbar>
  )
}

export default Classes
