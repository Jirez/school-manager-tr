import { useState } from 'react'
import { SplitButton } from '@/@core/components/ui/buttons/split-button'
import { UserPlus, FileSpreadsheet } from 'lucide-react'
import { useModal } from '@ebay/nice-modal-react'
import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { StudentsLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import GuardianTable from '@/views/school/guardians/GuardianTable'
import GuardianModal from './GuardianModal'
import ImportGuardianModal from './ImportGuardianModal'
import { GuardianCreatedDocument, useGuardiansQuery } from '@/gql/graphql'
import { useAbility } from '@/context/Can'
import { useTitle } from 'ahooks'
import { useLiveSubscription } from '#/hooks/useLiveSubscription'

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

  useLiveSubscription({
    subscribeToMore,
    document: GuardianCreatedDocument,
    listVar: 'guardians',
    singleVar: 'guardian',
    sortField: 'lastName',
    triggerUpdate: true,
    enterpriseId,
  })

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
        <GuardianTable
          modal={modal}
          dataSource={data?.guardians || ([] as any)}
          onGlobalFilterChanged={setFilterApi}
          refetch={refetch}
          error={error}
          loading={loading}
        />
      </div>
    </Scrollbar>
  )
}

export default Guardians
