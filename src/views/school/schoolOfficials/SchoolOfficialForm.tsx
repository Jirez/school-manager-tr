import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import { UserCog, User, PenTool, Type, Mail } from 'lucide-react'
import type { SchoolOfficialType } from '@/views/school/schoolOfficials/SchoolOfficial.type'
import { useAuthentication } from '@/hooks/useAuthentication'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import OfficialFunctionAdd from '@/views/school/officialFunctions/OfficialFunctionAdd'
import { default as FormItem } from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { yupResolver } from '@hookform/resolvers/yup'
import { schoolOfficialValidationSchema } from '@/views/school/schoolOfficials/schoolOfficial.validation'
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

interface SchoolOfficialFormProps extends BaseFormProps {
  schoolOfficial?: SchoolOfficialType
  modal?: NiceModalHandler
}

const initialValues: Partial<SchoolOfficialType> = {
  name: '',
  email: '',
  liableTypeId: null,
}

const config = await fetch('/configuration.json').then((res) => res.json())

const SchoolOfficialForm: FC<SchoolOfficialFormProps> = ({
  schoolOfficial,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const [values, setValues] = useState<{ file: any; picture: string | null }>({
    file: null,
    picture: schoolOfficial ? schoolOfficial.signature : null,
  })

  const { data, loading, subscribeToMore } = useOfficialTypesQuery()

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
    setValue,
  } = useForm<SchoolOfficialType>({
    defaultValues: {
      name: schoolOfficial?.name || '',
      email: schoolOfficial?.email || '',
      signature: schoolOfficial?.signature || '',
      liableTypeId: schoolOfficial ? schoolOfficial.liableType : null,
    },
    resolver: yupResolver(schoolOfficialValidationSchema),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = schoolOfficial ? Number(schoolOfficial.id) : undefined

      action({
        variables: {
          liable: {
            ...values,
            id,
            liableTypeId: Number(values.liableTypeId.id),
            schoolId: enterpriseId,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(`Responsable ${data.schoolOfficial.name} enregistrée`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('schoolOfficial', data.schoolOfficial)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter le responsable: ${formatError(error)}`,
          )
        })
    })(event)
  }

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'officialFunction') {
          setValue('liableTypeId', message.value)
        }
      }
    })
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
        setValue('signature', datum.fileName)
        setValues({ ...values, picture: datum.fileName })
      }
    }

    dataSource.upload(`upload/file`, formData, callback).catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.message)
        // console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the
        // browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
    })
  }

  return (
    <Form onSubmit={onSubmit} className="space-y-">
      <FormSection
        icon={<UserCog className="w-5 h-5" />}
        title={t('label-officialFunction') || 'Fonction'}
        description="Sélectionnez la fonction du responsable"
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
              <ControlledSelect
                name="liableTypeId"
                label={t('label-officialFunction')}
                control={control}
                loading={loading}
                onChange={(val) => setValue('liableTypeId', val)}
                options={officialTypes || undefined}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                form={<OfficialFunctionAdd />}
                formId="officialFunction"
                optionLabel="name"
                formTitle={t('action.add_officialFunction')}
                prepend={<UserCog size={16} />}
              />
            )}
          </LiveView>
        </div>
      </FormSection>

      <FormSection
        icon={<User className="w-5 h-5" />}
        title={t('label-personalInformation') || 'Informations personnelles'}
        description="Nom et email du responsable"
        color="#28c76f"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <FormItem
              name="name"
              label={t('label-name')}
              control={control}
              required
              prepend={<Type size={16} />}
            />

            <FormItem
              name="email"
              label={t('label-email')}
              control={control}
              prepend={<Mail size={16} />}
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        icon={<PenTool className="w-5 h-5" />}
        title={t('label-signature') || 'Signature'}
        description="Signature numérique du responsable"
        color="#ea5455"
      >
        <div className="space-y-4">
          {!values.picture && (
            <FileUpload
              accept="image/*"
              onChange={(data: any) => {
                handleUpload(data[0])
              }}
            />
          )}

          {values.picture && (
            <ImagePreview
              url={values.picture}
              deleteAction={() => {
                setValues({ ...values, file: null, picture: null })
                setValue('signature', null)
              }}
            />
          )}
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

export default SchoolOfficialForm
