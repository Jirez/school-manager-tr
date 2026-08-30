import type { SchoolSectionType } from '@/views/school/schoolSections/SchoolSectionType'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { FC } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useForm, useFormState } from 'react-hook-form'
import { Form } from 'reactstrap'
import { messageService } from '@/utils/message.service'
import { useAuthentication } from '@/hooks/useAuthentication'
import { yupResolver } from '@hookform/resolvers/yup'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import LanguageAdd from '@/views/school/languages/LanguageAdd'
import Switch from '@/@core/components/ui/forms/swith'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { schoolSectionValidationSchema } from '@/views/school/schoolSections/schoolSection.validation'
import { TOAST_OPTIONS } from '@/utils/constants'
import { LanguageCreatedDocument, useLanguagesQuery } from '@/gql/graphql'
import { Type, Globe, FileText } from 'lucide-react'
import { default as FormItem } from '@/@core/components/ui/forms/input'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'

interface SchoolSectionFormProps extends BaseFormProps {
  schoolSection?: SchoolSectionType
  modal?: NiceModalHandler
}

const initialValues: Partial<SchoolSectionType> = {
  name: '',
  active: true,
  languageId: null,
  note: '',
}

const SchoolSectionForm: FC<SchoolSectionFormProps> = ({
  schoolSection,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const { data, loading, subscribeToMore } = useLanguagesQuery()

  const {
    control,
    formState: { errors },
    setValue,
    handleSubmit,
    getValues,
    reset,
  } = useForm<SchoolSectionType>({
    defaultValues: {
      languageId: schoolSection ? schoolSection.language : null,
      active: schoolSection ? schoolSection.active : true,
      name: schoolSection?.name || '',
      note: schoolSection?.note || '',
    },
    resolver: yupResolver(schoolSectionValidationSchema),
  })

  const { isDirty } = useFormState({ control })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event?.preventDefault()
    event?.stopPropagation()

    return handleSubmit(async (values) => {
      const id = schoolSection ? Number(schoolSection.id) : undefined

      action({
        variables: {
          section: {
            ...values,
            id,
            languageId: Number(values.languageId?.id),
            schoolId: enterpriseId,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(`Section ${data.schoolSection.name} enregistrée`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('schoolSection', data.schoolSection)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter la section: ${error.message}`)
        })
    })(event)
  }

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'language') {
          setValue('languageId', message.value)
        }
      }
    })
  })

  return (
    <Form onSubmit={onSubmit} className="space-y-6">
      <FormSection
        icon={<Globe className="w-5 h-5" />}
        title={t('label-language') || 'Langue'}
        description="Langue principale de la section"
        color="#7367f0"
      >
        <div className="space-y-4">
          <LiveView
            document={LanguageCreatedDocument}
            singleVar="language"
            data={data}
            listVar="languages"
            subscribeToMore={subscribeToMore}
            sortField="name"
            triggerUpdate={true}
            enterpriseId={enterpriseId}
          >
            {({ languages }) => (
              <ControlledSelect
                name="languageId"
                label={t('label-mainLanguage')}
                control={control}
                onChange={(value) => setValue('languageId', value)}
                options={languages || undefined}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                loading={loading}
                form={<LanguageAdd />}
                formId="language"
                optionLabel="name"
                modalClassName="modal-md"
                formTitle={t('action.add_language')}
                prepend={<Globe size={16} />}
              />
            )}
          </LiveView>
        </div>
      </FormSection>

      <FormSection
        icon={<Type className="w-5 h-5" />}
        title={t('label-section') || 'Section'}
        description="Nom et statut de la section"
        color="#28c76f"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormItem
              name="name"
              label={t('label-name')}
              control={control}
              required
              prepend={<Type size={16} />}
            />

            <Switch
              name="active"
              label={t('label-active')}
              control={control}
              defaultChecked={getValues('active')}
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        icon={<FileText className="w-5 h-5" />}
        title={t('label-note') || 'Notes'}
        description="Informations complémentaires"
        color="#ea5455"
      >
        <div className="space-y-4">
          <FormItem
            name="note"
            label={t('label-note')}
            control={control}
            type="textarea"
            prepend={<FileText size={16} />}
          />
        </div>
      </FormSection>

      <StickyActions>
        <ActionButtons
          cancelAction={modal?.hide}
          isSubmitting={props.loading}
          popover={props.popover}
          dirty={isDirty}
          onSubmit={onSubmit}
        />
      </StickyActions>
    </Form>
  )
}

export default SchoolSectionForm
