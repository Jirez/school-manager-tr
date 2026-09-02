import type { FC } from 'react'
import { useMemo } from 'react'
import { showDisplayedRowCount } from '@/utils/helpers'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import { useTranslation } from 'react-i18next'
import CommonTable from '@/@core/components/react-table/common-react-table'
import type { ColumnDef } from '@tanstack/react-table'
import RoleDelete from '@/views/users/role/RoleDelete'
import type { RoleType } from '@/views/users/role/role.type'
import Avatar from '@/@core/components/avatar'
import { Shield, ShieldCheck, FileText } from 'lucide-react'
import { Badge } from 'reactstrap'
import type { AppFeatures } from '#/hooks/table'

const RoleTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<AppFeatures, RoleType>[]>(
    () => [
      {
        header: `${t('label-name')}`,
        accessorKey: 'name',
        cell: ({ row: { original } }) => (
          <div className="flex items-center gap-3">
            <Avatar
              color={
                original.allPermissions ? 'light-success' : 'light-primary'
              }
              icon={
                original.allPermissions ? (
                  <ShieldCheck size={18} />
                ) : (
                  <Shield size={18} />
                )
              }
            />
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 dark:text-gray-100">
                {original.name}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                ID: {original.id}
              </span>
            </div>
          </div>
        ),
      },
      {
        header: `${t('label-active')}`,
        accessorKey: 'active',
        cell: ({ row: { original } }) => (
          <ActiveRenderer active={original.active} size="sm" />
        ),
      },
      {
        header: `${t('label-all-permissions')}`,
        accessorKey: 'allPermissions',
        cell: ({ row: { original } }) =>
          original.allPermissions ? (
            <Badge color="light-success" pill className="text-uppercase">
              {t('label-yes')}
            </Badge>
          ) : (
            <Badge color="light-secondary" pill className="text-uppercase">
              {t('label-no')}
            </Badge>
          ),
      },
      {
        header: `${t('label-description')}`,
        accessorKey: 'description',
        cell: ({ row: { original } }) => (
          <div className="flex items-center gap-2 max-w-[250px]">
            <FileText size={14} className="text-gray-400 shrink-0" />
            <span className="text-gray-500 truncate italic">
              {original.description || t('text-no-description')}
            </span>
          </div>
        ),
      },
      {
        header: 'Actions',
        id: 'roles',
        meta: { align: 'right' },
        cell: ({ row: { original } }) => (
          <ActionRenderer
            params={original}
            deleteElement={<RoleDelete />}
            updateElement={<span />}
            formId="role"
            modal={props.modal}
          />
        ),
      },
    ],
    [t, props.modal],
  )

  return (
    <CommonTable
      data={props.dataSource!}
      columns={columns}
      onModelUpdate={(rows) => showDisplayedRowCount(rows)}
      showQuickFilter={false}
      onGlobalFilterChanged={props.onGlobalFilterChanged}
      modal={props.modal}
    />
  )
}

export default RoleTable
