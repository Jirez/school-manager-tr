import NiceModal, { useModal } from '@ebay/nice-modal-react'
import DrawerForm from '@/@core/components/ui/drawer-form'
import { useTranslation } from 'react-i18next'
import TeacherAdd from './TeacherAdd'
import { Suspense } from 'react'
import TeacherUpdate from './TeacherUpdate'
import cs from 'classnames'

export default NiceModal.create(({ teacher, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <DrawerForm
      modal={modal}
      className={cs(
        'w-full',
        { 'md:!w-10/12 lg:!w-8/12': !update },
        { 'md:!w-11/12 lg:!w-10/12': update },
      )}
      title={update ? t('action.update_teacher') : t('action.add_teacher')}
    >
      <Suspense>
        {update ? (
          <TeacherUpdate modal={modal} teacher={teacher} />
        ) : (
          <TeacherAdd modal={modal} teacher={teacher} />
        )}
      </Suspense>
    </DrawerForm>
  )
})
