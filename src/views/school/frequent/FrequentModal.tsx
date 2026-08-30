import NiceModal, { useModal } from '@ebay/nice-modal-react'
import cs from 'classnames'
import { useTranslation } from 'react-i18next'

import DrawerForm from '@/@core/components/ui/drawer-form'
import FrequentAdd from './FrequentAdd'
import FrequentUpdate from './FrequentUpdate'
import { Suspense } from 'react'

export default NiceModal.create(({ frequent, update, refetch }: any) => {
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
      title={update ? t('action.update_student') : t('action.new_inscription')}
    >
      <Suspense>
        {update ? (
          <FrequentUpdate modal={modal} frequent={frequent} refetch={refetch} />
        ) : (
          <FrequentAdd modal={modal} refetch={refetch} />
        )}
      </Suspense>
    </DrawerForm>
  )
})
