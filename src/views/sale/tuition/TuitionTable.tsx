import { useMemo } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { CreditCard, Hash, Tag, AlertCircle, CheckCircle2 } from 'lucide-react'
import styled from 'styled-components'

import CommonTable from '@/@core/components/react-table/common-react-table'
import type { TuitionType } from './tuition.type'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import { TypeBadge, SkuText } from '@/@core/components/ui/table/table.style'
import type { AppFeatures } from '#/hooks/table'

const NameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
`

const PriceText = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  color: #28c76f;
`

interface Props extends CommonTableProps {
  onRowClicked: (data: any) => void
  onAddButtonClick?: () => void
  initialFilter?: string
}

const TuitionTable: FC<Props> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<AppFeatures, TuitionType>[]>(
    () => [
      {
        id: 'numberOrder',
        header: () => (
          <div className="flex items-center gap-0.5 text-secondary">
            <Hash size={14} /> N°
          </div>
        ),
        accessorKey: 'numberOrder',
        cell: (info) => <SkuText>{(info.getValue() as string) || '-'}</SkuText>,
        size: 10,
      },
      {
        id: 'name',
        header: () => (
          <div className="flex items-center gap-0.5 text-primary">
            <CreditCard size={14} /> {t('label-name')}
          </div>
        ),
        accessorKey: 'name',
        cell: (info) => (
          <NameContainer>{info.getValue() as string}</NameContainer>
        ),
        size: 250,
      },
      {
        id: 'productCategory',
        header: () => (
          <div className="flex items-center gap-0.5 text-info">
            <Tag size={14} /> {t('label-category')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <TypeBadge $color="info" className="!px-2">
            {original.productCategory?.name || t('label-none')}
          </TypeBadge>
        ),
        size: 150,
      },
      /* {
        id: "salePrice",
        header: () => (
          <div className="flex items-center gap-0.5 text-success">
            <Banknote size={14} /> {t("label-salePrice")}
          </div>
        ),
        accessorKey: "salePriceF",
        cell: (info) => (
          <PriceText>{(info.getValue() as string) || "0"}</PriceText>
        ),
        size: 120,
      }, */
      {
        id: 'isMandatory',
        header: () => (
          <div className="flex items-center gap-0.5 text-warning">
            <AlertCircle size={14} /> {t('label-type')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <TypeBadge $color={original.isMandatory ? 'danger' : 'warning'}>
            {original.isMandatory ? t('label-mandatory') : t('label-optional')}
          </TypeBadge>
        ),
        size: 120,
      },
      {
        id: 'active',
        header: () => (
          <div className="flex items-center gap-0.5">
            <CheckCircle2 size={14} /> {t('label-status')}
          </div>
        ),
        accessorKey: 'active',
        cell: (info) => <ActiveRenderer active={info.getValue() as boolean} />,
        size: 100,
      },
    ],
    [t],
  )

  return (
    <div className="text-sm">
      <CommonTable
        data={props.dataSource!}
        columns={columns}
        //onModelUpdate={rows => showDisplayedRowCount(rows)}
        showQuickFilter={true}
        onGlobalFilterChanged={props.onGlobalFilterChanged}
        modal={props.modal}
        showCheckbox={false}
        onRowClicked={props.onRowClicked}
        pageSize={15}
        initialFilter={props.initialFilter}
      />
    </div>
  )
}

export default TuitionTable
