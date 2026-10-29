import NiceModal, { useModal } from '@ebay/nice-modal-react'
import cs from 'classnames'

import DrawerForm from '@/@core/components/ui/drawer-form'
import FrequentAdd from './FrequentAdd'
import FrequentUpdate from './FrequentUpdate'
import { Suspense } from 'react'
import { m } from '@/paraglide/messages'

export default NiceModal.create(({ frequent, update, refetch }: any) => {
  const modal = useModal()

  return (
    <DrawerForm
      modal={modal}
      className={cs(
        'w-full',
        { 'md:!w-10/12 lg:!w-8/12': !update },
        { 'md:!w-11/12 lg:!w-10/12': update },
      )}
      title={update ? m.update_student() : m.new_inscription()}
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
