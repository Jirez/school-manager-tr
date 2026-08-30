import type { FC } from 'react'
import { useEffect } from 'react'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useApolloClient } from '@apollo/client'
import { Form, TabPane } from 'reactstrap'
import {
  User,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  FileText,
  Calendar,
  Hash,
  Type,
  Heart,
  Activity,
} from 'lucide-react'

import type TeacherType from './Teacher.type'
import Input from '@/@core/components/ui/forms/input'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import LiveView from '@/utils/LiveView'
import { useAuthentication } from '@/hooks/useAuthentication'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { TabNav } from '@/@core/components/tabs'
import dayjs from 'dayjs'
import { genderOptions } from '../students/StudentFragmentForm'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { yupResolver } from '@hookform/resolvers/yup'
import { teacherValidationSchema } from './teacher.validation'
import { toast } from 'react-toastify'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import PhoneInput from '@/@core/components/ui/forms/phone-input'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import Switch from '@/@core/components/ui/forms/swith'
import { setOffcanvasSize } from '@/utils/helpers'
import {
  NewCodeDocument,
  SubjectDepartmentCreatedDocument,
  useSubjectDepartmentsQuery,
} from '@/gql/graphql'
import StudentBirthplaceAutocomplete from '@/utils/StudentBirthplaceAutocomplete'
import useActionOnBackNavigation from '@/hooks/useActionOnBackNavigation'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import PictureManager from '@/@core/components/ui/forms/picture-manager'

interface TeacherFormProps extends BaseFormProps {
  teacher?: TeacherType
  modal?: NiceModalHandler
}

const maritalStatusOptions = [
  { label: 'SINGLE', value: 'SINGLE' },
  { label: 'MARRIED', value: 'MARRIED' },
  { label: 'DIVORCED', value: 'DIVORCED' },
  { label: 'WIDOWER', value: 'WIDOWER' },
]

const teacherStatusOptions = [
  { label: 'CIVIL_SERVANT', value: 'CIVIL_SERVANT' },
  { label: 'TEMPORARY_WORKER', value: 'TEMPORARY_WORKER' },
]

