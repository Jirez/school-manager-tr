import type { FC } from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  BookOpen,
  Settings,
  FileText,
  CheckCircle,
  CalendarDays,
  Hash,
  Type,
  Tag,
} from 'lucide-react'

import type { Subject } from '@/views/school/subjects/Subject.type'
import { validationSchema } from '@/views/school/subjects/subject.validation'
import { useAuthentication } from '@/hooks/useAuthentication'
import { default as FormItem } from '@/@core/components/ui/forms/input'
import LiveView from '@/utils/LiveView'
import { departmentOptions } from '@/utils/select/selectComponents'
import { formatError } from '@/utils/ErrorHelper'
import Switch from '@/@core/components/ui/forms/swith'
import { messageService } from '@/utils/message.service'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import DepartmentAdd from '@/views/school/subjectDepartments/DepartmentAdd'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  SubjectDepartmentCreatedDocument,
  useSubjectDepartmentsQuery,
} from '@/gql/graphql'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'

interface SubjectFormProps extends BaseFormProps {
  subject?: Subject
  modal?: NiceModalHandler
  loading: boolean
}

const initialValues: Partial<Subject> = {
  name: '',
  subjectDepartmentId: null,
  code: '',
  note: '',
  active: true,
  displayName: '',
  showInTimeTable: true,
}

const SubjectForm: FC<SubjectFormProps> = ({
  subject,
  modal,
  action,
  ...props
}) => {
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()

  const {
    data,
    loading: loadingDepartment,
    subscribeToMore,
  } = useSubjectDepartmentsQuery({
    variables: { id: enterpriseId },
  })

  const {
    control,
    formState: { isDirty },
    getValues,
    reset,
    handleSubmit,
    setValue,
    watch,
  } = useForm<Subject>({
    defaultValues: {
      code: subject?.code || '',
      name: subject?.name || '',
      displayName: subject?.displayName || '',
      active: subject ? subject.active : true,
      subjectDepartmentId: subject ? subject.subjectDepartment : undefined,
      showInTimeTable: subject ? subject.showInTimeTable : true,
      note: subject?.note || '',
    },
    resolver: yupResolver(validationSchema),
    mode: 'all',
  })

  // Watch toggle values for visual feedback
  const active = watch('active')
  const showInTimeTable = watch('showInTimeTable')

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = subject ? Number(subject.id) : undefined

      action({
        variables: {
          subject: {
            ...values,
            id,
            subjectDepartmentId: Number(values.subjectDepartmentId.id),
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(`Matière ${data.subject.name} enregistrée`, {
            ...TOAST_OPTIONS,
          })
          props.refetch?.()

          if (props.popover) {
            messageService.sendMessage('subject', data.subject)
            props.onModalClose?.()
          }

          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter la matière: ${formatError(error)}`,
            {},
          )
        })
    })(event)
  }

  useEffect(() => {
    const subscription = messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'subjectDepartment') {
          setValue('subjectDepartmentId', message.value)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [setValue])

  return (
    <Form onSubmit={onSubmit}>
      <div className="flex flex-col gap-1">
        {/* Basic Information Section */}
        <FormSection
          icon={<BookOpen className="w-4 h-4" />}
          title="Informations"
          description="Détails généraux de la matière"
          color="#7367f0"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-1">
            {/* Department Selection */}
            <div className="md:col-span-12">
              <LiveView
                document={SubjectDepartmentCreatedDocument}
                singleVar="subjectDepartment"
                data={data}
                listVar="subjectDepartments"
                subscribeToMore={subscribeToMore}
                triggerUpdate={true}
                enterpriseId={enterpriseId}
              >
                {({ subjectDepartments }) => (
                  <ControlledSelect
                    name="subjectDepartmentId"
                    label={t('label-department')}
                    control={control}
                    required={true}
                    onChange={(value) => setValue('subjectDepartmentId', value)}
                    options={subjectDepartments || undefined}
                    getOptionLabel={(option: any) => option.name}
                    getOptionValue={(option: any) => option.id}
                    components={{ Option: departmentOptions }}
                    form={<DepartmentAdd />}
                    formId="subjectDepartment"
                    optionLabel="name"
                    isLoading={loadingDepartment}
                    formTitle={t('action.add_department')}
                    placeholder={t('label-selectPlaceholder')}
                  />
                )}
              </LiveView>
            </div>

            {/* Code */}
            <div className="md:col-span-4">
              <FormItem
                name="code"
                label={t('label-code')}
                control={control}
                prepend={<Hash size={16} />}
              />
            </div>

            {/* Name */}
            <div className="md:col-span-8">
              <FormItem
                name="name"
                label={t('label-name')}
                required={true}
                control={control}
                prepend={<Tag size={16} />}
                onChange={(event) => {
                  setValue('name', event.target.value)
                  if (!subject) {
                    setValue('displayName', event.target.value)
                  }
                }}
              />
            </div>

            {/* Display Name */}
            <div className="md:col-span-12">
              <FormItem
                name="displayName"
                label={t('label-displayName')}
                control={control}
                prepend={<Type size={16} />}
              />
            </div>
          </div>
        </FormSection>

        {/* Settings Section - Grid Layout for Compactness */}
        <FormSection
          icon={<Settings className="w-4 h-4" />}
          title="Paramètres"
          description="Configuration"
          color="#ff9f43"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <ToggleOption
              icon={<CheckCircle className="w-4 h-4" />}
              title={t('label-active')}
              description="Disponible pour l'évaluation"
              isActive={active}
            >
              <Switch
                name="active"
                control={control}
                defaultChecked={getValues('active')}
                label=""
              />
            </ToggleOption>

            <ToggleOption
              icon={<CalendarDays className="w-4 h-4" />}
              title={t('label-showInTimeTable')}
              description="Afficher dans l'horaire"
              isActive={showInTimeTable}
            >
              <Switch
                name="showInTimeTable"
                control={control}
                defaultChecked={getValues('showInTimeTable')}
                label=""
              />
            </ToggleOption>
          </div>
        </FormSection>

        {/* Notes Section */}
        <FormSection
          icon={<FileText className="w-4 h-4" />}
          title="Notes"
          description="Description additionnelle"
          color="#00cfe8"
        >
          <FormItem
            name="note"
            label={''}
            control={control}
            type="textarea"
            placeholder="Ajouter une note..."
          />
        </FormSection>
      </div>

      {/* Action Buttons */}
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

export default SubjectForm
