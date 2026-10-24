import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { PaymentLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import {
  OperationClassCreatedDocument,
  useOperationClassesQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useTableColumns } from './operationClassModel'
import OperationClassModal from './OperationClassModal'
import { useLiveSubscription } from '#/hooks/useLiveSubscription'

const OperationClasses = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(OperationClassModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.core.operationClasses'))

  const { data, error, loading, subscribeToMore, refetch } =
    useOperationClassesQuery({
      variables: { id: enterpriseId },
    })

  useLiveSubscription({
    subscribeToMore,
    document: OperationClassCreatedDocument,
    listVar: 'operationClasses',
    singleVar: 'operationClass',
    sortField: 'name',
    triggerUpdate: true,
    enterpriseId,
  })

  const { columns } = useTableColumns(modal)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.operationClasses || [],
  })

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={PaymentLinks} />
      <Toolbar
        title={t('sidebar.core.operationClasses')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_operationClass"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <CustomTable
          modal={modal}
          table={table as any}
          loading={loading}
          error={error}
          onRetry={refetch}
        />
      </div>
    </Scrollbar>
  )
}

export default OperationClasses
