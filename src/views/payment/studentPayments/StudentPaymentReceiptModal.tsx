import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import PdfViewer from '@/utils/PdfViewer'
import ModalForm from '@/@core/components/ui/modal-form'

export default NiceModal.create(({ id, duplicated }: any) => {
  const modal = useModal()
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  return (
    <ModalForm
      modal={modal}
      className="modal-xl"
      title={t('label-studentPaymentReceipt')}
    >
      {(id as any) && (
        <PdfViewer
          url={`reports/student-payment${duplicated ? '-duplicata' : ''}-${enterpriseId}-${id}.pdf`}
          showDownload={false}
        />
      )}
    </ModalForm>
  )
})
