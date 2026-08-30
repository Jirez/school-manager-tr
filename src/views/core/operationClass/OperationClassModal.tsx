import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import OperationClassAdd from '@/views/core/operationClass/OperationClassAdd'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'

export default NiceModal.create(({ operationClass, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={
        update
          ? t('action.update_operationClass')
          : t('action.add_operationClass')
      }
    >
      <Suspense>
        <OperationClassAdd modal={modal} operationClass={operationClass} />
      </Suspense>
    </ModalForm>
  )
})
