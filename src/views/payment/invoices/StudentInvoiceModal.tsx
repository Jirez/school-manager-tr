import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'

import DrawerForm from '@/@core/components/ui/drawer-form'
import StudentInvoiceAdd from './StudentInvoiceAdd'
import { Suspense } from 'react'
import StudentInvoiceUpdate from './StudentInvoiceUpdate'

export default NiceModal.create(({ studentInvoice, update, refetch }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <DrawerForm
      modal={modal}
      className="w-full"
      title={
        update
          ? t('action.update_studentInvoice')
          : t('action.add_studentInvoice')
      }
    >
      <Suspense>
        {update ? (
          <StudentInvoiceUpdate
            modal={modal}
            studentInvoice={studentInvoice}
            refetch={refetch}
          />
        ) : (
          <StudentInvoiceAdd modal={modal} studentInvoice={studentInvoice} />
        )}
      </Suspense>
    </DrawerForm>
  )
})
