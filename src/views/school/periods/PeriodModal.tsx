import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import PeriodAdd from '@/views/school/periods/PeriodAdd'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'

export default NiceModal.create(({ period, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-lg"
      title={update ? t('action.update_period') : t('action.add_period')}
    >
      <Suspense>
        <PeriodAdd modal={modal} period={period} />
      </Suspense>
    </ModalForm>
  )
})
