import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'

const ProductCategoryAdd = lazy(() => import('./ProductCategoryAdd'))
const ProductCategoryUpdate = lazy(() => import('./ProductCategoryUpdate'))

export default NiceModal.create(({ productCategory, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="max-w-4xl"
      title={
        update
          ? t('action.update_productCategory')
          : t('action.add_productCategory')
      }
    >
      <Suspense>
        {update ? (
          <ProductCategoryUpdate
            modal={modal}
            productCategory={productCategory}
          />
        ) : (
          <ProductCategoryAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
