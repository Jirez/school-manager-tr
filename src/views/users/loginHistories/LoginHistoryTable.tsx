import { useMemo, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { Card } from 'reactstrap'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import LoginHistoriesDelete from './LoginHistoriesDelete'
import CommonTable from '@/@core/components/react-table/common-react-table'

type TLoginHistory = {
  user: {
    username: string
    person: {
      __typename: string
    }
  }
  loginDate: string
  logoutDate?: string
  browserInfo?: {
    name: string
    version: string
    versionNumber: string
    mobile: boolean
    os: string
  }
}

const LoginHistoryTable: FC<CommonTableProps> = (props) => {
  const [checkedRows, setCheckedRows] = useState<any[]>([])
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<TLoginHistory>[]>(
    () => [
      {
        accessorFn: (row) => row.user.username,
        id: 'username',
        header: () => t('label-username'),
      },
      {
        accessorFn: (row) => row.user.person.__typename,
        id: 'person',
        header: () => t('label-userType'),
      },
      {
        accessorKey: 'loginDate',
        header: () => t('label-loginDate'),
        cell: (info) => (
          <span className="text-xs">
            {dayjs(info.getValue() as string).format('DD MMM YYYY:HH:mm:ss')}
          </span>
        ),
      },
      {
        accessorKey: 'logoutDate',
        header: () => t('label-logoutDate'),
      },
      {
        accessorFn: (row) => row.browserInfo?.name,
        id: 'browserName',
        header: () => t('label-browser'),
      },
      {
        accessorFn: (row) => row.browserInfo?.version,
        id: 'version',
        header: () => t('label-version'),
      },
      {
        accessorFn: (row) => row.browserInfo?.os,
        id: 'osName',
        header: () => t('label-os'),
      },
    ],
    [t],
  )

  return (
    <>
      {checkedRows.length > 0 && (
        <div className="mb-1">
          <LoginHistoriesDelete
            ids={checkedRows.map(({ original }) => original.id)}
            count={checkedRows.length}
          />
        </div>
      )}
      <Card>
        <CommonTable
          data={props.dataSource!}
          columns={columns}
          onModelUpdate={(rows) => showDisplayedRowCount(rows)}
          showQuickFilter={false}
          onGlobalFilterChanged={props.onGlobalFilterChanged}
          onRowSelected={(row) => setCheckedRows(row)}
          loading={props.loading}
        />
      </Card>
    </>
  )
}

export default LoginHistoryTable
