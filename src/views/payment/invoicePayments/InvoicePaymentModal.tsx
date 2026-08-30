import NiceModal, { useModal } from '@ebay/nice-modal-react'
import DrawerForm from '@/@core/components/ui/drawer-form'
import { useTranslation } from 'react-i18next'
import InvoicePaymentAdd from './InvoicePaymentAdd'
import { Suspense } from 'react'

export default NiceModal.create(({ studentPayment }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <DrawerForm
      modal={modal}
      className="w-full"
      title={t('action.add_studentPayment')}
    >
      <Suspense>
        <InvoicePaymentAdd modal={modal} studentPayment={studentPayment} />
      </Suspense>
    </DrawerForm>
  )
})
