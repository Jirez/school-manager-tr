import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { Suspense, lazy } from 'react'

const DeductionAdd = lazy(() => import('./DeductionAdd'))
const DeductionUpdate = lazy(() => import('./DeductionUpdate'))

export default NiceModal.create(({ deduction, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="max-w-3xl"
      title={update ? t('action.update_deduction') : t('action.add_deduction')}
    >
      <Suspense>
        {update ? (
          <DeductionUpdate modal={modal} deduction={deduction} />
        ) : (
          <DeductionAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
