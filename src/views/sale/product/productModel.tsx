import { useTranslation } from 'react-i18next'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useMemo } from 'react'
import MyDropdown, {
  DeleteMenuItem,
  MyDivider,
  MyMenuItem,
} from '@/@core/components/dropdown'
import { useProductToggleStatusMutation } from '@/gql/graphql'
import { useNavigate } from '@tanstack/react-router'
import { useAbility } from '@/context/Can'
import type { ProductType } from './product.type'
import { toCurrency } from '@/utils/helpers'
import { Edit, Eye } from 'react-feather'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import ProductDelete from './ProductDelete'
import {
  Package,
  Hash,
  Tag,
  Barcode,
  DollarSign,
  ShoppingCart,
  Layers,
  CheckCircle,
  FolderTree,
} from 'lucide-react'
import {
  PriceText,
  TypeBadge,
  StockBadge,
  SkuText,
} from '@/@core/components/ui/table/table.style'
import { createAppColumnHelper } from '#/hooks/table'

const columnHelper = createAppColumnHelper<ProductType>()

interface TextWithPictureProps {
  picture: string
  name: string
  category: string
}

const TextWithPicture: React.FC<TextWithPictureProps> = ({
  picture,
  name,
  category,
}) => {
  return (
    <div className="flex flex-row items-center gap-3">
      <div className="relative">
        <img
          src={`${config?.pictureServer}/${picture}`}
          alt={name?.charAt(0) || 'P'}
          className="w-10 h-10 rounded-lg object-cover shadow-sm border border-gray-100"
        />
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-gray-800">{name}</span>
        {category && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <FolderTree size={10} />
            <span>{category}</span>
          </div>
        )}
      </div>
    </div>
  )
}

const config = await fetch('/configuration.json').then((res) => res.json())

export function useTableColumns(
  modal?: NiceModalHandler,
  refetch?: () => void,
) {
  const { t } = useTranslation()
  const [toggle, { loading }] = useProductToggleStatusMutation()
  const navigate = useNavigate()
  const ability = useAbility()

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: () => (
          <div className="flex items-center gap-0.5">
            <Package size={14} className="text-[#7367f0]" /> {t('label-name')}
          </div>
        ),
        cell: ({ row: { original } }) => {
          const name = original.name
          const category = original.productCategory?.name
          const picture = original.picture

          if (picture) {
            return (
              <TextWithPicture
                picture={picture}
                name={name}
                category={category}
              />
            )
          } else {
            return (
              <TextWithAvatar
                letter={name.charAt(0)}
                title={name!}
                subtitle={
                  category && (
                    <div className="flex items-center gap-0.5 text-gray-500">
                      <FolderTree size={10} />
                      <span>{category}</span>
                    </div>
                  )
                }
                size="sm"
              />
            )
          }
        },
      }),
      columnHelper.accessor('sku', {
        header: () => (
          <div className="flex items-center gap-0.5">
            <Barcode size={14} /> {t('label-sku')}
          </div>
        ),
        cell: ({ row: { original } }) => (
          <SkuText>{original.sku || '-'}</SkuText>
        ),
        size: 100,
      }),
      columnHelper.accessor('productType', {
        header: () => (
          <div className="flex items-center gap-0.5">
            <Tag size={14} /> {t('label-productType')}
          </div>
        ),
        cell: ({
          row: {
            original: { productType },
          },
        }) => {
          let color: 'primary' | 'success' | 'warning' | 'info' | 'secondary' =
            'secondary'
          switch (productType) {
            case 'ARTICLE':
              color = 'success'
              break
            case 'SERVICE':
              color = 'info'
              break
            case 'TUITION':
              color = 'warning'
              break
          }
          return <TypeBadge $color={color}>{t(productType)}</TypeBadge>
        },
        size: 100,
      }),
      columnHelper.accessor('salePrice', {
        header: () => (
          <div className="flex items-center gap-0.5">
            <DollarSign size={14} /> {t('label-salePrice')}
          </div>
        ),
        cell: ({
          row: {
            original: { salePrice },
          },
        }) => (
          <PriceText className="font-semibold text-[#7367f0]">
            {salePrice ? toCurrency(salePrice) : '-'}
          </PriceText>
        ),
        size: 120,
      }),
      columnHelper.accessor('purchasePrice', {
        header: () => (
          <div className="flex items-center gap-0.5">
            <ShoppingCart size={14} /> {t('label-purchasePrice')}
          </div>
        ),
        cell: ({
          row: {
            original: { purchasePrice },
          },
        }) => (
          <PriceText>
            {purchasePrice ? toCurrency(purchasePrice) : '-'}
          </PriceText>
        ),
        size: 120,
      }),
      columnHelper.accessor('quantity', {
        header: () => (
          <div className="flex items-center gap-0.5">
            <Layers size={14} /> {t('label-currentStock')}
          </div>
        ),
        cell: ({
          row: {
            original: { quantity },
          },
        }) =>
          quantity != null ? (
            <StockBadge $quantity={quantity}>{quantity}</StockBadge>
          ) : (
            <span className="text-gray-400">-</span>
          ),
        size: 100,
      }),
      columnHelper.accessor('active', {
        header: () => (
          <div className="flex items-center gap-0.5 justify-center w-full">
            <CheckCircle size={14} /> {t('label-active')}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-center">
            <ActiveRenderer
              active={info.getValue() as boolean}
              activeText={t('label.yes').toString()}
              inactiveText={t('label.no').toString()}
              onClick={() =>
                toggle({ variables: { productId: info.row.original?.id! } })
              }
              loading={loading}
            />
          </div>
        ),
        size: 80,
      }),
      columnHelper.accessor('id', {
        header: () => (
          <div className="flex items-center gap-0.5">
            <Hash size={14} /> #
          </div>
        ),
        cell: (info) => (
          <span className="text-xs text-gray-400 font-mono">
            {info.getValue()}
          </span>
        ),
        size: 60,
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <div className="text-right">{t('label-actions')}</div>,
        cell: ({ row: { original } }) => (
          <div className="flex justify-end w-full">
            {ability.can('update', 'config') ? (
              <MyDropdown
                label={t('label-update')}
                onClick={() => modal?.show({ product: original, update: true })}
              >
                <MyMenuItem
                  label={t('label-update')}
                  onClick={() =>
                    modal?.show({ product: original, update: true })
                  }
                  icon={<Edit size={15} />}
                />
                <DeleteMenuItem>
                  <MyDivider />
                  <ProductDelete
                    type={original.productType}
                    refetch={refetch}
                    id={original?.id}
                  />
                </DeleteMenuItem>
                <MyDivider />
                <MyMenuItem
                  label={t('label-see')}
                  onClick={() => navigate({ to: `/product/${original.id}` })}
                  icon={<Eye size={15} />}
                />
              </MyDropdown>
            ) : (
              <MyDropdown
                label={t('label-see')}
                onClick={() => navigate({ to: `/product/${original.id}` })}
              >
                <MyMenuItem
                  label={t('label-see')}
                  onClick={() => navigate({ to: `/product/${original.id}` })}
                  icon={<Eye size={15} />}
                />
              </MyDropdown>
            )}
          </div>
        ),
        size: 80,
      }),
    ],
    [modal, t],
  )

  return { columns }
}
