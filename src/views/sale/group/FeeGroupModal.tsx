import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'

const FeeGroupAdd = lazy(() => import('./FeeGroupAdd'))
const FeeGroupUpdate = lazy(() => import('./FeeGroupUpdate'))

export default NiceModal.create(({ feeGroup, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="modal-lg"
      title={update ? t('action.update_feeGroup') : t('action.add_feeGroup')}
    >
      <Suspense>
        {update ? (
          <FeeGroupUpdate modal={modal} feeGroup={feeGroup} />
        ) : (
          <FeeGroupAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
