import React, { useState } from 'react'
import { useEventEmitter, useKeyPress } from 'ahooks'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import type { HintOption } from './libraries/autocompleteHint/HintOption'
import { useAuthentication } from '@/hooks/useAuthentication'
import LiveView from './LiveView'
import AutocompleteHintInput from './AutocompleteHintInput'
import { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { NewProductCreatedDocument, useProductsQuery } from '@/gql/graphql'
import { RefreshCw, Search } from 'react-feather'
import ProductTableModal from '@/views/sale/product/ProductTableModal'
import {
  AppendAction,
  ContentArea,
  InputContainer,
  InputGroup,
  LoadingBar,
  PrependAction,
  SearchIconBox,
} from './autocomplete.style'
import { FolderOpen, Loader2 } from 'lucide-react'

interface ProductAutocompleteHintProps {
  onFill(value: string | HintOption): void
  onOpenTable?(value: string | HintOption): void // open list inside a table
  focus$?: EventEmitter<void>
  reload$?: EventEmitter<void>
  canRefetch?: boolean
  tuitionOnly?: boolean
}

const ProductAutocompleteHint: React.FC<ProductAutocompleteHintProps> = ({
  canRefetch = true,
  tuitionOnly = false,
  ...props
}) => {
  const { enterpriseId } = useAuthentication()
  const [text, setText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)

  const productModal = useModal(ProductTableModal)
  const { t } = useTranslation()
  const text$ = useEventEmitter<string>()

  const {
    data: dataProduct,
    loading: loadingProduct,
    subscribeToMore: subscribeToMoreProduct,
    refetch: refetchProducts,
  } = useProductsQuery({
    variables: { id: enterpriseId },
  })

  const refetch = async () => {
    setIsRefetching(true)
    try {
      await refetchProducts()
    } finally {
      setTimeout(() => setIsRefetching(false), 500)
    }
  }

  props.reload$?.useSubscription(() => refetch())

  const onRowClicked = (selectedRow: any) => {
    const item = {
      id: selectedRow.id,
      name: selectedRow.name,
      sku: selectedRow.sku,
      salePrice: selectedRow.salePrice,
      purchasePrice: selectedRow.purchasePrice,
      quantity: selectedRow.quantity || 0,
      minPrice: selectedRow.minSalePrice,
    }

    setText('')
    props.onFill(item)
    productModal.hide()
    text$.emit('')
  }

  const openModal = () => {
    productModal.show({
      products: dataProduct
        ? dataProduct?.products?.filter(
            (p: any) =>
              p.active &&
              (tuitionOnly
                ? p.productType === 'TUITION'
                : p.productType !== 'TUITION'),
          )
        : [],
      onRowClicked: onRowClicked,
      initialFilter: text,
    })
  }

  useKeyPress('ctrl.enter', () => openModal())
  useKeyPress('ctrl.i', () => openModal())

  const isLoading = loadingProduct || isRefetching

  return (
    <LiveView
      document={NewProductCreatedDocument}
      subscribeToMore={subscribeToMoreProduct}
      listVar="products"
      singleVar="product"
      data={dataProduct}
      loading={loadingProduct}
      enterpriseId={enterpriseId}
      showLoader
    >
      {({ products }) => (
        <InputGroup
          $isFocused={isFocused}
          $isLoading={isLoading}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          {canRefetch && (
            <PrependAction
              onClick={refetch}
              $isLoading={isRefetching}
              title={t('label-refresh')}
              type="button"
            >
              {isRefetching ? <Loader2 size={16} /> : <RefreshCw size={16} />}
            </PrependAction>
          )}

          <ContentArea>
            <SearchIconBox $active={isFocused || !!text}>
              <Search size={16} strokeWidth={2} />
            </SearchIconBox>

            <InputContainer>
              <AutocompleteHintInput
                options={
                  products
                    ? products.filter(
                        (p: any) =>
                          p.active &&
                          (tuitionOnly
                            ? p.productType === 'TUITION'
                            : p.productType !== 'TUITION'),
                      )
                    : []
                }
                onFill={props.onFill}
                allowTabFill={true}
                getOptionLabel={() => ['name', 'quantity']}
                uniqueKey="id"
                placeholder={t('text-productPlaceholder')}
                formId="productForm"
                focus$={props.focus$}
                onChange={setText}
                text$={text$}
                onOpenModal={(value) =>
                  productModal.show({
                    products: dataProduct
                      ? dataProduct?.products?.filter(
                          (p: any) =>
                            p.active &&
                            (tuitionOnly
                              ? p.productType === 'TUITION'
                              : p.productType !== 'TUITION'),
                        )
                      : [],
                    onRowClicked: onRowClicked,
                    initialFilter: value,
                  })
                }
              />
            </InputContainer>
          </ContentArea>

          <AppendAction onClick={openModal} type="button">
            <FolderOpen size={15} />
            <div className="shortcut-text">
              <kbd>Ctrl</kbd>
              <span>+</span>
              <kbd>I</kbd>
            </div>
          </AppendAction>

          <LoadingBar $visible={isLoading} />
        </InputGroup>
      )}
    </LiveView>
  )
}

export default ProductAutocompleteHint
