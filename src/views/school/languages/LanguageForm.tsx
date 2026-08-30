import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, useFormState } from 'react-hook-form'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import { yupResolver } from '@hookform/resolvers/yup'

import type { LanguageType } from '@/views/school/languages/Language.type'
import Input from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { languageValidationSchema } from '@/views/school/languages/language.validation'
import { TOAST_OPTIONS } from '@/utils/constants'

interface LanguageFormProps extends BaseFormProps {
  language?: LanguageType
  modal?: NiceModalHandler
}

const LanguageForm: FC<LanguageFormProps> = ({
  language,
  modal,
  action,
  ...props
}) => {
  // ** Hooks
  const { t } = useTranslation()

  const { control, getValues, handleSubmit } = useForm<LanguageType>({
    defaultValues: {
      code: language?.code || '',
      name: language?.name || '',
      description: language?.description || '',
      active: language ? language.active : true,
    },
    resolver: yupResolver(languageValidationSchema),
  })

  const { isDirty } = useFormState({ control })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    event?.stopPropagation()

    return handleSubmit(async (values) => {
      const id = language?.id

      action({ variables: { language: { ...values, id } } })
        .then(async ({ data }) => {
          //form.resetFields();
          toast.success(`Langue ${data.language.name} enregistrée`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('language', data.language)
            props.onModalClose?.()
          }
          /* if (close) {
                        props.onCloseModal();
                    }*/
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter la langue: ${formatError(error)}`)
          // console.log(error.message)
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit}>
      <>
        <Input name="code" label={t('label-code')} control={control} required>
          <option value="">{t('label-select')}</option>
          <option value="EN">{t('label-english')}</option>
          <option value="FR">{t('label-french')}</option>
        </Input>

        <Input
          name="name"
          label={t('label-name')}
          control={control}
          required={true}
        />

        <Switch
          name="active"
          label={t('label-active')}
          control={control}
          defaultChecked={getValues('active')}
        />

        <Input
          name="description"
          label={t('label-description')}
          control={control}
          type="textarea"
        />

        <ActionButtons
          cancelAction={props.popover ? props.onModalClose : modal?.hide}
          isSubmitting={props.loading}
          popover={props.popover}
          dirty={isDirty}
        />
      </>
    </Form>
  )
}

export default LanguageForm
