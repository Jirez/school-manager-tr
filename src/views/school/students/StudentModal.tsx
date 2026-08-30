import NiceModal, { useModal } from '@ebay/nice-modal-react'
import DrawerForm from '@/@core/components/ui/drawer-form'
import StudentAdd from '@/views/school/students/StudentAdd'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'
import StudentUpdate from './StudentUpdate'

export default NiceModal.create(({ student, update, refetch }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <DrawerForm
      modal={modal}
      className="w-full sm:w-full md:w-10/12 lg:w-9/12 xs:w-8/12"
      title={update ? t('action.update_student') : t('action.add_student')}
    >
      <Suspense>
        {update ? (
          <StudentUpdate modal={modal} student={student} refetch={refetch} />
        ) : (
          <StudentAdd modal={modal} student={student} refetch={refetch} />
        )}
      </Suspense>
    </DrawerForm>
  )
})
