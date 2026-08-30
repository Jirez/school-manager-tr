import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'
import EvalTypeAdd from './EvalTypeAdd'

export default NiceModal.create(({ evalType, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={update ? t('action.update_evalType') : t('action.add_evalType')}
    >
      <Suspense>
        <EvalTypeAdd modal={modal} evalType={evalType} />
      </Suspense>
    </ModalForm>
  )
})
