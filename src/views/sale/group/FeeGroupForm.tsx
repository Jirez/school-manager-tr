import type { FC } from 'react'
import { toast } from 'react-toastify'
import { useAuthentication } from '@/hooks/useAuthentication'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { Form } from 'reactstrap'
import {
  FileText,
  Users,
  Settings,
  StickyNote,
  CreditCard,
  Target,
  Layers,
  RefreshCw,
  GraduationCap,
  ExternalLink,
  Award,
  Heart,
  Briefcase,
  Power,
  Info,
} from 'lucide-react'

import LiveView from '@/utils/LiveView'
import { levelOptions } from '@/utils/select/selectComponents'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import { LevelCreatedDocument, useLevelsQuery } from '@/gql/graphql'
import type { FeeGroupType } from './fee.group.type'
import { feeGroupZodSchema } from './fee.group.validation'
import type { FeeGroupZodSchemaType } from './fee.group.validation'
import dayjs from 'dayjs'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { useSelector } from '@tanstack/react-form'
import { m } from '@/paraglide/messages'

interface FeeGroupFormProps extends BaseFormProps {
  feeGroup?: FeeGroupType
  modal?: NiceModalHandler
}

const FeeGroupForm: FC<FeeGroupFormProps> = ({
  feeGroup,
  modal,
  action,
  ...props
}) => {
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useLevelsQuery({
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
      name: feeGroup?.name || '',
      name2: feeGroup?.name2 || '',
      registrationDateAfter: feeGroup
        ? feeGroup.registrationDateAfter
          ? dayjs(feeGroup.registrationDateAfter).toDate()
          : null
        : null,
      registrationDateBefore: feeGroup
        ? feeGroup.registrationDateBefore
          ? dayjs(feeGroup.registrationDateBefore).toDate()
          : null
        : null,
      birthDateAfter: feeGroup
        ? feeGroup.birthDateAfter
          ? dayjs(feeGroup.birthDateAfter).toDate()
          : null
        : null,
      birthDateBefore: feeGroup
        ? feeGroup.birthDateBefore
          ? dayjs(feeGroup.birthDateBefore).toDate()
          : null
        : null,
      gender: feeGroup ? feeGroup.gender : null,
      levelId: feeGroup ? feeGroup.levelId : null,
      familyOfXAndAboveChildren: feeGroup
        ? feeGroup.familyOfXAndAboveChildren
        : '',
      oneTimePayment: feeGroup ? feeGroup.oneTimePayment : false,
      isAlumni: feeGroup ? feeGroup.isAlumni : false,
      isExternalStudent: feeGroup ? feeGroup.isExternalStudent : false,
      hasScholarship: feeGroup ? feeGroup.hasScholarship : false,
      isSocialCase: feeGroup ? feeGroup.isSocialCase : false,
      isStaffStudent: feeGroup ? feeGroup.isStaffStudent : false,
      useAsFallback: feeGroup ? feeGroup.useAsFallback : false,
      isActive: feeGroup ? feeGroup.isActive : true,
      note: feeGroup?.note || '',
    } as FeeGroupZodSchemaType,
    validators: {
      onChange: feeGroupZodSchema,
    },
    onSubmitMeta: defaultMeta,
    onSubmit({ value, meta }) {
      const id = feeGroup ? Number(feeGroup.id) : undefined
      const values = feeGroupZodSchema.parse(value)

      action({
        variables: {
          group: {
            ...values,
            id,
            schoolId: enterpriseId,
            registrationDateAfter: values.registrationDateAfter
              ? dayjs(values.registrationDateAfter).format(INPUT_DATE_FORMAT)
              : null,
            registrationDateBefore: values.registrationDateBefore
              ? dayjs(values.registrationDateBefore).format(INPUT_DATE_FORMAT)
              : null,
            birthDateAfter: values.birthDateAfter
              ? dayjs(values.birthDateAfter).format(INPUT_DATE_FORMAT)
              : null,
            birthDateBefore: values.birthDateBefore
              ? dayjs(values.birthDateBefore).format(INPUT_DATE_FORMAT)
              : null,
            levelId: values.levelId ? Number(values.levelId) : null,
          },
        },
      })
        .then(async ({ data: result }) => {
          reset()
          toast.success(
            `Groupe de paiement ${result.feeGroup.name} enregistré`,
            {
              ...TOAST_OPTIONS,
            },
          )

          if (props.popover) {
            messageService.sendMessage('feeGroup', result.feeGroup)
            props.onModalClose?.()
          }
          if (meta.close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter le groupe de paiement: ${formatError(error)}`,
          )
        })
    },
  })

  const useAsFallback = useSelector(
    store,
    (state) => state.values.useAsFallback,
  )
  const isAlumni = useSelector(store, (state) => state.values.isAlumni)
  const isExternalStudent = useSelector(
    store,
    (state) => state.values.isExternalStudent,
  )
  const hasScholarship = useSelector(
    store,
    (state) => state.values.hasScholarship,
  )
  const isSocialCase = useSelector(store, (state) => state.values.isSocialCase)
  const isStaffStudent = useSelector(
    store,
    (state) => state.values.isStaffStudent,
  )
  const oneTimePayment = useSelector(
    store,
    (state) => state.values.oneTimePayment,
  )
  const isActive = useSelector(store, (state) => state.values.isActive)

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      className="p-0"
    >
      <div className="pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {/* Basic Information Section */}
          <FormSection
            title={m.label_basicInformation()}
            description={m.label_feeGroupInfoDesc()}
            icon={<CreditCard size={18} />}
            color="#7367f0"
            className="md:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              <AppField
                name="name"
                children={(field) => (
                  <field.Input
                    label={m.label_name()}
                    required={true}
                    prepend={<FileText size={14} />}
                    placeholder={
                      m.label_namePlaceholder() || 'Ex: Groupe Standard'
                    }
                  />
                )}
              />

              <AppField
                name="name2"
                children={(field) => (
                  <field.Input
                    label={m.label_name2()}
                    prepend={<FileText size={14} />}
                    placeholder={m.label_name2Placeholder()}
                  />
                )}
              />

              <LiveView
                document={LevelCreatedDocument}
                singleVar="level"
                data={data}
                loading={loading}
                listVar="levels"
                subscribeToMore={subscribeToMore}
                sortField="label"
                triggerUpdate={true}
                enterpriseId={enterpriseId}
              >
                {({ levels }) => (
                  <AppField
                    name="levelId"
                    children={(field) => (
                      <field.ControlledSelect
                        label={m.label_level()}
                        required={false}
                        loading={loading}
                        prepend={<Layers size={14} />}
                        options={levels || undefined}
                        getOptionLabel={(option: any) => option.name}
                        getOptionValue={(option: any) => option.id}
                        components={{ Option: levelOptions }}
                        onChange={(val: any) => setFieldValue('levelId', val)}
                      />
                    )}
                  />
                )}
              </LiveView>
            </div>
          </FormSection>

          {/* Student Criteria Section */}
          <FormSection
            title={m.label_selectionCriteria()}
            description={m.label_selectionCriteriaDesc()}
            icon={<Target size={18} />}
            color="#00cfe8"
            className="col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <AppField
                name="gender"
                children={(field) => (
                  <field.ControlledSelect
                    label={m.label_gender()}
                    options={[
                      { value: '', label: m.label_selectGender() },
                      { value: 'MALE', label: m.label_male() },
                      { value: 'FEMALE', label: m.label_female() },
                    ]}
                    onChange={(val: any) => setFieldValue('gender', val)}
                  />
                )}
              />

              <AppField
                name="familyOfXAndAboveChildren"
                children={(field) => (
                  <field.Input
                    label={m.label_familyOfXAndAboveChildren()}
                    prepend={<Users size={14} />}
                  />
                )}
              />

              <AppField
                name="registrationDateAfter"
                children={(field) => (
                  <field.DatePicker label={m.label_registrationDateAfter()} />
                )}
              />

              <AppField
                name="registrationDateBefore"
                children={(field) => (
                  <field.DatePicker label={m.label_registrationDateBefore()} />
                )}
              />

              <AppField
                name="birthDateAfter"
                children={(field) => (
                  <field.DatePicker label={m.label_birthDateAfter()} />
                )}
              />

              <AppField
                name="birthDateBefore"
                children={(field) => (
                  <field.DatePicker label={m.label_birthDateBefore()} />
                )}
              />
            </div>
          </FormSection>

          {/* Options Section */}
          <FormSection
            title={m.label_groupOptions()}
            description={m.label_groupOptionsDesc()}
            icon={<Settings size={18} />}
            color="#28c76f"
            className="col-span-2"
          >
            <div className="grid grid-cols-1 gap-1">
              <ToggleOption
                title={m.label_useAsFallback()}
                description={m.label_useAsFallbackDesc()}
                icon={<RefreshCw size={18} />}
                isActive={useAsFallback}
              >
                <AppField
                  name="useAsFallback"
                  children={(field) => <field.Switch label="" />}
                />
              </ToggleOption>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                <ToggleOption
                  title={m.label_isAlumni()}
                  description={m.label_isAlumniDesc()}
                  icon={<GraduationCap size={18} />}
                  isActive={isAlumni}
                >
                  <AppField
                    name="isAlumni"
                    children={(field) => <field.Switch label="" />}
                  />
                </ToggleOption>

                <ToggleOption
                  title={m.label_isExternalStudent()}
                  description={m.label_isExternalStudentDesc()}
                  icon={<ExternalLink size={18} />}
                  isActive={isExternalStudent}
                >
                  <AppField
                    name="isExternalStudent"
                    children={(field) => <field.Switch label="" />}
                  />
                </ToggleOption>

                <ToggleOption
                  title={m.label_hasScholarship()}
                  description={m.label_hasScholarshipDesc()}
                  icon={<Award size={18} />}
                  isActive={hasScholarship}
                >
                  <AppField
                    name="hasScholarship"
                    children={(field) => <field.Switch label="" />}
                  />
                </ToggleOption>

                <ToggleOption
                  title={m.label_isSocialCase()}
                  description={m.label_isSocialCaseDesc()}
                  icon={<Heart size={18} />}
                  isActive={isSocialCase}
                >
                  <AppField
                    name="isSocialCase"
                    children={(field) => <field.Switch label="" />}
                  />
                </ToggleOption>

                <ToggleOption
                  title={m.label_isStaffStudent()}
                  description={m.label_isStaffStudentDesc()}
                  icon={<Briefcase size={18} />}
                  isActive={isStaffStudent}
                >
                  <AppField
                    name="isStaffStudent"
                    children={(field) => <field.Switch label="" />}
                  />
                </ToggleOption>

                <ToggleOption
                  title={m.label_oneTimePayment()}
                  description={m.label_oneTimePaymentDesc()}
                  icon={<CreditCard size={18} />}
                  isActive={oneTimePayment}
                >
                  <AppField
                    name="oneTimePayment"
                    children={(field) => <field.Switch label="" />}
                  />
                </ToggleOption>

                <ToggleOption
                  title={m.label_active()}
                  description={m.label_activeDesc()}
                  icon={<Power size={18} />}
                  isActive={isActive}
                >
                  <AppField
                    name="isActive"
                    children={(field) => <field.Switch label="" />}
                  />
                </ToggleOption>
              </div>
            </div>
          </FormSection>

          {/* Additional Notes Section */}
          <FormSection
            title={m.label_additionalNotes()}
            description={m.label_notesDesc()}
            icon={<StickyNote size={18} />}
            color="#ff9f43"
            className="md:col-span-2"
          >
            <AppField
              name="note"
              children={(field) => (
                <field.Input
                  label={''}
                  type="textarea"
                  rows={3}
                  prepend={<Info size={14} />}
                  placeholder={m.label_notePlaceholder()}
                />
              )}
            />
          </FormSection>
        </div>
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

export default FeeGroupForm
