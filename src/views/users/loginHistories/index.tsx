import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { UserLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import LoginHistoryTable from './LoginHistoryTable'
import { useLoginHistoriesQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'

const LoginHistories = () => {
  const [filterApi] = useState<GlobalFilterApi>()
  const { enterpriseId } = useAuthentication()
  //const modal = useModal(PaymentModeModal);
  const { t } = useTranslation()
  useTitle(t('sidebar.users.history'))

  const { data, error, loading, refetch } = useLoginHistoriesQuery({
    variables: { id: enterpriseId },
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={UserLinks} />
      <Toolbar
        title={t('sidebar.users.history')}
        globalFilter={filterApi?.globalFilter}
        setGlobalFilter={filterApi?.setGlobalFilter}
        setDefaultGlobalFilter={filterApi?.setDefaultGlobalFilter}
        //actionLabel="action.add_paymentMode"
        //onClick={() => modal.show()}
        refetch={() => refetch()}
      />

      {/* Table here */}
      <div className="text-sm">
        <LoginHistoryTable
          dataSource={data?.loginHistories || []}
          loading={loading}
        />
      </div>
    </Scrollbar>
  )
}

export default LoginHistories
