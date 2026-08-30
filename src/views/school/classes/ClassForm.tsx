import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import type { ClassType } from '@/views/school/classes/Class.type'
import { Form } from 'reactstrap'
import {
  BookOpen,
  User,
  Settings,
  Calendar,
  Award,
  Layers,
  Hash,
  Type,
  UserCheck,
  Target,
} from 'lucide-react'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import {
  branchOptions,
  teacherFilterOptions,
  teacherOptions,
  teacherSingleValue,
} from '@/utils/select/selectComponents'
import Input from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { yupResolver } from '@hookform/resolvers/yup'
import { classValidationSchema } from '@/views/school/classes/class.validation'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  BranchCreatedDocument,
  PersonnelCreatedDocument,
  useBranchesQuery,
  usePersonnelQuery,
} from '@/gql/graphql'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'

interface ClassFormProps extends BaseFormProps {
  clazz?: ClassType
  modal?: NiceModalHandler
}

const initialValues: Partial<ClassType> = {
  code: '',
  name: '',
  branchId: null,
  headTeacherId: null,
  autoTimeTable: true,
  examClass: false,
}

const ClassForm: FC<ClassFormProps> = ({ clazz, modal, action, ...props }) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useBranchesQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataPersonnel,
    loading: loadingPersonnel,
    subscribeToMore: subscribeToMorePersonnel,
  } = usePersonnelQuery({
    variables: { id: enterpriseId },
  })

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm<ClassType>({
    mode: 'onBlur',
    defaultValues: {
      code: clazz?.code || '',
      name: clazz?.name || '',
      branchId: clazz ? clazz.branch : null,
      headTeacherId: clazz ? clazz.headTeacher : null,
      examClass: clazz ? clazz.examClass : false,
      autoTimeTable: clazz ? clazz.autoTimeTable : true,
      competenceClass: clazz ? clazz.competenceClass : false,
    },
    resolver: yupResolver(classValidationSchema),
  })

  // Watch toggle values for visual feedback
  const examClass = watch('examClass')
  const autoTimeTable = watch('autoTimeTable')
  const competenceClass = watch('competenceClass')

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = clazz ? Number(clazz.id) : undefined

      action({
        variables: {
          clazz: {
            ...values,
            id,
            branchId: Number(values.branchId.id),
            headTeacherId: values.headTeacherId
              ? Number(values.headTeacherId.id)
              : null,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(`Classe ${data.clazz.name} enregistrée`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('clazz', data.clazz)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter la classe: ${formatError(error)}`)
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {/* Basic Information Section */}
        <FormSection
          title={t('label-classInfo') || 'Informations de la classe'}
          description={
            t('label-classInfoDesc') || 'Détails généraux de la classe'
          }
          icon={<BookOpen size={18} />}
          color="#7367f0"
        >
          <div className="space-y-3">
            {/* Branch Selection */}
            <LiveView
              document={BranchCreatedDocument}
              singleVar="branch"
              data={data}
              loading={loading}
              listVar="branches"
              subscribeToMore={subscribeToMore}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ branches }) => (
                <ControlledSelect
                  name="branchId"
                  label={t('label-branch')}
                  control={control}
                  loading={loading}
                  required={true}
                  prepend={<Layers size={16} />}
                  onChange={(val) => setValue('branchId', val)}
                  options={branches || undefined}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  components={{ Option: branchOptions }}
                  formId="branch"
                  optionLabel="name"
                />
              )}
            </LiveView>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <Input
                name="code"
                label={t('label-code')}
                control={control}
                prepend={<Hash size={16} />}
                placeholder="Ex: 6EME-A"
              />
              <Input
                name="name"
                label={t('label-name')}
                control={control}
                required={true}
                prepend={<Type size={16} />}
                placeholder="Ex: Sixième A"
              />
            </div>
          </div>
        </FormSection>

        {/* Head Teacher Section */}
        <FormSection
          title={t('label-headTeacher') || 'Titulaire'}
          description={
            t('label-headTeacherDesc') || 'Enseignant responsable de la classe'
          }
          icon={<UserCheck size={18} />}
          color="#28c76f"
        >
          <div className="space-y-2">
            <LiveView
              document={PersonnelCreatedDocument}
              singleVar="personnel"
              data={dataPersonnel}
              loading={loadingPersonnel}
              listVar="personnels"
              subscribeToMore={subscribeToMorePersonnel}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ personnels }) => (
                <ControlledSelect
                  name="headTeacherId"
                  label={t('label-headTeacher')}
                  control={control}
                  loading={loadingPersonnel}
                  prepend={<User size={16} />}
                  onChange={(val) => setValue('headTeacherId', val)}
                  options={personnels || undefined}
                  getOptionLabel={(option) => option.lastName}
                  getOptionValue={(option) => option.id}
                  components={{
                    Option: teacherOptions,
                    SingleValue: teacherSingleValue,
                  }}
                  filterOption={teacherFilterOptions}
                  formId="teacher"
                  optionLabel="lastName"
                />
              )}
            </LiveView>
          </div>
        </FormSection>

        {/* Class Settings Section */}
        <FormSection
          title={t('label-classSettings') || 'Paramètres'}
          description={
            t('label-classSettingsDesc') || 'Options et configurations avancées'
          }
          icon={<Settings size={18} />}
          color="#ff9f43"
          className="col-span-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <ToggleOption
              icon={<Award size={16} />}
              title={t('label-examClass')}
              description={
                t('label-examClassDesc') || 'Classe à examen officiel'
              }
              isActive={examClass}
            >
              <Switch
                name="examClass"
                control={control}
                defaultChecked={getValues('examClass')}
                label=""
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValue('examClass', e.target.checked, { shouldDirty: true })
                }
              />
            </ToggleOption>

            <ToggleOption
              icon={<Calendar size={16} />}
              title={t('label-autoTimeTable')}
              description={
                t('label-autoTimeTableDesc') || 'Génération automatique'
              }
              isActive={autoTimeTable}
            >
              <Switch
                name="autoTimeTable"
                control={control}
                defaultChecked={getValues('autoTimeTable')}
                label=""
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValue('autoTimeTable', e.target.checked, {
                    shouldDirty: true,
                  })
                }
              />
            </ToggleOption>

            <ToggleOption
              icon={<Target size={16} />}
              title={t('label-competenceClass')}
              description={
                t('label-competenceClassDesc') || 'Approche par compétences'
              }
              isActive={competenceClass}
            >
              <Switch
                name="competenceClass"
                control={control}
                defaultChecked={getValues('competenceClass')}
                label=""
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValue('competenceClass', e.target.checked, {
                    shouldDirty: true,
                  })
                }
              />
            </ToggleOption>
          </div>
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

export default ClassForm
