import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import LogCodeDelete from './LogCodeDelete'
import type { LogCodeType } from './LogCode.type'
import { BookOpen, Tag, CheckCircle, FileText, Hash } from 'lucide-react'
import { TypeBadge, SkuText } from '@/@core/components/ui/table/table.style'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import { cutText } from '@/utils/helpers'
import type { AppFeatures } from '#/hooks/table'

export function useTableColumns(modal?: NiceModalHandler) {
  const { t } = useTranslation()

  const columns: Array<ColumnDef<AppFeatures, LogCodeType>> = useMemo(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Tag size={14} className="text-primary" /> {t('label-name')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <TextWithAvatar
            letter={original.name.charAt(0)}
            title={original.name}
            titleClassName="!font-semibold"
            subtitle={t('label-logCode')}
          />
        ),
        size: 250,
      },
      {
        id: 'logType',
        accessorKey: 'logType',
        header: () => (
          <div className="flex items-center gap-0.5">
            <BookOpen size={14} /> {t('label-logType')}
          </div>
        ),
        cell: (info) => (
          <TypeBadge
            $color="primary"
            className="!py-0 !px-1.5 uppercase font-bold !text-[10px]"
          >
            {t(`label-${(info.getValue() as string).toLowerCase()}`)}
          </TypeBadge>
        ),
        size: 150,
      },
      {
        id: 'active',
        accessorKey: 'active',
        header: () => (
          <div className="flex items-center gap-0.5 justify-center w-full">
            <CheckCircle size={14} /> {t('label-active')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <ActiveRenderer active={info.getValue() as boolean} />
          </div>
        ),
        size: 80,
      },
      {
        id: 'note',
        accessorKey: 'note',
        header: () => (
          <div className="flex items-center gap-0.5">
            <FileText size={14} /> {t('label-note')}
          </div>
        ),
        cell: (info) => (
          <span
            className="text-gray-500 dark:text-gray-400 text-xs"
            title={info.getValue() as string}
          >
            {info.getValue() ? cutText(info.getValue() as string, 60) : '-'}
          </span>
        ),
        size: 250,
      },
      {
        id: 'id',
        header: () => (
          <div className="flex items-center gap-0.5 justify-center w-full">
            <Hash size={14} /> ID
          </div>
        ),
        accessorKey: 'id',
        cell: (info) => (
          <div className="flex justify-center">
            <SkuText>{info.getValue() as string}</SkuText>
          </div>
        ),
        size: 80,
      },
      {
        id: 'actions',
        header: () => <div className="text-right">{t('label-actions')}</div>,
        meta: { align: 'right' },
        cell: ({ row: { original } }) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={original}
              deleteElement={<LogCodeDelete />}
              updateElement={<span />}
              formId="logCode"
              modal={modal}
            />
          </div>
        ),
        size: 80,
      },
    ],
    [modal, t],
  )

  return { columns }
}
