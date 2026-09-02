import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActionRenderer from '@/@core/components/base-table/action-renderer'
import OldSchoolDelete from './OldSchoolDelete'
import type { OldSchoolType } from './oldSchool.type'
import CommonTable from '@/@core/components/react-table/common-react-table'
import { Building2, MapPin, Phone, Mail } from 'lucide-react'
import { TypeBadge } from '@/@core/components/ui/table/table.style'
import styled from 'styled-components'
import type { AppFeatures } from '#/hooks/table'

const ContactText = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: #5e5873;

  .dark-layout & {
    color: #b4b7bd;
  }

  svg {
    width: 14px;
    height: 14px;
    opacity: 0.6;
  }
`

const OldSchoolTable: FC<CommonTableProps> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<AppFeatures, OldSchoolType>[]>(
    () => [
      {
        accessorKey: 'name',
        header: () => (
          <div className="flex items-center gap-1">
            <Building2 size={14} className="text-primary" />
            {t('label-name')}
          </div>
        ),
        cell: (info) => (
          <span className="font-bold text-gray-800 dark:text-gray-200">
            {info.getValue() as string}
          </span>
        ),
        size: 200,
      },
      {
        accessorFn: (row) => row.address?.country,
        id: 'country',
        header: () => (
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            {t('label-country')}
          </div>
        ),
        cell: (info) => (
          <TypeBadge $color="secondary" className="!py-0 !px-2">
            {info.getValue() as string}
          </TypeBadge>
        ),
        size: 150,
      },
      {
        accessorFn: (row) => row.address?.town,
        id: 'town',
        header: () => (
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            {t('label-town')}
          </div>
        ),
        cell: (info) => (
          <TypeBadge $color="secondary" className="!py-0 !px-2">
            {info.getValue() as string}
          </TypeBadge>
        ),
        size: 150,
      },
      {
        accessorFn: (row) => row.contactInfo?.telephone,
        id: 'telephone',
        header: () => (
          <div className="flex items-center gap-1">
            <Phone size={14} />
            {t('label-telephone')}
          </div>
        ),
        cell: (info) => (
          <ContactText>
            <Phone size={12} />
            {info.getValue() as string}
          </ContactText>
        ),
        size: 150,
      },
      {
        accessorFn: (row) => row.contactInfo?.email,
        id: 'email',
        header: () => (
          <div className="flex items-center gap-1">
            <Mail size={14} />
            {t('label-email')}
          </div>
        ),
        cell: (info) => (
          <ContactText>
            <Mail size={12} />
            {info.getValue() as string}
          </ContactText>
        ),
        size: 200,
      },
      {
        id: 'actions',
        header: () => (
          <div className="text-right w-full">{t('label-actions')}</div>
        ),
        cell: ({ row: { original } }) => (
          <div className="flex justify-end">
            <ActionRenderer
              params={original}
              deleteElement={<OldSchoolDelete />}
              updateElement={<span />}
              formId="oldSchool"
              modal={props.modal}
            />
          </div>
        ),
        size: 80,
      },
    ],
    [props.modal, t],
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

export default OldSchoolTable
