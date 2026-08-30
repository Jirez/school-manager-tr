import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'

const DayOfClassAdd = lazy(() => import('./DayOfClassAdd'))
const DayOfClassUpdate = lazy(() => import('./DayOfClassUpdate'))

export default NiceModal.create(({ dayOfClass, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="max-w-3xl"
      title={
        update ? t('action.update_dayOfClass') : t('action.add_dayOfClass')
      }
    >
      <Suspense>
        {update ? (
          <DayOfClassUpdate modal={modal} dayOfClass={dayOfClass} />
        ) : (
          <DayOfClassAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
