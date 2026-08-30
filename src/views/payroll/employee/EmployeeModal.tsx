import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'

const EmployeeAdd = lazy(() => import('./EmployeeAdd'))
const EmployeeUpdate = lazy(() => import('./EmployeeUpdate'))

export default NiceModal.create(({ employee, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="max-w-5xl"
      title={update ? t('action.update_employee') : t('action.add_employee')}
    >
      <Suspense>
        {update ? (
          <EmployeeUpdate modal={modal} employee={employee} />
        ) : (
          <EmployeeAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
