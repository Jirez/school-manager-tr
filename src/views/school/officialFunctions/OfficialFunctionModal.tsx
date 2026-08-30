import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import OfficialFunctionAdd from '@/views/school/officialFunctions/OfficialFunctionAdd'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'

export default NiceModal.create(({ officialFunction, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={
        update
          ? t('action.update_officialFunction')
          : t('action.add_officialFunction')
      }
    >
      <Suspense>
        <OfficialFunctionAdd
          modal={modal}
          officialFunction={officialFunction}
        />
      </Suspense>
    </ModalForm>
  )
})
