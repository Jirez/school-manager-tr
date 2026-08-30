import type { FC } from 'react'
import { useEffect } from 'react'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useModal } from '@ebay/nice-modal-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form } from 'reactstrap'
import { toast } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup'
import { useResponsive } from 'ahooks'
import {
  GraduationCap,
  UserCheck,
  AlertCircle,
  MessageSquare,
  School,
  User,
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
import type { FrequentType } from './Frequent.type'
import { useAuthentication } from '@/hooks/useAuthentication'
import { messageService } from '@/utils/message.service'
import Input from '@/@core/components/ui/forms/input'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { classOptions } from '@/utils/select/selectComponents'
import ClassAdd from '../classes/ClassAdd'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { frequentValidation } from './frequent.validation'
import StudentTableModal from '../students/StudentTableModal'
import { concat, setOffcanvasSize } from '@/utils/helpers'
import { formatError } from '@/utils/ErrorHelper'
import StudentAddModal from '../students/StudentAddModal'
import OldSchoolAdd from '../oldSchools/OldSchoolAdd'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  ClassCreatedDocument,
  FeeGroupCreatedDocument,
  OldSchoolCreatedDocument,
  useClassesQuery,
  useFeeGroupsQuery,
  useOldSchoolsQuery,
  useUnregisteredStudentsQuery,
} from '@/gql/graphql'
import FeeGroupAdd from '@/views/sale/group/FeeGroupAdd'
import useActionOnBackNavigation from '@/hooks/useActionOnBackNavigation'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import Switch from '@/@core/components/ui/forms/swith'

interface FrequentFormProps extends BaseFormProps {
  frequent?: FrequentType
  modal?: NiceModalHandler
}

