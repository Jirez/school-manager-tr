import type { FC } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
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
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { levelOptions } from '@/utils/select/selectComponents'
import Input from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { setOffcanvasSize } from '@/utils/helpers'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import { LevelCreatedDocument, useLevelsQuery } from '@/gql/graphql'
import type { FeeGroupType } from './fee.group.type'
import { feeGroupValidation } from './fee.group.validation'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import dayjs from 'dayjs'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'

interface FeeGroupFormProps extends BaseFormProps {
  feeGroup?: FeeGroupType
  modal?: NiceModalHandler
}

const initialValues: Partial<FeeGroupType> = {
  name: '',
  name2: '',
  registrationDateAfter: '',
  registrationDateBefore: '',
  birthDateAfter: '',
  birthDateBefore: '',
  gender: '',
  levelId: null,
  familyOfXAndAboveChildren: '',
  oneTimePayment: false,
  isAlumni: false,
  isExternalStudent: false,
  hasScholarship: false,
  isSocialCase: false,
  isStaffStudent: false,
  useAsFallback: false,
  isActive: false,
  note: '',
}

const FeeGroupForm: FC<FeeGroupFormProps> = ({
  feeGroup,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useLevelsQuery({
    variables: { id: enterpriseId },
  })

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
    getValues,
    setValue,
  } = useForm<FeeGroupType>({
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
    },
    resolver: yupResolver(feeGroupValidation),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = feeGroup ? Number(feeGroup.id) : undefined

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
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(`Groupe de paiement ${data.feeGroup.name} enregistré`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('feeGroup', data.feeGroup)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter le groupe de paiement: ${formatError(error)}`,
          )
        })
    })(event)
  }

  useEffect(() => {
    setOffcanvasSize('50%')
  }, [])

  return (
    <Form onSubmit={onSubmit} className="p-0">
      <div className="pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {/* Basic Information Section */}
          <FormSection
            title={t('label-basicInformation') || 'Informations de base'}
            description={t('label-feeGroupInfoDesc') || 'Nom et configuration'}
            icon={<CreditCard size={18} />}
            color="#7367f0"
            className="md:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              <Input
                name="name"
                label={t('label-name')}
                control={control}
                required={true}
                prepend={<FileText size={14} />}
                placeholder={
                  t('label-namePlaceholder') || 'Ex: Groupe Standard'
                }
              />

              <Input
                name="name2"
                label={t('label-name2')}
                control={control}
                prepend={<FileText size={14} />}
                placeholder={t('label-name2Placeholder') || 'Nom alternatif'}
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
                  <ControlledSelect
                    name="levelId"
                    label={t('label-level')}
                    control={control}
                    required={false}
                    loading={loading}
                    prepend={<Layers size={14} />}
                    onChange={(val) => setValue('levelId', val)}
                    options={levels || undefined}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    components={{ Option: levelOptions }}
                    formId="level"
                  />
                )}
              </LiveView>
            </div>
          </FormSection>

          {/* Student Criteria Section */}
          <FormSection
            title={t('label-selectionCriteria') || 'Critères de sélection'}
            description={
              t('label-selectionCriteriaDesc') || "Règles d'attribution"
            }
            icon={<Target size={18} />}
            color="#00cfe8"
            className="col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <Input
                name="gender"
                label={t('label-gender')}
                control={control}
                type="select"
                //prepend={<User size={14} />}
              >
                <option value="">{t('label-selectGender')}</option>
                <option value="MALE">{t('label-male')}</option>
                <option value="FEMALE">{t('label-female')}</option>
              </Input>

              <Input
                name="familyOfXAndAboveChildren"
                label={t('label-familyOfXAndAboveChildren')}
                control={control}
                prepend={<Users size={14} />}
              />

              <DatePicker
                name="registrationDateAfter"
                label={t('label-registrationDateAfter')}
                control={control}
              />

              <DatePicker
                name="registrationDateBefore"
                label={t('label-registrationDateBefore')}
                control={control}
              />

              <DatePicker
                name="birthDateAfter"
                label={t('label-birthDateAfter')}
                control={control}
              />

              <DatePicker
                name="birthDateBefore"
                label={t('label-birthDateBefore')}
                control={control}
              />
            </div>
          </FormSection>

          {/* Options Section */}
          <FormSection
            title={t('label-groupOptions') || 'Options du groupe'}
            description={
              t('label-groupOptionsDesc') || 'Drapeaux et comportements'
            }
            icon={<Settings size={18} />}
            color="#28c76f"
            className="col-span-2"
          >
            <div className="grid grid-cols-1 gap-1">
              <ToggleOption
                title={t('label-useAsFallback')}
                description={
                  t('label-useAsFallbackDesc') || 'Utiliser par défaut'
                }
                icon={<RefreshCw size={18} />}
                isActive={getValues('useAsFallback')}
              >
                <Switch
                  name="useAsFallback"
                  control={control}
                  label=""
                  defaultChecked={getValues('useAsFallback')}
                />
              </ToggleOption>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                <ToggleOption
                  title={t('label-isAlumni')}
                  description={t('label-isAlumniDesc') || 'Anciens élèves'}
                  icon={<GraduationCap size={18} />}
                  isActive={getValues('isAlumni')}
                >
                  <Switch
                    name="isAlumni"
                    control={control}
                    label=""
                    defaultChecked={getValues('isAlumni')}
                  />
                </ToggleOption>

                <ToggleOption
                  title={t('label-isExternalStudent')}
                  description={
                    t('label-isExternalStudentDesc') || 'Élèves externes'
                  }
                  icon={<ExternalLink size={18} />}
                  isActive={getValues('isExternalStudent')}
                >
                  <Switch
                    name="isExternalStudent"
                    control={control}
                    label=""
                    defaultChecked={getValues('isExternalStudent')}
                  />
                </ToggleOption>

                <ToggleOption
                  title={t('label-hasScholarship')}
                  description={t('label-hasScholarshipDesc') || 'Boursiers'}
                  icon={<Award size={18} />}
                  isActive={getValues('hasScholarship')}
                >
                  <Switch
                    name="hasScholarship"
                    control={control}
                    label=""
                    defaultChecked={getValues('hasScholarship')}
                  />
                </ToggleOption>

                <ToggleOption
                  title={t('label-isSocialCase')}
                  description={t('label-isSocialCaseDesc') || 'Cas sociaux'}
                  icon={<Heart size={18} />}
                  isActive={getValues('isSocialCase')}
                >
                  <Switch
                    name="isSocialCase"
                    control={control}
                    label=""
                    defaultChecked={getValues('isSocialCase')}
                  />
                </ToggleOption>

                <ToggleOption
                  title={t('label-isStaffStudent')}
                  description={
                    t('label-isStaffStudentDesc') || 'Enfants personnels'
                  }
                  icon={<Briefcase size={18} />}
                  isActive={getValues('isStaffStudent')}
                >
                  <Switch
                    name="isStaffStudent"
                    control={control}
                    label=""
                    defaultChecked={getValues('isStaffStudent')}
                  />
                </ToggleOption>

                <ToggleOption
                  title={t('label-oneTimePayment')}
                  description={
                    t('label-oneTimePaymentDesc') || 'Paiement unique'
                  }
                  icon={<CreditCard size={18} />}
                  isActive={getValues('oneTimePayment')}
                >
                  <Switch
                    name="oneTimePayment"
                    control={control}
                    label=""
                    defaultChecked={getValues('oneTimePayment')}
                  />
                </ToggleOption>

                <ToggleOption
                  title={t('label-active')}
                  description={t('label-activeDesc') || 'Groupe actif'}
                  icon={<Power size={18} />}
                  isActive={getValues('isActive')}
                >
                  <Switch
                    name="isActive"
                    control={control}
                    label=""
                    defaultChecked={getValues('isActive')}
                  />
                </ToggleOption>
              </div>
            </div>
          </FormSection>

          {/* Additional Notes Section */}
          <FormSection
            title={t('label-additionalNotes') || 'Notes complémentaires'}
            description={t('label-notesDesc') || 'Observations internes'}
            icon={<StickyNote size={18} />}
            color="#ff9f43"
            className="md:col-span-2"
          >
            <Input
              name="note"
              label={''}
              control={control}
              type="textarea"
              rows={3}
              prepend={<Info size={14} />}
              placeholder={
                t('label-notePlaceholder') || 'Saisir vos notes ici...'
              }
            />
          </FormSection>
        </div>
      </div>

      <StickyActions>
        <ActionButtons
          cancelAction={modal?.hide}
          isSubmitting={props.loading}
          popover={props.popover}
          dirty={isDirty}
          onSubmit={onSubmit}
          fixed={false}
        />
      </StickyActions>
    </Form>
  )
}

export default FeeGroupForm
