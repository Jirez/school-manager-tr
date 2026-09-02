import { useEffect, Fragment } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useFieldArray, useFormContext } from 'react-hook-form'
import type {
  StudentGuardian,
  StudentType,
} from '@/views/school/students/Student.type'
import { relationOptions } from '@/views/school/students/Student.type'
import Input from '@/@core/components/ui/forms/input'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import Switch from '@/@core/components/ui/forms/swith'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import { useAuthentication } from '@/hooks/useAuthentication'
import { TabNav } from '@/@core/components/tabs'
import {
  InputGroup,
  InputGroupText,
  TabPane,
  // Input as BaseInput,
} from 'reactstrap'
import PhoneInput from '@/@core/components/ui/forms/phone-input'
import SimpleInput from '@/@core/components/ui/simple-input'
import { useStudentGuardian } from './useStudentGuardian'
import { concat } from '@/utils/helpers'
import { useModal } from '@ebay/nice-modal-react'
import GuardianTableModal from '../guardians/GuardianTableModal'
import {
  Plus,
  X,
  Pencil,
  MapPin,
  User,
  Heart,
  Activity,
  Calendar,
  Phone,
  Mail,
  Home,
  Users,
  Hash,
  Info,
  Globe,
  Flag,
  Navigation,
  Droplet,
  Tag,
  Stethoscope,
  ClipboardList,
  Printer,
} from 'lucide-react'
import GuardianModal from '../guardians/GuardianModal'
import { messageService } from '@/utils/message.service'
import dayjs from 'dayjs'
import { useStudentPicture } from './useStudentPicture'
import PictureManager from '@/@core/components/ui/forms/picture-manager'
import { useGuardiansQuery } from '@/gql/graphql'
import StudentBirthplaceAutocomplete from '@/utils/StudentBirthplaceAutocomplete'
import StudentReligionAutocomplete from '@/utils/StudentReligionAutocomplete'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import { styled } from 'styled-components'
import { FieldGrid, FieldGroup } from '../configuration/config-form-helper'

interface StudentFragmentFormProps {
  student?: StudentType | any
}

export const genderOptions = [
  { label: 'label-male', value: 'MALE' },
  { label: 'label-female', value: 'FEMALE' },
]

// const config = await fetch('/configuration.json').then((res) => res.json())

const StyledInputGroup = styled(InputGroup)`
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  width: 100%;

  .input-group-text {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    min-width: 2.5rem;
    background-color: #f8f9fa;
    border: 1px solid #d0d7de;
    border-left: none;
    transition: all 0.2s ease;
    flex-shrink: 0;

    .dark-layout & {
      background-color: #283046;
      border-color: rgba(115, 103, 240, 0.3);
    }

    &:first-of-type {
      border-left: 1px solid #d0d7de;
      border-radius: 8px 0 0 8px;

      .dark-layout & {
        border-color: rgba(115, 103, 240, 0.3);
      }
    }

    &:last-of-type {
      border-radius: 0 8px 8px 0;
    }

    &:hover {
      background-color: #e9ecef;

      .dark-layout & {
        background-color: rgba(115, 103, 240, 0.1);
      }
    }
  }
`