const FrequentForm: FC<FrequentFormProps> = ({
  frequent,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const tableModal = useModal(StudentTableModal)
  const formModal = useModal(StudentAddModal)
  const responsive = useResponsive()

  const { data } = useUnregisteredStudentsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'no-cache',
  })

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

  /* const {
    data: dataPaymentGroup,
    loading: loadingPaymentGroup,
    subscribeToMore: subscribeToMorePaymentGroup,
  } = usePaymentGroupsQuery({
    variables: { id: enterpriseId },
  }); */

  const {
    data: dataFeeGroup,
    loading: loadingFeeGroup,
    subscribeToMore: subscribeToMoreFeeGroup,
  } = useFeeGroupsQuery({
    variables: { id: enterpriseId },
  })

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isDirty },
    reset,
    watch,
  } = useForm<FrequentType>({
    defaultValues: {
      student: '',
      studentId: '',
      classId: '',
      repeater: false,
      apt: true,
      external: true,
      formerStudent: true,
      oldSchoolId: null,
      paymentGroupId: null,
      socialCase: false,
      scNature: undefined,
      scObservation: undefined,
    },
    resolver: yupResolver(frequentValidation),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      action({
        variables: {
          frequent: {
            frequentPK: {
              studentId: Number(values.studentId),
              classId: Number(values.classId.id),
            },
            numberOrder: values.numberOrder,
            repeater: values.repeater,
            mailTo: values.mailTo,
            smsTo: values.smsTo,
            apt: values.apt,
            external: values.external,
            formerStudent: values.formerStudent,
            oldSchoolId: values.oldSchoolId
              ? Number(values.oldSchoolId.id)
              : null,
            paymentGroupId: values.paymentGroupId
              ? Number(values.paymentGroupId.id)
              : null,
            feeGroupId: values.feeGroupId ? Number(values.feeGroupId.id) : null,
            schoolId: enterpriseId,
            socialCase: values.socialCase,
            scNature: values.scNature ? values.scNature : null,
            scObservation: values.scObservation ? values.scObservation : null,
          },
        },
      })
        .then(async ({ data }) => {
          /* form.resetFields();
                    form.setFieldsValue({studentId: null});
                    form.setFieldsValue({classId: null}); */
          reset()
          toast.success(`Incription effectuée`, { ...TOAST_OPTIONS })
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
            `Impossible d'effectuer l'inscription: ${t(formatError(error))}`,
          )
        })
    })(event)
  }

  const onRowClicked = (data: any) => {
    setValue('student', concat(data.lastName, data.firstName))
    setValue('studentId', data.id)
    // closing the modal
    tableModal.hide()
  }

  const onAddButtonClick = (searchText?: string) => {
    tableModal.hide()
    formModal.show({ student: { lastName: searchText, birthDate: null } })
  }

  const onStudentClick = () => {
    const unregisteredStudentsCount = data?.students?.length ?? 0
    if (unregisteredStudentsCount > 0) {
      tableModal.show({
        students: data?.students,
        onRowClicked,
        onAddButtonClick,
      })
    } else {
      formModal.show({})
    }
  }

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'student') {
          if (message.value) {
            setValue('studentId', message.value.id)
            setValue(
              'student',
              concat(message.value.lastName, message.value.firstName),
            )
            //setDataModal(false);
            formModal.hide()
          }
        }

        if (message.name === 'oldSchool') {
          setValue('oldSchoolId', message.value)
        }

        if (message.name === 'paymentGroup') {
          setValue('paymentGroupId', message.value)
        }
      }
    })
  }, [messageService])

  useEffect(() => {
    // set drawer size
    //setOffcanvasSize(size && size.width <= 400 ? '100%' : '50%')
    if (responsive['md']) {
      setOffcanvasSize('50%')
    } else {
      setOffcanvasSize('100%')
    }
  }, [])

  const isBackNavigation = useActionOnBackNavigation('/frequents')

  useEffect(() => {
    if (isBackNavigation) {
      modal?.hide()
    }
  }, [isBackNavigation])

  const socialCase = watch('socialCase')

  return (
    <Form onSubmit={onSubmit}>
      <div className="pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {/* Student Information Section */}
          <FormSection
            title={t('label-studentInformation') || "Informations de l'élève"}
            description={
              t('label-studentInfoDesc') || 'Identification et classe'
            }
            icon={<GraduationCap size={18} />}
            color="#7367f0"
            className="md:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              <div className="md:col-span-1">
                <Input
                  name="studentId"
                  control={control}
                  readOnly
                  className="hidden"
                />
                <Input
                  name="student"
                  control={control}
                  label={t('label-student')}
                  required
                  onClick={onStudentClick}
                  prepend={<User size={14} />}
                  autoFocus
                  placeholder={t('label-choose-student') || 'Choisir un élève'}
                />
              </div>

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
                    control={control}
                    label={t('label-class')}
                    required
                    loading={loadingClass}
                    prepend={<Layers size={14} />}
                    onChange={(val) => setValue('classId', val)}
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
                control={control}
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
                isActive={watch('repeater')}
              >
                <Switch
                  name="repeater"
                  control={control}
                  label=""
                  defaultChecked={getValues('repeater')}
                />
              </ToggleOption>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                <ToggleOption
                  title={t('label-formerStudent')}
                  description={t('label-formerStudentDesc') || 'Ancien élève'}
                  icon={<UserCheck size={18} />}
                  isActive={watch('formerStudent')}
                >
                  <Switch
                    name="formerStudent"
                    control={control}
                    label=""
                    defaultChecked={getValues('formerStudent')}
                  />
                </ToggleOption>
                <ToggleOption
                  title={t('label-external')}
                  description={t('label-externalDesc') || 'Élève externe'}
                  icon={<UserMinus size={18} />}
                  isActive={watch('external')}
                >
                  <Switch
                    name="external"
                    control={control}
                    label=""
                    defaultChecked={getValues('external')}
                  />
                </ToggleOption>
                <ToggleOption
                  title={t('label-apt')}
                  description={t('label-aptDesc') || 'Aptitude physique'}
                  icon={<CheckCircle2 size={18} />}
                  isActive={watch('apt')}
                >
                  <Switch
                    name="apt"
                    control={control}
                    label=""
                    defaultChecked={getValues('apt')}
                  />
                </ToggleOption>
                <ToggleOption
                  title={t('label-socialCase')}
                  description={t('label-socialCaseDesc') || 'Élève cas social'}
                  icon={<AlertCircle size={18} />}
                  isActive={watch('socialCase')}
                >
                  <Switch
                    name="socialCase"
                    control={control}
                    label=""
                    defaultChecked={getValues('socialCase')}
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
                  control={control}
                  label={t('label-smsTo')}
                  type="select"
                  //prepend={<Smartphone size={14} />}
                  className="!pl-2"
                >
                  <option value="">{t('label-select')}</option>
                  <option value="FATHER">{t('FATHER')}</option>
                  <option value="MOTHER">{t('MOTHER')}</option>
                  <option value="TUTOR">{t('TUTOR')}</option>
                </Input>

                <Input
                  name="mailTo"
                  control={control}
                  label={t('label-mailTo')}
                  type="select"
                  //prepend={<Mail size={14} />}
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
                'Informations complémentaires'
              }
              description={
                t('label-additionalInfoDesc') || 'Ancienne école et ralliement'
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
                      control={control}
                      label={t('label-oldSchool')}
                      prepend={<Building size={14} />}
                      onChange={(val) => setValue('oldSchoolId', val)}
                      options={oldSchools || undefined}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                      form={<OldSchoolAdd />}
                      formId="oldSchool"
                      optionLabel="name"
                      modalWidth="50%"
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
                      control={control}
                      label={t('label-feeGroup')}
                      loading={loadingFeeGroup}
                      prepend={<CreditCard size={14} />}
                      onChange={(val) => setValue('feeGroupId', val)}
                      options={feeGroups || undefined}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                      form={<FeeGroupAdd />}
                      formId="feeGroup"
                      optionLabel="name"
                      formTitle={t('action.add_feeGroup')}
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
                  control={control}
                  type="textarea"
                  rows={2}
                  prepend={<FileText size={14} />}
                  placeholder={
                    t('label-scNaturePlaceholder') || 'Nature du cas social...'
                  }
                />
                <Input
                  name="scObservation"
                  label={t('label-scObservation')}
                  control={control}
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
          dirty={isDirty}
          onSubmit={onSubmit}
          fixed={false}
        />
      </StickyActions>
    </Form>
  )
}

export default FrequentForm
