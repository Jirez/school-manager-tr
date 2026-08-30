import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { Suspense, lazy } from 'react'

const DeductionCategoryAdd = lazy(() => import('./DeductionCategoryAdd'))
const DeductionCategoryUpdate = lazy(() => import('./DeductionCategoryUpdate'))

export default NiceModal.create(({ category, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={
        update
          ? t('action.update_deductionCategory')
          : t('action.add_deductionCategory')
      }
    >
      <Suspense>
        {update ? (
          <DeductionCategoryUpdate modal={modal} category={category} />
        ) : (
          <DeductionCategoryAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
