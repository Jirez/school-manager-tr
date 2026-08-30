import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { Suspense, lazy } from 'react'

const EarningCategoryAdd = lazy(() => import('./EarningCategoryAdd'))
const EarningCategoryUpdate = lazy(() => import('./EarningCategoryUpdate'))

export default NiceModal.create(({ category, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={
        update
          ? t('action.update_earningCategory')
          : t('action.add_earningCategory')
      }
    >
      <Suspense>
        {update ? (
          <EarningCategoryUpdate modal={modal} category={category} />
        ) : (
          <EarningCategoryAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
