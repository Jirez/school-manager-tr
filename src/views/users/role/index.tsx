import { useState } from 'react'
import { useModal } from '@ebay/nice-modal-react'
import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { UserLinks } from '@/navigation/links'
import { useTranslation } from 'react-i18next'
import RoleTable from '@/views/users/role/RoleTable'
import RoleModal from '@/views/users/role/RoleModal'
import { useTitle } from 'ahooks'
import { useRolesQuery, RoleNewCreatedDocument } from '@/gql/graphql'
import { useLiveSubscription } from '#/hooks/useLiveSubscription'

const Roles = () => {
  const [filterApi, setFilterApi] = useState<GlobalFilterApi>()
  const { enterpriseId } = useAuthentication()
  const modal = useModal(RoleModal)
  const { t } = useTranslation()
  useTitle(t('text-roles'))

  const { data, error, loading, subscribeToMore, refetch } = useRolesQuery({
    variables: { id: enterpriseId },
  })

  useLiveSubscription({
    subscribeToMore,
    document: RoleNewCreatedDocument,
    listVar: 'roles',
    singleVar: 'role',
    // sortField: 'name',
    triggerUpdate: true,
    enterpriseId,
  })

  return (
    <div className="flex flex-col w-full">
      <Navs links={UserLinks} />
      <Toolbar
        title={t('sidebar.users.roles')}
        globalFilter={filterApi?.globalFilter}
        setGlobalFilter={filterApi?.setGlobalFilter}
        setDefaultGlobalFilter={filterApi?.setDefaultGlobalFilter}
        actionLabel="action.add_role"
        onClick={() => modal.show()}
        refetch={refetch}
        // abilitySubject="role"
      />

      {/* Table here */}
      <div className="text-sm">
        <RoleTable
          modal={modal}
          dataSource={data?.roles || []}
          onGlobalFilterChanged={setFilterApi}
          error={error}
          loading={loading}
          refetch={refetch}
        />
      </div>
    </div>
  )
}

export default Roles
