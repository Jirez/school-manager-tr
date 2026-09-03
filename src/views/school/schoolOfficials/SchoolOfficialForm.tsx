import type { FC } from 'react'
import { useState } from 'react'
import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import { UserCog, User, PenTool, Type, Mail } from 'lucide-react'
import type { SchoolOfficialType } from '@/views/school/schoolOfficials/SchoolOfficial.type'
import { useAuthentication } from '@/hooks/useAuthentication'
import LiveView from '@/utils/LiveView'
import OfficialFunctionAdd from '@/views/school/officialFunctions/OfficialFunctionAdd'
import {
  schoolOfficialValidation,
  type SchoolOfficialSchemaType,
} from '@/views/school/schoolOfficials/schoolOfficial.validation'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'
import FileUpload from '@/@core/components/ui/forms/file-upload'
import ImagePreview from '@/@core/components/image/image-preview'
import RestDataSource from '@/utils/RestDataSource'
import {
  OfficialTypeCreatedDocument,
  useOfficialTypesQuery,
} from '@/gql/graphql'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { m } from '@/paraglide/messages'

const config = await fetch('/configuration.json').then((res) => res.json())

interface SchoolOfficialFormProps extends BaseFormProps {
  schoolOfficial?: SchoolOfficialType
  modal?: NiceModalHandler
}

const SchoolOfficialForm: FC<SchoolOfficialFormProps> = ({
  schoolOfficial,
  modal,
  action,
  ...props
}) => {
  const { enterpriseId } = useAuthentication()
  const [picture, setPicture] = useState<string | null>(
    schoolOfficial ? schoolOfficial.signature : null,
  )

  const { data, loading, subscribeToMore } = useOfficialTypesQuery()

  const {
    handleSubmit,
    AppField,
    reset,
    AppForm,
    SubmitButton,
    setFieldValue,
  } = useAppForm({
    defaultValues: {
      name: schoolOfficial?.name || '',
      email: schoolOfficial?.email || '',
      signature: schoolOfficial?.signature || '',
      liableTypeId: schoolOfficial ? schoolOfficial.liableType : null,
    } as SchoolOfficialSchemaType,
    validators: {
      onChange: schoolOfficialValidation,
    },
    onSubmitMeta: defaultMeta,
    onSubmit({ value, meta }) {
      const id = schoolOfficial ? Number(schoolOfficial.id) : undefined
      const parsed = schoolOfficialValidation.parse(value)

      action({
        variables: {
          liable: {
            ...parsed,
            id,
            liableTypeId: Number(parsed.liableTypeId?.id),
            schoolId: enterpriseId,
          },
        },
      })
        .then(async ({ data }) => {
          reset()
          toast.success(`Responsable ${data.schoolOfficial.name} enregistrée`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('schoolOfficial', data.schoolOfficial)
            props.onModalClose?.()
          }
          if (meta.close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter le responsable: ${formatError(error)}`,
          )
        })
    },
  })

  const handleUpload = (file: any) => {
    const dataSource = new RestDataSource()
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', 'Un test en béton')
    formData.append('details', 'details')
    formData.append('picturePath', config?.uploadDir || 'C:/Temp/')

    const callback = async (datum: any) => {
      toast.info('Importation terminée avec succès')
      if (datum) {
        setFieldValue('signature', datum.fileName)
        setPicture(datum.fileName)
      }
    }

    dataSource.upload(`upload/file`, formData, callback).catch((error) => {
      if (error.response) {
        toast.error(error.response.data.message)
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
    })
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        // handleSubmit()
      }}
    >
      <div className="space-y-4">
        <FormSection
          icon={<UserCog className="w-5 h-5" />}
          title={m.label_officialFunction()}
          description={m.label_officialFunctionDesc()}
          color="#7367f0"
        >
          <div className="space-y-1">
            <LiveView
              document={OfficialTypeCreatedDocument}
              singleVar="officialType"
              data={data}
              loading={loading}
              listVar="officialTypes"
              subscribeToMore={subscribeToMore}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ officialTypes }) => (
                <AppField
                  name="liableTypeId"
                  children={(field) => (
                    <field.ControlledSelect
                      label={m.label_officialFunction()}
                      required={true}
                      loading={loading}
                      options={officialTypes || undefined}
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option: any) => option.id}
                      form={<OfficialFunctionAdd />}
                      formId="officialFunction"
                      optionLabel="name"
                      formTitle={m.action_add_officialFunction()}
                      prepend={<UserCog size={16} />}
                      onChange={(val: any) =>
                        setFieldValue('liableTypeId', val)
                      }
                    />
                  )}
                />
              )}
            </LiveView>
          </div>
        </FormSection>

        <FormSection
          icon={<User className="w-5 h-5" />}
          title={m.label_personalInformation()}
          description={
            m.label_personalInformationDesc() || 'Nom et email du responsable'
          }
          color="#28c76f"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <AppField
                name="name"
                children={(field) => (
                  <field.Input
                    label={m.label_name()}
                    required={true}
                    prepend={<Type size={16} />}
                  />
                )}
              />

              <AppField
                name="email"
                children={(field) => (
                  <field.Input
                    label={m.label_email()}
                    prepend={<Mail size={16} />}
                  />
                )}
              />
            </div>
          </div>
        </FormSection>

        <FormSection
          icon={<PenTool className="w-5 h-5" />}
          title={m.label_signature()}
          description={m.label_signatureDesc()}
          color="#ea5455"
        >
          <div className="space-y-4">
            {!picture && (
              <FileUpload
                accept="image/*"
                onChange={(data: any) => {
                  handleUpload(data[0])
                }}
              />
            )}

            {picture && (
              <ImagePreview
                url={picture}
                deleteAction={() => {
                  setPicture(null)
                  setFieldValue('signature', null)
                }}
              />
            )}
          </div>
        </FormSection>
      </div>

      <StickyActions>
        <AppForm>
          <SubmitButton
            cancelAction={modal?.hide}
            isSubmitting={props.loading}
            popover={props.popover}
            onSubmit={(_, meta) => handleSubmit(meta)}
          />
        </AppForm>
      </StickyActions>
    </Form>
  )
}

export default SchoolOfficialForm
