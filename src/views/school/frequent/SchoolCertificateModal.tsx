import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import PdfViewer from '@/utils/PdfViewer'
import ModalForm from '@/@core/components/ui/modal-form'
import { Suspense } from 'react'

export default NiceModal.create(({ id }: any) => {
  // The student Id
  const modal = useModal()
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  return (
    <ModalForm
      modal={modal}
      className="modal-xl"
      title={t('label-schoolCertificate')}
    >
      <Suspense>
        {(id as any) && (
          <PdfViewer
            url={`reports/school-certificate-${enterpriseId}.pdf?search=student:${id}`}
            showDownload={false}
          />
        )}
      </Suspense>
    </ModalForm>
  )
})
