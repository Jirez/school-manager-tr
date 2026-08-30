import type { FC } from 'react'
import { useEffect } from 'react'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form } from 'reactstrap'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup'
import { useResponsive } from 'ahooks'
import {
  GraduationCap,
  UserCheck,
  AlertCircle,
  MessageSquare,
  School,
  Layers,
  Hash,
  RefreshCw,
  UserMinus,
  CheckCircle2,
  FileText,
  Eye,
  CreditCard,
  Building,
} from 'lucide-react'

import type { FrequentUpdateType } from './Frequent.type'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useStudent } from '../students/useStudent'
import { messageService } from '@/utils/message.service'
import StudentFragmentForm, {
  genderOptions,
} from '../students/StudentFragmentForm'
import Input from '@/@core/components/ui/forms/input'
import LiveView from '@/utils/LiveView'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { classOptions } from '@/utils/select/selectComponents'
import ClassAdd from '../classes/ClassAdd'
import Switch from '@/@core/components/ui/forms/swith'
import { formatError } from '@/utils/ErrorHelper'
import type { StudentGuardian } from '../students/Student.type'
import OldSchoolAdd from '../oldSchools/OldSchoolAdd'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import { frequentUpdateValidation } from './frequent.validation'
import { setOffcanvasSize } from '@/utils/helpers'
import {
  ClassCreatedDocument,
  FeeGroupCreatedDocument,
  OldSchoolCreatedDocument,
  useClassesQuery,
  useFeeGroupsQuery,
  useOldSchoolsQuery,
} from '@/gql/graphql'
import FeeGroupAdd from '@/views/sale/group/FeeGroupAdd'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'

interface FrequentUpdateFormProps extends BaseFormProps {
  frequent: FrequentUpdateType
  modal?: NiceModalHandler
}

