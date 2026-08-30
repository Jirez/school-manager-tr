import DrawerForm from '@/@core/components/ui/drawer-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import CustomReport from './CustomReport'

export default NiceModal.create(({ options, setValues }: any) => {
  const modal = useModal()

  return (
    <DrawerForm
      modal={modal}
      className="w-full md:w-6/12 lg:w-5/12"
      title={options?.title || 'Personnaliser le rapport'}
    >
      <CustomReport
        options={options as any}
        //@ts-ignore
        setValues={setValues}
        modal={modal}
      />
    </DrawerForm>
  )
})
