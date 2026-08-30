import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'

const DepartmentAdd = lazy(() => import('./DepartmentAdd'))
const DepartmentUpdate = lazy(() => import('./DepartmentUpdate'))

export default NiceModal.create(({ department, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={
        update ? t('action.update_department') : t('action.add_department')
      }
    >
      <Suspense>
        {update ? (
          <DepartmentUpdate modal={modal} department={department} />
        ) : (
          <DepartmentAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
