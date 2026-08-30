import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { Badge, Card } from 'reactstrap'
import type { ColumnDef } from '@tanstack/react-table'

import { concat, showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import UserDelete from '@/views/users/users/UserDelete'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import type { UserType } from './User.type'
import CommonTable from '@/@core/components/react-table/common-react-table'
import { useUserToggleStatusMutation } from '@/gql/graphql'

interface UserTableProps extends CommonTableProps {}

const UserTable: FC<UserTableProps> = (props) => {
  const { t } = useTranslation()
  const [toggle, { loading }] = useUserToggleStatusMutation()

  const columns = useMemo<ColumnDef<UserType>[]>(
    () => [
      {
        accessorKey: 'username',
        header: () => t('label-username'),
        cell: (info) => {
          const name = info.getValue() as string
          const registrationNumber = t(info.row.original?.person.__typename)

          return (
            <TextWithAvatar
              letter={name.charAt(0)}
              title={name}
              subtitle={registrationNumber}
            />
          )
        },
      },
      {
        accessorKey: 'person.lastName',
        header: () => t('label-accountHolder'),
        cell: (info) => (
          <span className="text-xs">
            {concat(
              info.row.original?.person.lastName,
              info.row.original?.person.firstName,
            )}
          </span>
        ),
      },
      {
        accessorKey: 'creationDate',
        header: () => t('label-creationDate'),
        cell: (info) => (
          <span className="text-xs">
            {dayjs(info.getValue() as string).format('DD MMM YYYY')}
          </span>
        ),
      },
      {
        accessorKey: 'lastLogin',
        header: () => t('label-lastLogin'),
        cell: (info) => (
          <span className="text-xs">
            {info.getValue()
              ? dayjs(info.getValue() as string).format('DD MMM YYYY')
              : '-'}
          </span>
        ),
      },
      {
        accessorKey: 'isEnabled',
        header: () => t('label-active'),
        cell: (info) => (
          <ActiveRenderer
            active={info.getValue() as boolean}
            onClick={() =>
              toggle({ variables: { userId: info.row.original?.id! } })
            }
            loading={loading}
          />
        ),
      },
      {
        accessorKey: 'mfa',
        header: () => t('label-mfa'),
        cell: (info) => (
          <ActiveRenderer
            active={info.getValue() as boolean}
            activeText="label.yes"
            inactiveText="label.no"
          />
        ),
      },
      {
        accessorKey: 'userGroupCollection',
        header: () => t('label-groups'),
        cell: (info) => {
          return (info.getValue() as any[]).map(({ name }: any) => {
            let color = name.length > 5 ? 'secondary' : 'warning'

            return (
              <Badge color={color} key={name} className="badge-glow">
                {name.toUpperCase()}
              </Badge>
            )
          })
        },
      },
      {
        id: 'actions',
        header: () => t('label-actions'),
        cell: (info) => (
          <ActionRenderer
            params={info.row.original}
            deleteElement={<UserDelete />}
            updateElement={<span />}
            formId="user"
            modal={props.modal}
          />
        ),
      },
    ],
    [],
  )

  return (
    <>
      <Card className="text-sm">
        <CommonTable
          data={props.dataSource!}
          columns={columns}
          onModelUpdate={(rows) => showDisplayedRowCount(rows)}
          showQuickFilter={false}
          onGlobalFilterChanged={props.onGlobalFilterChanged}
          onRowSelected={props.onRowSelected}
          loading={props.loading}
        />
      </Card>
    </>
  )
}

export default UserTable
