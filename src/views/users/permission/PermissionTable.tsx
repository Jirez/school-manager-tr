import { useMemo } from 'react'
import type { FC } from 'react'
import { showDisplayedRowCount, cutText } from '@/utils/helpers'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import { useTranslation } from 'react-i18next'
import CommonTable from '@/@core/components/react-table/common-react-table'
import type { ColumnDef } from '@tanstack/react-table'
import PermissionDelete from '@/views/users/permission/PermissionDelete'
import type { PermissionType } from '@/views/users/permission/permission.type'
import { Shield, CheckCircle, AlignLeft } from 'lucide-react'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'

const PermissionTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<PermissionType>[]>(
    () => [
      {
        id: 'code',
        accessorKey: 'code',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Shield size={14} className="text-primary" /> {t('label-code')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <TextWithAvatar
            letter={original.code.charAt(0)}
            title={t(original.code)}
            titleClassName="!font-semibold"
            subtitle={original.code}
          />
        ),
        size: 250,
      },
      {
        id: 'active',
        accessorKey: 'active',
        header: () => (
          <div className="flex items-center gap-0.5 justify-center w-full">
            <CheckCircle size={14} /> {t('label-active')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <div className="flex justify-center">
            <ActiveRenderer active={original.active} />
          </div>
        ),
        size: 80,
      },
      {
        id: 'description',
        header: () => (
          <div className="flex items-center gap-0.5">
            <AlignLeft size={14} /> {t('label-description')}
          </div>
        ),
        accessorKey: 'description',
        cell: (info) => (
          <span
            title={info.getValue() as string}
            className="text-sm text-muted"
          >
            {cutText(info.getValue() as string, 80)}
          </span>
        ),
        size: 300,
      },
      {
        id: 'actions',
        header: () => <div className="text-right">{t('label-actions')}</div>,
        cell: ({ row: { original } }) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={original}
              deleteElement={<PermissionDelete />}
              updateElement={<span />}
              formId="permission"
              modal={props.modal}
            />
          </div>
        ),
        size: 80,
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

export default PermissionTable
