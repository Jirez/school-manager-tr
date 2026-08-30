import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'

const PayrollPeriodAdd = lazy(() => import('./PayrollPeriodAdd'))
const PayrollPeriodUpdate = lazy(() => import('./PayrollPeriodUpdate'))

export default NiceModal.create(({ period, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={
        update
          ? t('action.update_payrollPeriod')
          : t('action.add_payrollPeriod')
      }
    >
      <Suspense>
        {update ? (
          <PayrollPeriodUpdate modal={modal} period={period} />
        ) : (
          <PayrollPeriodAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
