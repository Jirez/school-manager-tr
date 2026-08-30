import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import DrawerForm from '@/@core/components/ui/drawer-form'
import PaymentGroupAdd from '@/views/payment/groups/PaymentGroupAdd'
import { Suspense } from 'react'

export default NiceModal.create(({ paymentGroup, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <DrawerForm
      modal={modal}
      title={
        update ? t('action.update_paymentGroup') : t('action.add_paymentGroup')
      }
    >
      <Suspense>
        <PaymentGroupAdd modal={modal} paymentGroup={paymentGroup} />
      </Suspense>
    </DrawerForm>
  )
})
