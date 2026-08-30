import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { lazy, Suspense } from 'react'
import DrawerForm from '@/@core/components/ui/drawer-form'

const CustomerAdd = lazy(() => import('./CustomerAdd'))
const CustomerUpdate = lazy(() => import('./CustomerUpdate'))

export default NiceModal.create(({ customer, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <DrawerForm
      modal={modal}
      className="w-full md:!w-6/12 lg:!w-5/12"
      title={update ? t('action.update_customer') : t('action.add_customer')}
    >
      <Suspense>
        {update ? (
          <CustomerUpdate modal={modal} customer={customer} />
        ) : (
          <CustomerAdd modal={modal} customer={customer} />
        )}
      </Suspense>
    </DrawerForm>
  )
})
