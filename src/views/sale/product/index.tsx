import { useState } from 'react'
import { SplitButton } from '@/@core/components/ui/buttons/split-button'
import {
  Package,
  GraduationCap,
  Wrench,
  FolderTree,
  FileSpreadsheet,
} from 'lucide-react'
import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { ProductLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import { useTranslation } from 'react-i18next'
import ErrorComponent from '@/@core/components/ui/error-component'
import { formatError } from '@/utils/ErrorHelper'
import ProductModal from './ProductModal'
import { PRODUCT_CATEGORIES, DEFAULT_POLL_INTERVAL } from '@/utils/constants'
import { useNavigate } from '@tanstack/react-router'
import { useMount, useTitle } from 'ahooks'
import { NewProductCreatedDocument, useProductsQuery } from '@/gql/graphql'
import { useTableColumns } from './productModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'

const Products = () => {
  const { enterpriseId } = useAuthentication()
  const [isMounted, setIsMounted] = useState(false)
  const modal = useModal(ProductModal)
  const { t } = useTranslation()
  const navigate = useNavigate()
  useTitle(t('text-products'))

  const {
    data,
    error,
    loading,
    subscribeToMore,
    refetch: refetchProducts,
  } = useProductsQuery({
    variables: { id: enterpriseId },
    pollInterval: DEFAULT_POLL_INTERVAL,
  })

  /* const { data: dataInfo, refetch: refetchInfo } = useStockInfoQuery({
    variables: { id: enterpriseId },
    pollInterval: DEFAULT_POLL_INTERVAL,
  }); */

  const refetch = () => {
    refetchProducts()
  }

  const { columns } = useTableColumns(modal, refetch)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.products || [],
  })

  useMount(() => {
    setIsMounted(true)
  })

  if (!isMounted) {
    return null
  }

  if (error) {
    return (
      <div className="mx-auto">
        <ErrorComponent
          message={formatError(error)}
          title={t('label-graphqlError')}
        />
      </div>
    )
  }

  const addProduct = () => {
    modal.show({ type: 'ARTICLE' })
  }

  const extraButton = () => (
    <SplitButton
      primaryAction={{
        label: t('action.add_product'),
        onClick: addProduct,
        icon: <Package size={16} />,
      }}
      dropdownActions={[
        {
          label: t('action.add_tuition'),
          onClick: () => modal.show({ type: 'TUITION' }),
          icon: <GraduationCap size={16} />,
        },
        {
          label: t('action.add_service'),
          onClick: () => modal.show({ type: 'SERVICE' }),
          icon: <Wrench size={16} />,
        },
        {
          label: t('label-manageCategories'),
          onClick: () => navigate({ to: PRODUCT_CATEGORIES }),
          icon: <FolderTree size={16} />,
        },
        {
          label: t('label-addFromFile'),
          onClick: () => {}, // TODO: Implement import
          icon: <FileSpreadsheet size={16} />,
        },
      ]}
    />
  )

  return (
    <div className="flex flex-col w-full">
      <Navs links={ProductLinks} />
      <Toolbar
        title={t('sidebar.sales.items')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_product"
        onClick={() => modal.show({ type: 'ARTICLE' })}
        extraButton={extraButton()}
        refetch={refetch}
        totalCount={totalCount}
        abilitySubject="product"
      />

      {/* Table here */}
      <>
        {/* StockInfo
          low={dataInfo?.stockInfo?.low || 0}
          out={dataInfo?.stockInfo?.out || 0}
        /> */}
        <LiveView
          document={NewProductCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="products"
          singleVar="product"
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {() => (
            <div className="mt-1 text-sm">
              <CustomTable
                table={table as any}
                modal={modal}
                loading={loading}
              />
            </div>
          )}
        </LiveView>
      </>
    </div>
  )
}

export default Products
