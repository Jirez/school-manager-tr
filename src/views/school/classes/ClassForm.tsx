import type { FC } from 'react'
import { useAuthentication } from '@/hooks/useAuthentication'
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
import {
  branchOptions,
  teacherFilterOptions,
  teacherOptions,
  teacherSingleValue,
} from '@/utils/select/selectComponents'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { classValidation } from '@/views/school/classes/class.validation'
// import type { ClassSchemaType } from '@/views/school/classes/class.validation'
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
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { useSelector } from '@tanstack/react-form'
import { m } from '@/paraglide/messages'

interface ClassFormProps extends BaseFormProps {
  clazz?: ClassType
  modal?: NiceModalHandler
}

const ClassForm: FC<ClassFormProps> = ({ clazz, modal, action, ...props }) => {
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
    handleSubmit,
    AppField,
    reset,
    store,
    AppForm,
    SubmitButton,
    setFieldValue,
  } = useAppForm({
    defaultValues: {
      code: clazz?.code || '',
      name: clazz?.name || '',
      branchId: clazz ? clazz.branch : null,
      headTeacherId: clazz ? clazz.headTeacher : null,
      examClass: clazz ? clazz.examClass : false,
      autoTimeTable: clazz ? clazz.autoTimeTable : true,
      competenceClass: clazz ? clazz.competenceClass : false,
    },
    validators: {
      // @ts-ignore desc
      onChange: classValidation,
    },
    onSubmitMeta: defaultMeta,
    onSubmit({ value, meta }) {
      const id = clazz ? Number(clazz.id) : undefined
      const parsed = classValidation.parse(value)

      action({
        variables: {
          clazz: {
            ...parsed,
            id,
            branchId: Number(parsed.branchId?.id),
            headTeacherId: parsed.headTeacherId
              ? Number(parsed.headTeacherId?.id)
              : null,
          },
        },
      })
        .then(async ({ data: result }) => {
          reset()
          toast.success(`Classe ${result.clazz.name} enregistrée`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('clazz', result.clazz)
            props.onModalClose?.()
          }
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (meta.close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter la classe: ${formatError(error)}`)
        })
    },
  })

  const examClass = useSelector(store, (state) => state.values.examClass)
  const autoTimeTable = useSelector(
    store,
    (state) => state.values.autoTimeTable,
  )
  const competenceClass = useSelector(
    store,
    (state) => state.values.competenceClass,
  )

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {/* Basic Information Section */}
        <FormSection
          title={m.label_classInfo()}
          description={m.label_classInfoDesc()}
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
                <AppField
                  name="branchId"
                  children={(field) => (
                    <field.ControlledSelect
                      label={m.label_branch()}
                      required={true}
                      loading={loading}
                      prepend={<Layers size={16} />}
                      options={branches || undefined}
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option: any) => option.id}
                      components={{ Option: branchOptions }}
                      optionLabel="name"
                      onChange={(val: any) => setFieldValue('branchId', val)}
                    />
                  )}
                />
              )}
            </LiveView>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <AppField
                name="code"
                children={(field) => (
                  <field.Input
                    label={m.label_code()}
                    prepend={<Hash size={16} />}
                    placeholder="Ex: 6EME-A"
                  />
                )}
              />
              <AppField
                name="name"
                children={(field) => (
                  <field.Input
                    label={m.label_name()}
                    required={true}
                    prepend={<Type size={16} />}
                    placeholder="Ex: Sixième A"
                  />
                )}
              />
            </div>
          </div>
        </FormSection>

        {/* Head Teacher Section */}
        <FormSection
          title={m.label_headTeacher()}
          description={m.label_headTeacherDesc()}
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
                <AppField
                  name="headTeacherId"
                  children={(field) => (
                    <field.ControlledSelect
                      label={m.label_headTeacher()}
                      loading={loadingPersonnel}
                      prepend={<User size={16} />}
                      options={personnels || undefined}
                      getOptionLabel={(option: any) => option.lastName}
                      getOptionValue={(option: any) => option.id}
                      components={{
                        Option: teacherOptions,
                        SingleValue: teacherSingleValue,
                      }}
                      filterOption={teacherFilterOptions}
                      optionLabel="lastName"
                      onChange={(val: any) =>
                        setFieldValue('headTeacherId', val)
                      }
                    />
                  )}
                />
              )}
            </LiveView>
          </div>
        </FormSection>

        {/* Class Settings Section */}
        <FormSection
          title={m.label_classSettings()}
          description={m.label_classSettingsDesc()}
          icon={<Settings size={18} />}
          color="#ff9f43"
          className="col-span-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <ToggleOption
              icon={<Award size={16} />}
              title={m.label_examClass()}
              description={m.label_examClassDesc()}
              isActive={examClass}
            >
              <AppField
                name="examClass"
                children={(field) => <field.Switch label="" />}
              />
            </ToggleOption>

            <ToggleOption
              icon={<Calendar size={16} />}
              title={m.label_autoTimeTable()}
              description={m.label_autoTimeTableDesc()}
              isActive={autoTimeTable}
            >
              <AppField
                name="autoTimeTable"
                children={(field) => <field.Switch label="" />}
              />
            </ToggleOption>

            <ToggleOption
              icon={<Target size={16} />}
              title={m.label_competenceClass()}
              description={m.label_competenceClassDesc()}
              isActive={competenceClass}
            >
              <AppField
                name="competenceClass"
                children={(field) => <field.Switch label="" />}
              />
            </ToggleOption>
          </div>
        </FormSection>
      </div>

      {/* Action Buttons */}
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

export default ClassForm
