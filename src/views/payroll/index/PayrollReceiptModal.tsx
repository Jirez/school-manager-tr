import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import PdfViewer from '@/utils/PdfViewer'
import DrawerForm from '@/@core/components/ui/drawer-form'
import { useEffect } from 'react'
import { setOffcanvasSize } from '@/utils/helpers'

export default NiceModal.create(({ id, duplicated, type }: any) => {
  const modal = useModal()
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  useEffect(() => {
    setOffcanvasSize('70%')
  }, [])

  return (
    <DrawerForm
      modal={modal}
      //className="modal-xl"
      title={t('label-paySlip')}
      keyboard
      role="dialog"
      unmountOnClose
      //scrollable={false}
      //direction="top"
    >
      {(id as any) && (
        <PdfViewer
          url={`reports/payroll-${enterpriseId}-${id}.pdf?params=columnBorder:false,orientation:LANDSCAPE`}
          showDownload={false}
        />
      )}
    </DrawerForm>
  )
})
