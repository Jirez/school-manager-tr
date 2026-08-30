import MyDropdown, {
  DeleteMenuItem,
  MyDivider,
  MyMenuItem,
} from '@/@core/components/dropdown'
import React, { cloneElement } from 'react'
import { Edit } from 'react-feather'
import { useTranslation } from 'react-i18next'

interface ActionRendererProps {
  params: any
  title?: React.ReactNode
  deleteElement: React.ReactElement
  updateElement?: React.ReactElement
  formId: string
  width?: any
  modal?: any
  modalOptions?: Record<string, any>
  deleteId?: any
  refetch?: () => void
}

const ActionRenderer: React.FC<ActionRendererProps> = ({
  width,
  formId,
  deleteElement,
  updateElement,
  title,
  params,
  modal,
  modalOptions = {},
  deleteId,
  ...props
}) => {
  const { t } = useTranslation()

  return (
    <MyDropdown
      label={t('label-update')}
      onClick={() =>
        modal?.show({
          [formId]: params,
          update: true,
          refetch: props.refetch,
          ...modalOptions,
        })
      }
    >
      <MyMenuItem
        label={t('label-update')}
        onClick={() =>
          modal?.show({
            [formId]: params,
            update: true,
            refetch: props.refetch,
            ...modalOptions,
          })
        }
        icon={<Edit size={15} />}
      />
      <DeleteMenuItem>
        <MyDivider />
        {cloneElement(deleteElement, {
          id: deleteId ? deleteId : Number(params.id),
          classic: false,
          ...props,
        })}
      </DeleteMenuItem>
    </MyDropdown>
  )
}

export default ActionRenderer