const GuardianInputWrapper = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  position: relative;
  display: flex;
  align-items: stretch;

  > div {
    margin-bottom: 0 !important;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  > div > div:last-child {
    flex: 1;
    display: flex;
    align-items: stretch;
  }

  input {
    border-radius: 0 !important;
    border-right: none !important;
    flex: 1;

    &:focus {
      border-right: none !important;
      z-index: 1;
    }
  }
`

const StudentFragmentForm: FC<StudentFragmentFormProps> = ({
  student,
  // control,
}) => {
  const { t } = useTranslation()
  // const client = useApolloClient()
  const { enterpriseId } = useAuthentication()

  const tableModal = useModal(GuardianTableModal)
  const formModal = useModal(GuardianModal)

  const {
    data,
    loading,
    subscribeToMore,
    refetch: refetchGuardians,
  } = useGuardiansQuery({
    variables: { id: enterpriseId },
  })

  const { studentGuardians } = useStudentGuardian(student ? student.id! : null)
  const { picture } = useStudentPicture(student ? student.id : null)

  // Hook form
  const {
    control,
    setValue,
    getValues,
    register,
    watch,
    formState: { errors },
  } = useFormContext<StudentType>()
  const { fields, append } = useFieldArray({ control, name: 'items' })

  const getSelectedGender = (): string | Record<string, any> => {
    if (!student) {
      return ''
    }

    return genderOptions
      .filter(({ value }) => value === student.gender)
      .map(({ label, value }) => ({ label: t(label), value }))[0]
  }

  const getStudentGuardian = (rel: string): StudentGuardian => {
    return studentGuardians.filter(({ relation }) => relation === rel)?.[0]
  }

  const initStudentGuardians = () => {
    const guardians: StudentGuardian[] = []
    const father = getStudentGuardian('FATHER')
    if (father) {
      const name = concat(
        father.guardian?.lastName ?? '',
        father.guardian?.firstName || '',
      )
      guardians.push({
        ...father,
        guardian: {
          ...father.guardian!,
          displayName: father.guardian?.profession
            ? name + ' [' + father.guardian.profession + '] '
            : name,
        },
      })
    } else {
      guardians.push({
        studentGuardianPK: {
          studentId: student?.id,
          guardianId: '',
        },
        relation: 'FATHER',
      })
    }

    // adding mother
    const mother = getStudentGuardian('MOTHER')
    if (mother) {
      // guardians.push(mother)
      const name = concat(
        mother.guardian?.lastName!,
        mother.guardian?.firstName || '',
      )
      guardians.push({
        ...mother,
        guardian: {
          ...mother.guardian!,
          displayName: mother.guardian?.profession
            ? name + ' [' + mother.guardian.profession + '] '
            : name,
        },
      })
    } else {
      guardians.push({
        studentGuardianPK: {
          studentId: student?.id,
          guardianId: '',
        },
        relation: 'MOTHER',
      })
    }

    const tutor = studentGuardians.filter(
      ({ relation }) => relation !== 'FATHER' && relation !== 'MOTHER',
    )?.[0]

    if (tutor) {
      // guardians.push({...tutor, relation: {label: tutor.relation as string, value: tutor.relation as string}})
      const name = concat(
        tutor.guardian?.lastName!,
        tutor.guardian?.firstName || '',
      )
      guardians.push({
        ...tutor,
        guardian: {
          ...tutor.guardian!,
          displayName: tutor.guardian?.profession
            ? name + ' [' + tutor.guardian.profession + '] '
            : name,
        },
        relation: {
          label: t(tutor.relation as string),
          value: tutor.relation as string,
        },
      })
    } else {
      guardians.push({
        studentGuardianPK: {
          studentId: student?.id,
          guardianId: '',
        },
        relation: { label: t('TUTOR'), value: 'TUTOR' },
      })
    }

    append(guardians)
  }

  useEffect(() => {
    setValue('items', [])
    initStudentGuardians()
  }, [studentGuardians])

  /* useEffect(() => {
        populateRegistrationNumber()
            .catch(error => console.log(error))
    }, []); */

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      // console.log(message?.value);
      formModal.hide()

      if (message) {
        if (message.name === 'guardian') {
          // setFather(message.value);
          const currentIndex = (message.value.currentIndex as number) || 0
          // console.log(message.value.currentIndex)
          setValue(
            `items.${currentIndex}.studentGuardianPK.guardianId`,
            message.value.id,
          )
          setValue(
            `items.${currentIndex}.guardian.displayName`,
            concat(message.value.lastName, message.value.firstName),
          )

          // refetch query
          refetchGuardians()
        }
      }
    })
  }, [messageService])

  useEffect(() => {
    setValue('lastName', student?.lastName || '')
    setValue('registrationNumber', student?.registrationNumber || '')
    setValue('lastName', student?.lastName || '')
    setValue('firstName', student?.firstName || '')
    setValue('birthDate', student ? dayjs(student.birthDate).toDate() : '')
    setValue('birthplace', student?.birthplace || '')
    setValue('presumeBirthDate', student?.presumeBirthDate ?? false)
    setValue('gender', student ? getSelectedGender() : '')
    setValue('religion', student?.religion || '')
    setValue('bloodGroup', student?.bloodGroup || '')
    setValue('knownHealthProblem', student?.knownHealthProblem || '')
    setValue('otherUsefulInfo', student?.otherUsefulInfo || '')
    setValue('ethnicGroup', student?.ethnicGroup || '')
    setValue('rhesus', student?.rhesus || '')
    setValue('origin.countryOrigin', student?.origin?.countryOrigin || '')
    setValue('origin.regionOrigin', student?.origin?.regionOrigin || '')
    setValue('origin.departmentOrigin', student?.origin?.departmentOrigin || '')
    setValue('origin.districtOrigin', student?.origin?.districtOrigin || '')

    setValue('address.zipCode', student?.address?.zipCode || '')
    setValue('address.country', student?.address?.country || '')
    setValue('address.town', student?.address?.town || '')
    setValue('address.state', student?.address?.state || '')
    setValue('address.street', student?.address?.street || '')

    setValue('contactInfo.fax', student?.contactInfo?.fax || '')
    setValue('contactInfo.email', student?.contactInfo?.email || '')
    setValue('contactInfo.mobile', student?.contactInfo?.mobile || '')
    setValue('contactInfo.telephone', student?.contactInfo?.telephone || '')
    setValue(
      'contactInfo.postOfficeBox',
      student?.contactInfo?.postOfficeBox || '',
    )
  }, [student])

  useEffect(() => {
    setValue('picture', picture)
  }, [picture, setValue])

  const onSelectionChanged = (selectedRow: any, selectedIndex: number) => {
    setValue(
      `items.${selectedIndex}.studentGuardianPK.guardianId`,
      selectedRow.id,
    )
    setValue(
      `items.${selectedIndex}.guardian.displayName`,
      concat(selectedRow.lastName, selectedRow.firstName),
    )

    tableModal.hide()
  }

  const onGuardianClick = async (selectedIndex: number) => {
    const relation = getValues(`items.${selectedIndex}.relation`)
    let gender = null
    if (relation === 'FATHER') {
      gender = 'MALE'
    } else if (relation === 'MOTHER') {
      gender = 'FEMALE'
    }
    tableModal.show({
      guardians: !!gender
        ? data?.guardians?.filter((g) => g.gender === gender) || []
        : data?.guardians || [],
      onRowClicked: (data: any) => onSelectionChanged(data, selectedIndex),
      onAddButtonClick: (searchText?: string) => {
        formModal.show({
          popover: true,
          currentIndex: selectedIndex,
          guardian: { gender, lastName: searchText },
        })
        tableModal.hide()
      },
    })
  }

  const onGuardianDelete = async (index: number) => {
    setValue(`items.${index}.studentGuardianPK.guardianId`, null)
    setValue(`items.${index}.guardian.displayName`, '')
  }

  const onGuardianUpdate = async (index: number) => {
    // setValue(`items.${index}.studentGuardianPK.guardianId`, null);
    formModal.show({
      popover: true,
      currentIndex: index,
      guardian: {
        id: getValues(`items.${index}.studentGuardianPK.guardianId`),
      },
      update: true,
    })
  }

  const onGuardianAdd = (index: number) => {
    const relation = getValues(`items.${index}.relation`)
    let gender = null
    if (relation === 'FATHER') {
      gender = 'MALE'
    } else if (relation === 'MOTHER') {
      gender = 'FEMALE'
    }
    formModal.show({
      popover: true,
      currentIndex: index,
      guardian: { gender },
    })
  }

  return (
    <div className="p-0 space-x-">
      <div className="flex flex-col md:flex-row w-full gap-x-1">
        <div className="w-full md:w-9/12">
          <FormSection
            title={t('label-studentInformation') || "Informations de l'élève"}
            description={
              t('label-studentInfoDesc') || "Détails d'identification"
            }
            icon={<User size={18} />}
            color="#7367f0"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-1">
              <ControlledSelect
                name="gender"
                control={control}
                label={t('label-gender')}
                required
                prepend={<Users size={14} />}
                onChange={(value) => {
                  setValue('gender', value)
                  if (value) {
                    document.getElementById('lastName')?.focus?.()
                  }
                }}
                options={genderOptions.map(({ label, value }) => ({
                  label: t(label),
                  value,
                }))}
                autoFocus={true}
              />

              <div className="md:col-span-2">
                <Input
                  name="lastName"
                  id="lastName"
                  label={t('label-lastName')}
                  control={control}
                  required={true}
                  prepend={<User size={14} />}
                />
              </div>

              <div className="md:col-span-3">
                <Input
                  name="firstName"
                  label={t('label-firstName')}
                  control={control}
                  prepend={<Info size={14} />}
                />
              </div>

              <div className="md:col-span-3">
                <ToggleOption
                  icon={<Calendar size={16} />}
                  title={t('label-presumeBirthDate')}
                  description={
                    t('label-presumeBirthDateDesc') ||
                    'Date de naissance approximative'
                  }
                  isActive={watch('presumeBirthDate')}
                >
                  <Switch
                    name="presumeBirthDate"
                    control={control}
                    label=""
                    defaultChecked={getValues('presumeBirthDate')}
                  />
                </ToggleOption>
              </div>

              <DatePicker
                name="birthDate"
                label={t('label-birthDate')}
                control={control}
                required={true}
              />

              <Input
                name="birthplace"
                label={t('label-birthplace')}
                control={control}
                required
                className="hidden"
              />

              <div className="md:col-span-2">
                <StudentBirthplaceAutocomplete
                  onFill={(value: string) => {
                    setValue('birthplace', value)
                  }}
                  canRefetch={false}
                  label={t('label-birthplace')}
                  required
                  id="birthplaceF"
                  error={errors.birthplace?.message}
                  value={student?.birthplace}
                />
              </div>

              <div className="md:col-span-3">
                <Input
                  name="registrationNumber"
                  label={t('label-registrationNumber')}
                  control={control}
                  required={student?.id != null}
                  prepend={<Hash size={14} />}
                  placeholder={t('label-registrationNumberPlaceholder')}
                />
              </div>
            </div>
          </FormSection>
        </div>

        <div className="w-full md:w-3/12">
          <PictureManager
            picture={watch('picture')}
            onPictureChange={(val) => setValue('picture', val)}
          />
        </div>
      </div>

      <div className="mt-0">
        <TabNav
          items={[
            { id: '1', label: 'label-otherInfos' },
            { id: '2', label: 'label-address' },
            { id: '3', label: 'label-contact' },
            { id: '4', label: 'label-guardians' },
          ]}
        >
          <TabPane tabId="1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-1">
              <FormSection
                title={t('label-origin') || 'Origine'}
                description={t('label-originDesc') || 'Détails géographiques'}
                icon={<MapPin size={18} />}
                color="#00cfe8"
              >
                <div className="grid grid-cols-2 gap-1">
                  <Input
                    name="origin.countryOrigin"
                    control={control}
                    label={t('label-countryOrigin')}
                    prepend={<Globe size={14} />}
                  />
                  <Input
                    name="origin.regionOrigin"
                    control={control}
                    label={t('label-regionOrigin')}
                    prepend={<Flag size={14} />}
                  />
                  <Input
                    name="origin.departmentOrigin"
                    control={control}
                    label={t('label-departmentOrigin')}
                    prepend={<Navigation size={14} />}
                  />
                  <Input
                    name="origin.districtOrigin"
                    control={control}
                    label={t('label-districtOrigin')}
                    prepend={<MapPin size={14} />}
                  />
                </div>
              </FormSection>

              <FormSection
                title={t('label-personalDetails') || 'Détails personnels'}
                description={
                  t('label-personalDetailsDesc') || 'Informations diverses'
                }
                icon={<User size={18} />}
                color="#7367f0"
              >
                <div className="grid grid-cols-2 gap-1">
                  <div className="col-span-1">
                    <Input
                      name="religion"
                      control={control}
                      label={t('label-religion')}
                      className="hidden"
                    />
                    <StudentReligionAutocomplete
                      onFill={(value: string) => {
                        setValue('religion', value)
                      }}
                      canRefetch={false}
                      label={t('label-religion')}
                      required={false}
                      id="religionF"
                      error={errors.religion?.message}
                      value={student?.religion}
                    />
                  </div>
                  <Input
                    name="ethnicGroup"
                    control={control}
                    label={t('label-ethnicGroup')}
                    prepend={<Tag size={14} />}
                  />
                  <Input
                    name="bloodGroup"
                    control={control}
                    label={t('label-bloodGroup')}
                    prepend={<Droplet size={14} />}
                  />
                  <Input
                    name="rhesus"
                    control={control}
                    label={t('label-rhesus')}
                    prepend={<Activity size={14} />}
                  />
                </div>
              </FormSection>

              <FormSection
                title={t('label-healthInfo') || 'Informations de santé'}
                description={t('label-healthInfoDesc') || 'Suivi médical'}
                icon={<Heart size={18} />}
                color="#ea5455"
                className="md:col-span-2"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  <Input
                    name="knownHealthProblem"
                    label={t('label-knownHealthProblem')}
                    control={control}
                    type="textarea"
                    rows={2}
                    prepend={<Stethoscope size={14} />}
                  />
                  <Input
                    name="otherUsefulInfo"
                    label={t('label-otherUsefulInfo')}
                    control={control}
                    type="textarea"
                    rows={2}
                    prepend={<ClipboardList size={14} />}
                  />
                </div>
              </FormSection>
            </div>
          </TabPane>

          <TabPane tabId="2">
            <FormSection
              title={t('label-address') || 'Adresse'}
              description={t('label-addressDesc') || 'Lieu de résidence'}
              icon={<Home size={18} />}
              color="#ff9f43"
              className="mt-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <Input
                  name="address.zipCode"
                  label={t('label-zipCode')}
                  control={control}
                  prepend={<Tag size={14} />}
                />
                <Input
                  name="address.country"
                  label={t('label-country')}
                  control={control}
                  prepend={<Globe size={14} />}
                />
                <Input
                  name="address.town"
                  label={t('label-town')}
                  control={control}
                  prepend={<Navigation size={14} />}
                />
                <Input
                  name="address.state"
                  label={t('label-state')}
                  control={control}
                  prepend={<MapPin size={14} />}
                />
                <div className="md:col-span-2">
                  <Input
                    name="address.street"
                    label={t('label-street')}
                    control={control}
                    prepend={<MapPin size={14} />}
                  />
                </div>
              </div>
            </FormSection>
          </TabPane>

          <TabPane tabId="3">
            <FormSection
              title={t('label-contact') || 'Contact'}
              description={t('label-contactDesc') || 'Moyens de communication'}
              icon={<Phone size={18} />}
              color="#28c76f"
              className="mt-2"
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
                  prepend={<Mail size={14} />}
                />
                <Input
                  name="contactInfo.fax"
                  label={t('label-fax')}
                  control={control}
                  prepend={<Printer size={14} />}
                />
                <div className="md:col-span-2">
                  <Input
                    name="contactInfo.postOfficeBox"
                    label={t('label-postOfficeBox')}
                    control={control}
                    prepend={<MapPin size={14} />}
                  />
                </div>
              </div>
            </FormSection>
          </TabPane>

          <TabPane tabId="4">
            <FieldGrid $columns={3}>
              {fields.map((field, index) => (
                <Fragment key={field.id}>
                  <FieldGroup>
                    {(field.relation === 'FATHER' ||
                      field.relation === 'MOTHER') && (
                      <>
                        <Input
                          name={`items.${index}.relation`}
                          control={control}
                          className="hidden"
                          readOnly
                        />
                        <input
                          className="form-control"
                          readOnly
                          value={t(field.relation)}
                        />
                      </>
                    )}

                    {field.relation !== 'FATHER' &&
                      field.relation !== 'MOTHER' && (
                        <ControlledSelect
                          name={`items.${index}.relation`}
                          control={control}
                          prepend={<Users size={14} />}
                          onChange={(value) =>
                            setValue(`items.${index}.relation`, value)
                          }
                          options={relationOptions.map(({ label, value }) => ({
                            label: t(label),
                            value,
                          }))}
                          isClearable={false}
                        />
                      )}
                  </FieldGroup>

                  <FieldGroup $span={2}>
                    <SimpleInput
                      {...register(
                        `items.${index}.studentGuardianPK.guardianId`,
                      )}
                      readOnly={true}
                      className="hidden"
                    />
                    <StyledInputGroup className="input-group-merge">
                      <GuardianInputWrapper>
                        <Input
                          name={`items.${index}.guardian.displayName`}
                          control={control}
                          //prepend={<User size={14} />}
                          placeholder={
                            t('label-chooseGuardian') || 'Choisir un parent'
                          }
                          onClick={(e) => onGuardianClick(index)}
                          readOnly
                        />
                      </GuardianInputWrapper>
                      {watch(`items.${index}.guardian.displayName`) && (
                        <InputGroupText
                          onClick={() => onGuardianUpdate(index)}
                          className="cursor-pointer"
                        >
                          <Pencil size={16} className="text-green-600" />
                        </InputGroupText>
                      )}
                      {watch(`items.${index}.guardian.displayName`) && (
                        <InputGroupText
                          onClick={() => onGuardianDelete(index)}
                          className="cursor-pointer"
                        >
                          <X size={16} className="text-red-600" />
                        </InputGroupText>
                      )}
                      <InputGroupText
                        onClick={() => onGuardianAdd(index)}
                        className="cursor-pointer"
                      >
                        <Plus size={16} className="text-purple-600" />
                      </InputGroupText>
                    </StyledInputGroup>
                  </FieldGroup>
                </Fragment>
              ))}
            </FieldGrid>
          </TabPane>
        </TabNav>
      </div>
    </div>
  )
}

export default StudentFragmentForm
