import { useState } from 'react'
import { useModal } from '@ebay/nice-modal-react'
import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { UserLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import { useTranslation } from 'react-i18next'
import ErrorComponent from '@/@core/components/ui/error-component'
import { formatError } from '@/utils/ErrorHelper'
import PermissionModal from '@/views/users/permission/PermissionModal'
import PermissionTable from '@/views/users/permission/PermissionTable'
import { useTitle } from 'ahooks'
import { toast } from 'react-toastify'
import {
  usePermissionsQuery,
  PermissionSubscriptionDocument,
  useInitPermissionsMutation,
} from '@/gql/graphql'
import { TOAST_OPTIONS } from '@/utils/constants'
import SplitButton from '@/@core/components/ui/buttons/split-button'
import { RefreshCw } from 'lucide-react'

const Permissions = () => {
  const [filterApi, setFilterApi] = useState<GlobalFilterApi>()
  const { enterpriseId } = useAuthentication()
  const modal = useModal(PermissionModal)
  const { t } = useTranslation()
  useTitle(t('text-permissions'))

  const { data, error, loading, subscribeToMore, refetch } =
    usePermissionsQuery()

  const [initPermissions] = useInitPermissionsMutation()

  const schoolNumberOrders = async () => {
    toast.info('Opération en cours, veuillez patienter...')

    await initPermissions()
    refetch()

    toast.success('Initialisation des permissions terminée', {
      ...TOAST_OPTIONS,
    })
  }

  const extraButton = () => (
    <SplitButton
      className="w-full"
      primaryAction={{
        label: t('action.add_permission'),
        onClick: () => modal.show({ refetch }),
      }}
      dropdownActions={[
        {
          label: t('label-updatePermissions'),
          onClick: schoolNumberOrders,
          icon: <RefreshCw size={15} />,
        },
      ]}
    />
  )

  if (error) {
    return (
      <div className="mx-auto">
        <ErrorComponent
          message={formatError(error)}
          title={t('label-graphqlError')}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full">
      <Navs links={UserLinks} />
      <Toolbar
        title={t('sidebar.users.permissions')}
        globalFilter={filterApi?.globalFilter}
        setGlobalFilter={filterApi?.setGlobalFilter}
        setDefaultGlobalFilter={filterApi?.setDefaultGlobalFilter}
        actionLabel="action.add_permission"
        //onClick={() => modal.show()}
        extraButton={extraButton()}
        refetch={refetch}
        abilitySubject="role"
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={PermissionSubscriptionDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="permissions"
          singleVar="permission"
          loading={loading}
          enterpriseId={enterpriseId}
          triggerUpdate={true}
        >
          {({ permissions }) => (
            <PermissionTable
              modal={modal}
              dataSource={permissions}
              onGlobalFilterChanged={setFilterApi}
            />
          )}
        </LiveView>
      </div>
    </div>
  )
}

export default Permissions