const TeacherForm: FC<TeacherFormProps> = ({
  teacher,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const client = useApolloClient()

  const { data, loading, subscribeToMore } = useSubjectDepartmentsQuery({
    variables: { id: enterpriseId },
  })

  const getSelectedGender = (): string | Record<string, any> => {
    if (!teacher) {
      return ''
    }

    return genderOptions
      .filter(({ value }) => value === teacher.gender)
      .map(({ label, value }) => ({ label: t(label), value }))[0]
  }

  const getSelectedMaritalStatus = (): string | Record<string, any> => {
    if (!teacher) {
      return ''
    }

    return maritalStatusOptions
      .filter(({ value }) => value === teacher.maritalStatus)
      .map(({ label, value }) => ({ label: t(label), value }))[0]
  }

  const getSelectedTeacherStatus = (): string | Record<string, any> => {
    if (!teacher) {
      return ''
    }

    return teacherStatusOptions
      .filter(({ value }) => value === teacher.status)
      .map(({ label, value }) => ({ label: t(label), value }))[0]
  }

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    getValues,
    setValue,
    // reset,
    watch,
  } = useForm<TeacherType>({
    defaultValues: {
      lastName: teacher?.lastName || '',
      firstName: teacher?.firstName || '',
      birthplace: teacher?.birthplace || '',
      code: teacher?.code || '',
      cniNumber: teacher?.cniNumber || '',
      gender: teacher ? getSelectedGender() : '',
      active: teacher ? teacher.active : true,
      maritalStatus: teacher ? getSelectedMaritalStatus() : '',
      status: teacher ? getSelectedTeacherStatus() : '',
      birthDate:
        teacher && teacher.birthDate ? dayjs(teacher.birthDate).toDate() : null,
      subjectDepartmentIds: teacher
        ? teacher.subjectDepartmentCollection
        : null,
      schoolServiceDate:
        teacher && teacher.schoolServiceDate
          ? dayjs(teacher.schoolServiceDate).toDate()
          : null,
      administrationEntryDate:
        teacher && teacher.administrationEntryDate
          ? dayjs(teacher.administrationEntryDate).toDate()
          : null,
      firstServiceDate:
        teacher && teacher.firstServiceDate
          ? dayjs(teacher.firstServiceDate).toDate()
          : null,
      academicYear: teacher?.academicYear || undefined,
      professionalYear: teacher?.professionalYear || undefined,
      origin: {
        countryOrigin: teacher?.origin?.countryOrigin || '',
        regionOrigin: teacher?.origin?.regionOrigin || '',
        departmentOrigin: teacher?.origin?.departmentOrigin || '',
        districtOrigin: teacher?.origin?.districtOrigin || '',
      },
      address: {
        zipCode: teacher?.address?.zipCode || '',
        country: teacher?.address?.country || '',
        town: teacher?.address?.town || '',
        state: teacher?.address?.state || '',
        street: teacher?.address?.street || '',
      },
      contactInfo: {
        fax: teacher?.contactInfo?.fax || '',
        email: teacher?.contactInfo?.email || '',
        mobile: teacher?.contactInfo?.mobile || '',
        telephone: teacher?.contactInfo?.telephone || '',
        postOfficeBox: teacher?.contactInfo?.postOfficeBox || '',
      },
      fatherName: teacher?.fatherName || '',
      motherName: teacher?.motherName || '',
      fatherProfession: teacher?.fatherProfession || '',
      motherProfession: teacher?.motherProfession || '',
      spouseProfession: teacher?.spouseProfession || '',
      childrenCount: teacher?.childrenCount || '',
      religion: teacher?.religion || '',
      bloodGroup: teacher?.bloodGroup || '',
      ethnicGroup: teacher?.ethnicGroup || '',
      rhesus: teacher?.rhesus || '',
      registrationNumber: teacher?.registrationNumber || '',
      dueHours: teacher?.dueHours || '',
      grading: teacher?.grading || '',
      speciality: teacher?.speciality || '',
      currentPost: teacher?.currentPost || '',
      clazz: teacher?.clazz || '',
      function: teacher?.function || '',
      category: teacher?.category || '',
      numberAssignment: teacher?.numberAssignment || '',
      academicPlace: teacher?.academicPlace || '',
      firstServicePlace: teacher?.firstServicePlace || '',
      rank: teacher?.rank || '',
      academicDiploma: teacher?.academicDiploma || '',
      professionalDiploma: teacher?.professionalDiploma || '',
      professionalPlace: teacher?.professionalPlace || '',
      currentPicture: teacher?.currentPicture || '',
    },
    resolver: yupResolver(teacherValidationSchema),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = teacher ? Number(teacher.id) : undefined

      const subjectDepartments = values.subjectDepartmentIds
        ? values.subjectDepartmentIds.map((val: any) => Number(val.id))
        : []
      action({
        variables: {
          teacher: {
            ...values,
            id,
            gender: values.gender.value,
            maritalStatus: values.maritalStatus?.value,
            status: values.status?.value,
            birthDate: values.birthDate
              ? dayjs(values.birthDate).format(INPUT_DATE_FORMAT)
              : null,
            professionalYear: values.professionalYear
              ? String(values.professionalYear)
              : null,
            academicYear: values.academicYear
              ? String(values.academicYear)
              : null,
            firstServiceDate: values.firstServiceDate
              ? dayjs(values.firstServiceDate).format(INPUT_DATE_FORMAT)
              : null,
            schoolServiceDate: values.schoolServiceDate
              ? dayjs(values.schoolServiceDate).format(INPUT_DATE_FORMAT)
              : null,
            administrationEntryDate: values.administrationEntryDate
              ? dayjs(values.administrationEntryDate).format(INPUT_DATE_FORMAT)
              : null,
            schoolId: enterpriseId,
            enterpriseId: enterpriseId,
            subjectDepartmentIds: subjectDepartments,
          },
        },
      })
        .then(async ({ data }) => {
          toast.success(`Enseignant ${data.personnel.lastName} enregistré`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('teacher', data.teacher)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter l'enseignant: ${formatError(error)}`,
          )
        })
    })(event)
  }

  const populateRegistrationNumber = async () => {
    const number = getValues('code')

    if (number !== undefined && number !== '') {
      return false
    }

    const id = enterpriseId

    const { data } = await client.query({
      query: NewCodeDocument,
      variables: { id },
      fetchPolicy: 'network-only',
    })

    if (data) {
      setValue('code', data.newCode)
    }
  }

  useEffect(() => {
    populateRegistrationNumber()
    setOffcanvasSize('60%')
  }, [])

  const isBackNavigation = useActionOnBackNavigation('/personnel')

  useEffect(() => {
    if (isBackNavigation) {
      modal?.hide()
    }
  }, [isBackNavigation])

  return (
    <Form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row w-full gap-x-1">
        <div className="w-full md:w-9/12">
          {/* Basic Information Section */}
          <FormSection
            icon={<User className="w-5 h-5" />}
            title="Informations de base"
            description="Données personnelles de l'enseignant"
            color="#7367f0"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              <Input
                name="code"
                label={t('label-code')}
                control={control}
                required
                prepend={<Hash size={16} />}
              />

              <div className="flex items-center h-full pt-6">
                <Switch
                  name="active"
                  label={t('label-active')}
                  control={control}
                  defaultChecked={getValues('active')}
                />
              </div>

              <ControlledSelect
                name="gender"
                control={control}
                label={t('label-gender')}
                required
                onChange={(value) => setValue('gender', value)}
                options={genderOptions.map(({ label, value }) => ({
                  label: t(label),
                  value,
                }))}
                prepend={<User size={16} />}
              />

              <Input
                name="lastName"
                label={t('label-lastName')}
                control={control}
                required
                prepend={<Type size={16} />}
              />

              <Input
                name="firstName"
                label={t('label-firstName')}
                control={control}
                prepend={<Type size={16} />}
              />

              <Input
                name="cniNumber"
                label={t('label-cniNumber')}
                control={control}
                prepend={<FileText size={16} />}
              />

              <DatePicker
                name="birthDate"
                label={t('label-birthDate')}
                control={control}
                placeholder={t('label-selectDate')}
              />

              <div className="md:col-span-1">
                <StudentBirthplaceAutocomplete
                  onFill={(value: string) => {
                    setValue('birthplace', value)
                  }}
                  canRefetch={false}
                  label={t('label-birthplace')}
                  required={false}
                  id="birthplaceF"
                  value={getValues('birthplace')}
                />
              </div>
            </div>
          </FormSection>
        </div>

        <div className="w-full md:w-3/12 flex flex-col gap-1">
          <PictureManager
            picture={watch('currentPicture')}
            onPictureChange={(val) => setValue('currentPicture', val)}
          />
        </div>
      </div>

      {/* Subject Departments Section */}
      <FormSection
        icon={<Briefcase className="w-5 h-5" />}
        title="Départements de matières"
        description="Spécialités enseignées"
        color="#28c76f"
      >
        <LiveView
          document={SubjectDepartmentCreatedDocument}
          singleVar="subjectDepartment"
          data={data}
          loading={loading}
          listVar="subjectDepartments"
          subscribeToMore={subscribeToMore}
          sortField="name"
          triggerUpdate={true}
          enterpriseId={enterpriseId}
        >
          {({ subjectDepartments }) => (
            <ControlledSelect
              name="subjectDepartmentIds"
              control={control}
              label={t('label-subjectDepartments')}
              loading={loading}
              onChange={(val) => setValue('subjectDepartmentIds', val)}
              options={subjectDepartments || undefined}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              formId="subjectDepartment"
              optionLabel="name"
              isMulti
              prepend={<Briefcase size={16} />}
            />
          )}
        </LiveView>
      </FormSection>

      {/* Tabs */}
      <div className="mt-2">
        <TabNav
          items={[
            { id: '1', label: 'label-otherInfos' },
            { id: '2', label: 'label-proInfos' },
            { id: '3', label: 'label-address' },
            { id: '4', label: 'label-contact' },
          ]}
        >
          {/* Others infos */}
          <TabPane tabId="1">
            <FormSection
              icon={<User className="w-5 h-5" />}
              title="Origine"
              description="Lieu de naissance et origine"
              color="#ff9f43"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                <Input
                  name="origin.countryOrigin"
                  control={control}
                  label={t('label-countryOrigin')}
                  prepend={<MapPin size={16} />}
                />
                <Input
                  name="origin.regionOrigin"
                  control={control}
                  label={t('label-regionOrigin')}
                  prepend={<MapPin size={16} />}
                />
                <Input
                  name="origin.departmentOrigin"
                  control={control}
                  label={t('label-departmentOrigin')}
                  prepend={<MapPin size={16} />}
                />
                <Input
                  name="origin.districtOrigin"
                  control={control}
                  label={t('label-districtOrigin')}
                  prepend={<MapPin size={16} />}
                />
              </div>
            </FormSection>

            <FormSection
              icon={<Heart className="w-5 h-5" />}
              title="Informations familiales"
              description="Famille et état civil"
              color="#ea5455"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                <Input
                  name="fatherName"
                  label={t('label-fatherName')}
                  control={control}
                  prepend={<User size={16} />}
                />
                <Input
                  name="fatherProfession"
                  label={t('label-fatherProfession')}
                  control={control}
                  prepend={<Briefcase size={16} />}
                />
                <Input
                  name="motherName"
                  label={t('label-motherName')}
                  control={control}
                  prepend={<User size={16} />}
                />
                <Input
                  name="motherProfession"
                  label={t('label-motherProfession')}
                  control={control}
                  prepend={<Briefcase size={16} />}
                />
                <ControlledSelect
                  name="maritalStatus"
                  control={control}
                  label={t('label-maritalStatus')}
                  onChange={(value) => setValue('maritalStatus', value)}
                  options={maritalStatusOptions.map(({ label, value }) => ({
                    label: t(label),
                    value,
                  }))}
                  prepend={<Heart size={16} />}
                />
                <Input
                  name="spouseProfession"
                  label={t('label-spouseProfession')}
                  control={control}
                  prepend={<Briefcase size={16} />}
                />
                <Input
                  name="childrenCount"
                  label={t('label-childrenCount')}
                  control={control}
                  prepend={<Hash size={16} />}
                />
              </div>
            </FormSection>

            <FormSection
              icon={<Activity className="w-5 h-5" />}
              title="Autres détails"
              description="Santé et origine"
              color="#00cfe8"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                <Input
                  name="religion"
                  label={t('label-religion')}
                  control={control}
                  prepend={<Heart size={16} />}
                />
                <Input
                  name="ethnicGroup"
                  label={t('label-ethnicGroup')}
                  control={control}
                  prepend={<User size={16} />}
                />
                <Input
                  name="bloodGroup"
                  label={t('label-bloodGroup')}
                  control={control}
                  prepend={<Activity size={16} />}
                />
                <Input
                  name="rhesus"
                  label={t('label-rhesus')}
                  control={control}
                  prepend={<Activity size={16} />}
                />
              </div>
            </FormSection>
          </TabPane>

          {/* Professional infos */}
          <TabPane tabId="2">
            <FormSection
              icon={<Briefcase className="w-5 h-5" />}
              title="Informations professionnelles"
              description="Statut et poste actuel"
              color="#2f8724"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                <Input
                  name="registrationNumber"
                  label={t('label-registrationNumber')}
                  control={control}
                  prepend={<Hash size={16} />}
                />
                <ControlledSelect
                  name="status"
                  control={control}
                  label={t('label-status')}
                  onChange={(value) => setValue('status', value)}
                  options={teacherStatusOptions.map(({ label, value }) => ({
                    label: t(label),
                    value,
                  }))}
                  prepend={<Briefcase size={16} />}
                />
                <Input
                  name="rank"
                  label={t('label-rank')}
                  control={control}
                  prepend={<Briefcase size={16} />}
                />
                <Input
                  name="function"
                  label={t('label-function')}
                  control={control}
                  prepend={<Briefcase size={16} />}
                />
                <Input
                  name="dueHours"
                  label={t('label-dueHours')}
                  control={control}
                  prepend={<Hash size={16} />}
                />
                <Input
                  name="grading"
                  label={t('label-grading')}
                  control={control}
                  prepend={<Briefcase size={16} />}
                />
                <Input
                  name="clazz"
                  label={t('label-clazz')}
                  control={control}
                  prepend={<Briefcase size={16} />}
                />
                <Input
                  name="category"
                  label={t('label-category')}
                  control={control}
                  prepend={<Briefcase size={16} />}
                />
                <Input
                  name="speciality"
                  label={t('label-speciality')}
                  control={control}
                  prepend={<Briefcase size={16} />}
                />
                <Input
                  name="currentPost"
                  label={t('label-currentPost')}
                  control={control}
                  prepend={<Briefcase size={16} />}
                />
                <DatePicker
                  name="schoolServiceDate"
                  label={t('label-schoolServiceDate')}
                  control={control}
                  placeholder={t('label-selectDate')}
                />
                <Input
                  name="numberAssignment"
                  label={t('label-numberAssignment')}
                  control={control}
                  prepend={<Hash size={16} />}
                />
              </div>
            </FormSection>

            <FormSection
              icon={<Calendar className="w-5 h-5" />}
              title="Dates et lieux"
              description="Historique professionnel"
              color="#28c76f"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                <DatePicker
                  name="administrationEntryDate"
                  label={t('label-administrationEntryDate')}
                  control={control}
                  placeholder={t('label-selectDate')}
                />
                <DatePicker
                  name="firstServiceDate"
                  label={t('label-firstServiceDate')}
                  control={control}
                  placeholder={t('label-selectDate')}
                />
                <Input
                  name="firstServicePlace"
                  label={t('label-firstServicePlace')}
                  control={control}
                  prepend={<MapPin size={16} />}
                />
                <Input
                  name="academicDiploma"
                  label={t('label-academicDiploma')}
                  control={control}
                  prepend={<FileText size={16} />}
                />
                <Input
                  name="academicYear"
                  label={t('label-academicYear')}
                  control={control}
                  prepend={<Calendar size={16} />}
                />
                <Input
                  name="academicPlace"
                  label={t('label-academicPlace')}
                  control={control}
                  prepend={<MapPin size={16} />}
                />
                <Input
                  name="professionalDiploma"
                  label={t('label-professionalDiploma')}
                  control={control}
                  prepend={<FileText size={16} />}
                />
                <Input
                  name="professionalYear"
                  label={t('label-professionalYear')}
                  control={control}
                  prepend={<Calendar size={16} />}
                />
                <Input
                  name="professionalPlace"
                  label={t('label-professionalPlace')}
                  control={control}
                  prepend={<MapPin size={16} />}
                />
              </div>
            </FormSection>
          </TabPane>

          {/* Address */}
          <TabPane tabId="3">
            <FormSection
              icon={<MapPin className="w-5 h-5" />}
              title="Adresse"
              description="Localisation"
              color="#ff9f43"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <Input
                  name="address.zipCode"
                  label={t('label-zipCode')}
                  control={control}
                  prepend={<Hash size={16} />}
                />
                <Input
                  name="address.country"
                  label={t('label-country')}
                  control={control}
                  prepend={<MapPin size={16} />}
                />
                <Input
                  name="address.town"
                  label={t('label-town')}
                  control={control}
                  prepend={<MapPin size={16} />}
                />
                <Input
                  name="address.state"
                  label={t('label-state')}
                  control={control}
                  prepend={<MapPin size={16} />}
                />
                <div className="md:col-span-2">
                  <Input
                    name="address.street"
                    label={t('label-street')}
                    control={control}
                    prepend={<MapPin size={16} />}
                  />
                </div>
              </div>
            </FormSection>
          </TabPane>

          {/* Contact */}
          <TabPane tabId="4">
            <FormSection
              icon={<Phone className="w-5 h-5" />}
              title="Contact"
              description="Coordonnées"
              color="#2f8724"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <PhoneInput
                  name="contactInfo.telephone"
                  label={t('label-telephone')}
                  control={control}
                />
                <PhoneInput
                  name="contactInfo.mobile"
                  label={t('label-mobileTelephone')}
                  control={control}
                />
                <Input
                  name="contactInfo.email"
                  label={t('label-email')}
                  control={control}
                  prepend={<Mail size={16} />}
                />
                <Input
                  name="contactInfo.fax"
                  label={t('label-fax')}
                  control={control}
                  prepend={<Phone size={16} />}
                />
                <div className="md:col-span-2">
                  <Input
                    name="contactInfo.postOfficeBox"
                    label={t('label-postOfficeBox')}
                    control={control}
                    prepend={<FileText size={16} />}
                  />
                </div>
              </div>
            </FormSection>
          </TabPane>
        </TabNav>
      </div>

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

export default TeacherForm
