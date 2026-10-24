import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { UserLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import UserModal from '@/views/users/users/UserModal'
import UsersDelete from './UsersDelete'
import BulkActionsBar from '@/@core/components/ui/bulk-actions-bar'
import { CheckCircle, XCircle } from 'react-feather'
import {
  UserCreatedDocument,
  useUsersChangeStatusMutation,
  useUsersQuery,
} from '@/gql/graphql'
import { useAbility } from '@/context/Can'
import { useTitle } from 'ahooks'
import { useTableColumns } from './userModel'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useTable } from '#/@core/components/react-table/useTable'
import { useLiveSubscription } from '#/hooks/useLiveSubscription'

const Users = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(UserModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.users'))
  const ability = useAbility()

  const { data, error, loading, subscribeToMore, refetch } = useUsersQuery({
    variables: { id: enterpriseId },
  })

  useLiveSubscription({
    subscribeToMore,
    document: UserCreatedDocument,
    listVar: 'users',
    singleVar: 'user',
    sortField: 'username',
    triggerUpdate: true,
    enterpriseId,
  })

  const [activate, { loading: activating }] = useUsersChangeStatusMutation()
  const [deactivate, { loading: deactivating }] = useUsersChangeStatusMutation()

  const { columns } = useTableColumns(modal)

  const {
    table,
    totalCount,
    // selectedFlatRows: checkedRows,
  } = useTable<any>({
    columns,
    data: data?.users || [],
  })

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={UserLinks} />
      <Toolbar
        title={t('sidebar.users')}
        globalFilter={table.globalFilter}
        setGlobalFilter={table.setGlobalFilter}
        actionLabel={ability.can('write', 'user') ? 'action.add_user' : ''}
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
        abilitySubject="user"
      />

      {/* Bulk Actions Bar */}
      <div className="px-">
        <BulkActionsBar
          selectedCount={table.getSelectedRowIds().length}
          itemLabel="utilisateur"
          itemLabelPlural="utilisateurs"
          onClearSelection={() => table.resetRowSelection()}
          actions={[
            {
              id: 'delete',
              type: 'custom',
              variant: 'danger',
              render: (
                <UsersDelete
                  ids={table
                    .getSelectedRowModel()
                    .flatRows.map(({ original }) => original.id)}
                  count={table.getSelectedRowModel().flatRows.length}
                />
              ),
            },
            {
              id: 'activate',
              label: t('label-activateAll'),
              icon: <CheckCircle size={16} />,
              variant: 'success',
              loading: activating,
              onClick: () =>
                activate({
                  variables: {
                    ids: table
                      .getSelectedRowModel()
                      .flatRows.map(({ original }) => original.id),
                    status: true,
                  },
                  onCompleted: (data) => {
                    if (data.usersChangeStatus) {
                      refetch()
                    }
                  },
                }),
            },
            {
              id: 'deactivate',
              label: t('label-deactivateAll'),
              icon: <XCircle size={16} />,
              variant: 'warning',
              loading: deactivating,
              onClick: () =>
                deactivate({
                  variables: {
                    ids: table
                      .getSelectedRowModel()
                      .flatRows.map(({ original }) => original.id),
                    status: false,
                  },
                  onCompleted: (data) => {
                    if (data.usersChangeStatus) {
                      refetch()
                    }
                  },
                }),
            },
          ]}
        />
      </div>

      {/* Table */}
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

export default Users
