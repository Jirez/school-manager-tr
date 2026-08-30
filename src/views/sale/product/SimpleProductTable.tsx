import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import CommonTable from '@/@core/components/react-table/common-react-table'
import type { ProductType } from './product.type'
import { Badge } from 'reactstrap'
import { Tag, DollarSign, Archive, Layers, Hash, Package } from 'lucide-react'
import styled from 'styled-components'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import { toCurrency } from '@/utils/helpers'

const TypeBadge = styled(Badge)<{ type: string }>`
  padding: 0.25em 0.65em;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${(props) => {
    switch (props.type) {
      case 'SERVICE':
        return '#7367f022'
      case 'ARTICLE':
        return '#28c76f22'
      case 'TUITION':
        return '#ff9f4322'
      default:
        return '#ea545522'
    }
  }};
  color: ${(props) => {
    switch (props.type) {
      case 'SERVICE':
        return '#7367f0'
      case 'ARTICLE':
        return '#28c76f'
      case 'TUITION':
        return '#ff9f43'
      default:
        return '#ea5455'
    }
  }};
  font-weight: 600;
`

const SkuBadge = styled.span`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 2px 6px;
  font-family: monospace;
  font-size: 0.8rem;
  color: #6e6b7b;
`

interface Props extends CommonTableProps {
  onRowClicked: (data: any) => void
  onAddButtonClick?: () => void
  initialFilter?: string
}

const SimpleProductTable: FC<Props> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<ProductType>[]>(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Package size={14} className="text-primary" /> {t('label-name')}
          </div>
        ),
        cell: (info) => {
          const original = info.row.original
          return (
            <TextWithAvatar
              letter={original.name.charAt(0)}
              title={original.name}
              titleClassName="!font-semibold"
              subtitle={
                original.productCategory?.name ||
                (original.productType ? t(original.productType) : undefined)
              }
              avatarColor={
                original.productType === 'SERVICE'
                  ? '#28c76f'
                  : original.productType === 'ARTICLE'
                    ? '#00ab55'
                    : original.productType === 'TUITION'
                      ? '#ff9f43'
                      : '#7367f0'
              }
            />
          )
        },
        size: 300,
      },
      {
        id: 'sku',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Hash size={14} className="text-muted" /> {t('label-sku')}
          </div>
        ),
        accessorKey: 'sku',
        cell: (info) =>
          info.getValue() ? (
            <div className="flex items-center gap-0.5">
              <Hash size={12} className="text-muted" />
              <SkuBadge>{info.getValue() as string}</SkuBadge>
            </div>
          ) : (
            <span className="text-muted italic">-</span>
          ),
        size: 120,
      },
      {
        id: 'salePrice',
        header: () => (
          <div className="flex items-center gap-0.5 justify-end w-full">
            <DollarSign size={14} /> {t('label-salePrice')}
          </div>
        ),
        accessorKey: 'salePrice',
        cell: ({ row: { original } }) => (
          <div className="text-right font-medium text-success">
            {original.salePrice ? toCurrency(original.salePrice) : '-'}
          </div>
        ),
        size: 120,
      },
      {
        id: 'purchasePrice',
        header: () => (
          <div className="flex items-center gap-0.5 justify-end w-full">
            <DollarSign size={14} /> {t('label-purchasePrice')}
          </div>
        ),
        accessorKey: 'purchasePrice',
        cell: ({ row: { original } }) => (
          <div className="text-right font-medium text-warning">
            {original.purchasePrice ? toCurrency(original.purchasePrice) : '-'}
          </div>
        ),
        size: 120,
      },
      {
        id: 'stock',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Archive size={14} /> {t('label-currentStock')}
          </div>
        ),
        accessorKey: 'quantity',
        cell: ({ row: { original } }) => (
          <div className="flex items-center gap-0.5">
            <Archive size={14} className="text-muted" />
            <span
              className={`font-medium ${
                Number(original.quantity) <= 0 ? 'text-danger' : 'text-muted'
              }`}
            >
              {original.quantity ?? '-'}
            </span>
          </div>
        ),
        size: 100,
      },
      {
        id: 'type',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Tag size={14} /> {t('label-productType')}
          </div>
        ),
        accessorKey: 'productType',
        cell: ({ row: { original } }) => (
          <TypeBadge type={original.productType} pill>
            {t(original.productType)}
          </TypeBadge>
        ),
        size: 120,
      },
      {
        id: 'category',
        header: () => (
          <div className="flex items-center gap-0.5">
            <Layers size={14} /> {t('label-category')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <div className="flex items-center gap-0.5">
            <Layers size={14} className="text-muted" />
            <span className="text-sm text-muted">
              {original.productCategory?.name || '-'}
            </span>
          </div>
        ),
        size: 150,
      },
    ],
    [t, props.modal],
  )

  return (
    <CommonTable
      data={props.dataSource!}
      columns={columns}
      showQuickFilter={true}
      onGlobalFilterChanged={props.onGlobalFilterChanged}
      modal={props.modal}
      showCheckbox={false}
      onRowClicked={props.onRowClicked}
      pageSize={15}
      initialFilter={props.initialFilter}
    />
  )
}

export default SimpleProductTable
