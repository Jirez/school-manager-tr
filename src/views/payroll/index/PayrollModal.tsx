import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { Suspense, lazy } from 'react'

const PayrollAdd = lazy(() => import('./PayrollAdd'))
const PayrollUpdate = lazy(() => import('./PayrollUpdate'))

export default NiceModal.create(({ payroll, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      fullscreen
      keyboard={false}
      title={update ? t('action.update_payroll') : t('action.add_payroll')}
    >
      <Suspense>
        {update ? (
          <PayrollUpdate modal={modal} payroll={payroll} />
        ) : (
          <PayrollAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
