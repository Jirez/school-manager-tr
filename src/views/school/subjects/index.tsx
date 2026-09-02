import { useTranslation } from 'react-i18next'
import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { SubjectLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import SubjectFormModal from './SubjectFormModal'
import { useSubjectCreatedSubscription, useSubjectsQuery } from '@/gql/graphql'
import { useMount, useTitle } from 'ahooks'
import { useTableColumns } from './subjectModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import React, { useState } from 'react'

const Subjects = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(SubjectFormModal)
  const [isMount, setIsMount] = useState(false)
  const { t } = useTranslation()
  useTitle(t('sidebar.subjects'))

  const { data, error, loading, refetch } = useSubjectsQuery({
    variables: { id: enterpriseId },
  })

  const { data: subjectCreatedData } = useSubjectCreatedSubscription()

  const { columns } = useTableColumns(modal)
  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    data: data?.subjects || [],
    columns,
  })

  React.useEffect(() => {
    if (subjectCreatedData) {
      refetch()
    }
  }, [subjectCreatedData])

  useMount(() => {
    setIsMount(true)
  })

  if (!isMount) {
    return null
  }

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={SubjectLinks} />
      <Toolbar
        title={t('sidebar.subjects')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_subject"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <CustomTable modal={modal} table={table as any} loading={loading} />
      </div>
    </Scrollbar>
  )
}

export default Subjects
