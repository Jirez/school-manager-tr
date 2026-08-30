import { SplitButton } from '@/@core/components/ui/buttons/split-button'
import { UserPlus, FileSpreadsheet } from 'lucide-react'
import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { StudentsLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import TeacherModal from './TeacherModal'
import ImportTeacherModal from './ImportTeacherModal'
import { PersonnelCreatedDocument, usePersonnelQuery } from '@/gql/graphql'
import { useAbility } from '@/context/Can'
import { useTitle } from 'ahooks'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useTableColumns } from './personnelModel'

const Personnel = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(TeacherModal)
  const importModal = useModal(ImportTeacherModal)
  const { t } = useTranslation()
  const ability = useAbility()
  useTitle(t('sidebar.personnel'))

  const { data, error, loading, subscribeToMore, refetch } = usePersonnelQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    data: data?.personnels || [],
    columns,
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  const extraButton = () =>
    ability.can('write', 'teacher') && (
      <SplitButton
        primaryAction={{
          label: t('action.add_teacher'),
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
        title={t('sidebar.personnel')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_teacher"
        onClick={() => modal.show()}
        extraButton={extraButton()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={PersonnelCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="personnels"
          singleVar="personnel"
          sortField="lastName"
          triggerUpdate={true}
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {({ personnels }) => (
            <CustomTable table={table} modal={modal} loading={loading} />
          )}
        </LiveView>
      </div>
    </Scrollbar>
  )
}

export default Personnel
