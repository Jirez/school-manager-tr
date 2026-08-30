import DrawerForm from '@/@core/components/ui/drawer-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import SubjectGroupAdd from './SubjectGroupAdd'
import { Suspense } from 'react'
import SubjectGroupUpdate from './SubjectGroupUpdate'

export default NiceModal.create(({ groups, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <DrawerForm
      modal={modal}
      className="w-full"
      title={
        update ? t('action.update_subjectGroup') : t('action.add_subjectGroup')
      }
    >
      <Suspense>
        {update ? (
          <SubjectGroupUpdate modal={modal} groups={groups} />
        ) : (
          <SubjectGroupAdd modal={modal} groups={groups} />
        )}
      </Suspense>
    </DrawerForm>
  )
})