const FrequentUpdateForm: FC<FrequentUpdateFormProps> = ({
  frequent,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const responsive = useResponsive()

  const {
    data: dataClasses,
    loading: loadingClass,
    subscribeToMore: subscribeToMoreClass,
  } = useClassesQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const {
    data: dataSchool,
    loading: loadingSchool,
    subscribeToMore: subscribeToMoreSchool,
  } = useOldSchoolsQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataFeeGroup,
    loading: loadingFeeGroup,
    subscribeToMore: subscribeToMoreFeeGroup,
  } = useFeeGroupsQuery({
    variables: { id: enterpriseId },
  })

  const { student } = useStudent(frequent.student.id)

  const getSelectedGender = (): string | Record<string, any> => {
    if (!student) {
      return ''
    }

    return genderOptions
      .filter(({ value }) => value === student.gender)
      .map(({ label, value }) => ({ label: t(label), value }))[0]
  }

  const methods = useForm<any>({
    defaultValues: {
      // frequent fields
      classId: frequent.clazz,
      repeater: frequent.repeater,
      apt: frequent.apt,
      external: frequent.external,
      formerStudent: frequent.formerStudent,
      oldSchoolId: frequent.oldSchool,
      paymentGroupId: frequent.paymentGroup,
      feeGroupId: frequent.feeGroup,
      numberOrder: frequent.numberOrder,
      mailTo: frequent.mailTo,
      smsTo: frequent.smsTo,
      socialCase: frequent.socialCase,
      scNature: frequent.scNature,
      scObservation: frequent.scObservation,
    },
    resolver: yupResolver(frequentUpdateValidation),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return methods.handleSubmit(async (values) => {
      const id = student ? Number(student.id) : undefined
      const {
        items,
        classId,
        oldSchoolId,
        paymentGroupId,
        numberOrder,
        socialCase,
        scNature,
        scObservation,
        feeGroupId,
        ...rest
      } = values

      //formatting student guardians
      const guardians = items
        .filter((item: any) => itemValid(item))
        .map((item: any) => ({
          studentGuardianPK: {
            studentId: id,
            guardianId: Number(item.studentGuardianPK.guardianId),
          },
          relation: (item.relation as any)?.value || item.relation,
        }))

      action({
        variables: {
          frequent: {
            frequentPK: {
              studentId: id,
              classId: Number(classId.id),
            },
            numberOrder: numberOrder,
            repeater: rest.repeater,
            mailTo: rest.mailTo,
            smsTo: rest.smsTo,
            apt: rest.apt,
            external: rest.external,
            formerStudent: rest.formerStudent,
            oldSchoolId: oldSchoolId ? Number(oldSchoolId.id) : null,
            paymentGroupId: paymentGroupId ? Number(paymentGroupId.id) : null,
            feeGroupId: feeGroupId ? Number(feeGroupId.id) : null,
            schoolId: enterpriseId,
            socialCase,
            scNature: scNature ? scNature : null,
            scObservation: scObservation ? scObservation : null,
          },
          student: {
            ...rest,
            id,
            birthDate: dayjs(values.birthDate).format(INPUT_DATE_FORMAT),
            gender: rest.gender.value,
            schoolId: enterpriseId,
            enterpriseId: enterpriseId,
            studentGuardianCollection: guardians,
          },
        },
      })
        .then(async ({ data }) => {
          /* form.resetFields();
                    form.setFieldsValue({studentId: null});
                    form.setFieldsValue({classId: null}); */
          toast.success(`Elève modifié`, { ...TOAST_OPTIONS })
          props.refetch?.()

          if (props.popover) {
            messageService.sendMessage('frequent', data.frequent)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible de modifier l'inscription: ${t(formatError(error))}`,
          )
        })
    })(event)
  }

  const itemValid = (item: StudentGuardian) => {
    const { relation, studentGuardianPK } = item

    return relation && studentGuardianPK.guardianId
  }

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'oldSchool') {
          methods.setValue('oldSchoolId', message.value)
        }

        if (message.name === 'paymentGroup') {
          methods.setValue('paymentGroupId', message.value)
        }
      }
    })
  }, [messageService])

  useEffect(() => {
    if (responsive['lg']) {
      setOffcanvasSize('70%')
    } else {
      if (responsive['md']) {
        setOffcanvasSize('90%')
      } else {
        setOffcanvasSize('100%')
      }
    }
  }, [responsive])

  if (!student) return <h1>L'élève sélectionné est introuvable</h1>

  const socialCase = methods.watch('socialCase')

  return (
    <FormProvider {...methods}>
      <Form className="p-0" onSubmit={onSubmit}>
        <div className="pb-1">
          <StudentFragmentForm student={student} />
        </div>

        <div className="pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {/* Enrollment Information Section */}
            <FormSection
              title={
                t('label-enrollmentInformation') || "Informations d'inscription"
              }
              description={
                t('label-enrollmentInfoDesc') || 'Détails académiques'
              }
              icon={<GraduationCap size={18} />}
              color="#7367f0"
              className="md:col-span-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <LiveView
                  document={ClassCreatedDocument}
                  singleVar="clazz"
                  data={dataClasses}
                  listVar="clazzes"
                  subscribeToMore={subscribeToMoreClass}
                  sortField="name"
                  triggerUpdate={true}
                  enterpriseId={enterpriseId}
                >
                  {({ clazzes }) => (
                    <ControlledSelect
                      name="classId"
                      control={methods.control}
                      label={t('label-class')}
                      required
                      loading={loadingClass}
                      prepend={<Layers size={14} />}
                      onChange={(val) => methods.setValue('classId', val)}
                      options={clazzes || undefined}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                      components={{ Option: classOptions }}
                      form={<ClassAdd />}
                      formId="clazz"
                      optionLabel="name"
                      formTitle={t('action.add_class')}
                    />
                  )}
                </LiveView>

                <Input
                  name="numberOrder"
                  control={methods.control}
                  label={t('label-numberOrder')}
                  prepend={<Hash size={14} />}
                  placeholder="00"
                />
              </div>
            </FormSection>

            {/* Student Status Section */}
            <FormSection
              title={t('label-studentStatus') || "Statut de l'élève"}
              description={
                t('label-studentStatusDesc') || 'Types et ré-inscription'
              }
              icon={<UserCheck size={18} />}
              color="#28c76f"
            >
              <div className="grid grid-cols-1 gap-1">
                <ToggleOption
                  title={t('label-repeater')}
                  description={
                    t('label-repeaterDesc') || "L'élève redouble cette classe"
                  }
                  icon={<RefreshCw size={18} />}
                  isActive={methods.watch('repeater')}
                >
                  <Switch
                    name="repeater"
                    control={methods.control}
                    label=""
                    defaultChecked={methods.getValues('repeater')}
                  />
                </ToggleOption>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  <ToggleOption
                    title={t('label-formerStudent')}
                    description={t('label-formerStudentDesc') || 'Ancien élève'}
                    icon={<UserCheck size={18} />}
                    isActive={methods.watch('formerStudent')}
                  >
                    <Switch
                      name="formerStudent"
                      control={methods.control}
                      label=""
                      defaultChecked={methods.getValues('formerStudent')}
                    />
                  </ToggleOption>
                  <ToggleOption
                    title={t('label-external')}
                    description={t('label-externalDesc') || 'Élève externe'}
                    icon={<UserMinus size={18} />}
                    isActive={methods.watch('external')}
                  >
                    <Switch
                      name="external"
                      control={methods.control}
                      label=""
                      defaultChecked={methods.getValues('external')}
                    />
                  </ToggleOption>
                  <ToggleOption
                    title={t('label-apt')}
                    description={t('label-aptDesc') || 'Aptitude physique'}
                    icon={<CheckCircle2 size={18} />}
                    isActive={methods.watch('apt')}
                  >
                    <Switch
                      name="apt"
                      control={methods.control}
                      label=""
                      defaultChecked={methods.getValues('apt')}
                    />
                  </ToggleOption>
                  <ToggleOption
                    title={t('label-socialCase')}
                    description={
                      t('label-socialCaseDesc') || 'Élève cas social'
                    }
                    icon={<AlertCircle size={18} />}
                    isActive={methods.watch('socialCase')}
                  >
                    <Switch
                      name="socialCase"
                      control={methods.control}
                      label=""
                      defaultChecked={methods.getValues('socialCase')}
                    />
                  </ToggleOption>
                </div>
              </div>
            </FormSection>

            <div className="flex flex-col gap-1">
              {/* Communication Section */}
              <FormSection
                title={t('label-communication') || 'Communication'}
                description={
                  t('label-communicationDesc') || 'Destinataires préférés'
                }
                icon={<MessageSquare size={18} />}
                color="#ff9f43"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  <Input
                    name="smsTo"
                    control={methods.control}
                    label={t('label-smsTo')}
                    type="select"
                    className="!pl-2"
                  >
                    <option value="">{t('label-select')}</option>
                    <option value="FATHER">{t('FATHER')}</option>
                    <option value="MOTHER">{t('MOTHER')}</option>
                    <option value="TUTOR">{t('TUTOR')}</option>
                  </Input>

                  <Input
                    name="mailTo"
                    control={methods.control}
                    label={t('label-mailTo')}
                    type="select"
                  >
                    <option value="">{t('label-select')}</option>
                    <option value="FATHER">{t('FATHER')}</option>
                    <option value="MOTHER">{t('MOTHER')}</option>
                    <option value="TUTOR">{t('TUTOR')}</option>
                  </Input>
                </div>
              </FormSection>

              {/* Additional Information Section */}
              <FormSection
                title={
                  t('label-additionalInformation') ||
                  'Informations supplémentaires'
                }
                description={
                  t('label-additionalInfoDesc') ||
                  'Ancienne école et ralliement'
                }
                icon={<School size={18} />}
                color="#00cfe8"
              >
                <div className="grid grid-cols-1 gap-1">
                  <LiveView
                    document={OldSchoolCreatedDocument}
                    singleVar="oldSchool"
                    data={dataSchool}
                    loading={loadingSchool}
                    listVar="oldSchools"
                    subscribeToMore={subscribeToMoreSchool}
                    sortField="name"
                    triggerUpdate={true}
                    enterpriseId={enterpriseId}
                  >
                    {({ oldSchools }) => (
                      <ControlledSelect
                        name="oldSchoolId"
                        loading={loadingSchool}
                        control={methods.control}
                        label={t('label-oldSchool')}
                        prepend={<Building size={14} />}
                        onChange={(val) => methods.setValue('oldSchoolId', val)}
                        options={oldSchools || undefined}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        form={<OldSchoolAdd />}
                        formId="oldSchool"
                        optionLabel="name"
                        modalWidth="50%"
                        menuPlacement="auto"
                        formTitle={t('action.add_oldSchool')}
                      />
                    )}
                  </LiveView>

                  <LiveView
                    document={FeeGroupCreatedDocument}
                    singleVar="feeGroup"
                    data={dataFeeGroup}
                    loading={loadingFeeGroup}
                    listVar="feeGroups"
                    subscribeToMore={subscribeToMoreFeeGroup}
                    sortField="name"
                    triggerUpdate={true}
                    enterpriseId={enterpriseId}
                  >
                    {({ feeGroups }) => (
                      <ControlledSelect
                        name="feeGroupId"
                        control={methods.control}
                        label={t('label-feeGroup')}
                        loading={loadingFeeGroup}
                        prepend={<CreditCard size={14} />}
                        onChange={(val) => methods.setValue('feeGroupId', val)}
                        options={feeGroups || undefined}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        form={<FeeGroupAdd />}
                        formId="feeGroup"
                        optionLabel="name"
                        menuPlacement="auto"
                        formTitle={t('action.add_paymentGroup')}
                      />
                    )}
                  </LiveView>
                </div>
              </FormSection>
            </div>

            {/* Social Case Details */}
            {socialCase && (
              <FormSection
                title={t('label-socialCaseDetails') || 'Détails du cas social'}
                description={
                  t('label-socialCaseDesc') || 'Nature et observations'
                }
                icon={<AlertCircle size={18} />}
                color="#ea5455"
                className="md:col-span-2"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  <Input
                    name="scNature"
                    label={t('label-scNature')}
                    control={methods.control}
                    type="textarea"
                    rows={2}
                    prepend={<FileText size={14} />}
                    placeholder={
                      t('label-scNaturePlaceholder') ||
                      'Nature du cas social...'
                    }
                  />
                  <Input
                    name="scObservation"
                    label={t('label-scObservation')}
                    control={methods.control}
                    type="textarea"
                    rows={2}
                    prepend={<Eye size={14} />}
                    placeholder={
                      t('label-scObservationPlaceholder') || 'Observations...'
                    }
                  />
                </div>
              </FormSection>
            )}
          </div>
        </div>

        <StickyActions>
          <ActionButtons
            cancelAction={modal?.hide}
            isSubmitting={props.loading}
            popover={props.popover}
            dirty={methods.formState.isDirty}
            onSubmit={onSubmit}
            fixed={false}
          />
        </StickyActions>
      </Form>
    </FormProvider>
  )
}

export default FrequentUpdateForm
