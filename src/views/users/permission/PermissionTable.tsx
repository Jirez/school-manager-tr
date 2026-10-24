import { useMemo } from 'react'
import type { FC } from 'react'
import { showDisplayedRowCount, cutText } from '@/utils/helpers'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import CommonTable from '@/@core/components/react-table/common-react-table'
import PermissionDelete from '@/views/users/permission/PermissionDelete'
import type { PermissionType } from '@/views/users/permission/permission.type'
import { Shield, CheckCircle, AlignLeft } from 'lucide-react'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import { createAppColumnHelper } from '#/hooks/table'
import { m } from '@/paraglide/messages'

const columnHelper = createAppColumnHelper<PermissionType>()

const PermissionTable: FC<CommonTableProps> = (props) => {
  const columns = useMemo(
    () =>
      columnHelper.columns([
        {
          id: 'code',
          accessorKey: 'code',
          header: () => (
            <div className="flex items-center gap-0.5">
              <Shield size={14} className="text-primary" /> {m.label_code()}
            </div>
          ),
          cell: ({ row: { original } }) => (
            <TextWithAvatar
              letter={original.code.charAt(0)}
              // @ts-ignore desc
              title={m[original.code]?.() || original.code}
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
              <CheckCircle size={14} /> {m.label_active()}
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
              <AlignLeft size={14} /> {m.label_description()}
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
          header: () => <div className="text-right">{m.label_actions()}</div>,
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
      ]),
    [props.modal],
  )

  return (
    <CommonTable
      data={props.dataSource!}
      columns={columns}
      onModelUpdate={(rows) => showDisplayedRowCount(rows)}
      showQuickFilter={false}
      onGlobalFilterChanged={props.onGlobalFilterChanged}
      modal={props.modal}
      error={props.error}
      loading={props.loading}
      onRetry={props.refetch}
    />
  )
}

export default PermissionTable
