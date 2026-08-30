import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import SchoolFeeAdd from '@/views/payment/schoolFees/SchoolFeeAdd'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'

export default NiceModal.create(({ schoolFee, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={update ? t('action.update_schoolFee') : t('action.add_schoolFee')}
    >
      <Suspense>
        <SchoolFeeAdd modal={modal} schoolFee={schoolFee} />
      </Suspense>
    </ModalForm>
  )
})
