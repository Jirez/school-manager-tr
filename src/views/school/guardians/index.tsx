import { useEffect, useState } from 'react'
import { SplitButton } from '@/@core/components/ui/buttons/split-button'
import { UserPlus, FileSpreadsheet } from 'lucide-react'
import { useModal } from '@ebay/nice-modal-react'
import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { StudentsLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import GuardianTable from '@/views/school/guardians/GuardianTable'
import GuardianModal from './GuardianModal'
import ImportGuardianModal from './ImportGuardianModal'
import {
  GuardianCreatedDocument,
  useGuardianCreatedSubscription,
  useGuardiansQuery,
} from '@/gql/graphql'
import { useAbility } from '@/context/Can'
import { useTitle } from 'ahooks'

const Guardians = () => {
  const [filterApi, setFilterApi] = useState<GlobalFilterApi>()
  const { enterpriseId } = useAuthentication()
  const modal = useModal(GuardianModal)
  const importModal = useModal(ImportGuardianModal)
  const { t } = useTranslation()
  const ability = useAbility()
  useTitle(t('sidebar.students.guardian'))

  const { data, error, loading, subscribeToMore, refetch } = useGuardiansQuery({
    variables: { id: enterpriseId },
  })

  const { data: createdData, loading: createdLoading } =
    useGuardianCreatedSubscription()

  if (error) {
    return <div>Error! {error.message}</div>
  }

  useEffect(() => {
    if (createdData) {
      // setGuardians([...guardians, createdData.guardian]);
      // console.log(createdData.guardian);
    }
  }, [createdData])

  const extraButton = () =>
    ability.can('write', 'student') && (
      <SplitButton
        primaryAction={{
          label: t('action.add_guardian'),
          onClick: () => modal.show(),
          icon: <UserPlus size={16} />,
        }}
        dropdownActions={[
          {
            label: t('label-addFromFile'),
            onClick: () => importModal.show(),
            icon: <FileSpreadsheet size={16} />,
          },
        ]}
      />
    )

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={StudentsLinks} />
      <Toolbar
        title={t('sidebar.students.guardian')}
        globalFilter={filterApi?.globalFilter}
        setGlobalFilter={filterApi?.setGlobalFilter}
        setDefaultGlobalFilter={filterApi?.setDefaultGlobalFilter}
        actionLabel="action.add_guardian"
        onClick={() => modal.show()}
        extraButton={extraButton()}
        refetch={refetch}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={GuardianCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="guardians"
          singleVar="guardian"
          sortField="lastName"
          triggerUpdate={true}
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {({ guardians }) => (
            <GuardianTable
              modal={modal}
              dataSource={guardians}
              onGlobalFilterChanged={setFilterApi}
              refetch={refetch}
            />
          )}
        </LiveView>
      </div>
    </Scrollbar>
  )
}

export default Guardians
