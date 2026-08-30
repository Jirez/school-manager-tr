import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'

const CustomerCategoryAdd = lazy(() => import('./CustomerCategoryAdd'))
const CustomerCategoryUpdate = lazy(() => import('./CustomerCategoryUpdate'))

export default NiceModal.create(({ customerCategory, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={
        update
          ? t('action.update_customerCategory')
          : t('action.add_customerCategory')
      }
    >
      <Suspense>
        {update ? (
          <CustomerCategoryUpdate
            modal={modal}
            customerCategory={customerCategory}
          />
        ) : (
          <CustomerCategoryAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
