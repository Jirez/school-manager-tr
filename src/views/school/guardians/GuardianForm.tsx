import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import type { GuardianType } from './Guardian.type'
import { Form, TabPane } from 'reactstrap'
import {
  User,
  Briefcase,
  MapPin,
  StickyNote,
  Languages,
  Users,
  Globe,
  Flag,
  Navigation,
  Mail,
  Phone,
  Printer,
  Hash,
  Home,
  Info,
  Activity,
} from 'lucide-react'
import Input from '@/@core/components/ui/forms/input'
import LiveView from '@/utils/LiveView'
import { useAuthentication } from '@/hooks/useAuthentication'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { genderOptions } from '../students/StudentFragmentForm'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { TabNav } from '@/@core/components/tabs'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { guardianValidationSchema } from './guardian.validation'
import { yupResolver } from '@hookform/resolvers/yup'
import PhoneInput from '@/@core/components/ui/forms/phone-input'
import { TOAST_OPTIONS } from '@/utils/constants'
import { LanguageCreatedDocument, useLanguagesQuery } from '@/gql/graphql'
import GuardianStreetAutocomplete from '@/utils/GuardianStreetAutocomplete'
import GuardianReligionAutocomplete from '@/utils/GuardianReligionAutocomplete'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import FormSection from '@/@core/components/ui/forms/form-section'

interface GuardianFormProps extends BaseFormProps {
  guardian?: GuardianType
  modal?: NiceModalHandler
  relation?: any
  currentIndex?: number
}

const initialValues: Partial<GuardianType> = {
  languageId: null,
  lastName: '',
  firstName: '',
  gender: '',
  active: true,
  profession: '',
  note: '',
  job: '',
  religion: '',
  regionOrigin: '',
  departmentOrigin: '',
  districtOrigin: '',
  address: {
    country: '',
    state: '',
    street: '',
    town: '',
  },
  contactInfo: {
    telephone: '',
    mobile: '',
    email: '',
    fax: '',
    postOfficeBox: '',
  },
}

const GuardianForm: FC<GuardianFormProps> = ({
  guardian,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useLanguagesQuery()

  const getSelectedGender = (): string | Record<string, any> => {
    if (!guardian) {
      return ''
    }

    return genderOptions
      .filter(({ value }) => value === guardian.gender)
      .map(({ label, value }) => ({ label: t(label), value }))[0]
  }

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    setValue,
    reset,
    watch,
  } = useForm<GuardianType>({
    defaultValues: {
      lastName: guardian?.lastName || '',
      firstName: guardian?.firstName || '',
      gender: guardian ? getSelectedGender() : '',
      address: {
        zipCode: guardian?.address?.zipCode || '',
        country: guardian?.address?.country || '',
        town: guardian?.address?.town || '',
        state: guardian?.address?.state || '',
        street: guardian?.address?.street || '',
      },
      contactInfo: {
        fax: guardian?.contactInfo?.fax || '',
        email: guardian?.contactInfo?.email || '',
        mobile: guardian?.contactInfo?.mobile || '',
        telephone: guardian?.contactInfo?.telephone || '',
        postOfficeBox: guardian?.contactInfo?.postOfficeBox || '',
      },
      languageId: guardian ? guardian.language : null,
      profession: guardian?.profession || '',
      job: guardian?.job || '',
      religion: guardian?.religion || '',
      regionOrigin: guardian?.regionOrigin || '',
      departmentOrigin: guardian?.departmentOrigin || '',
      districtOrigin: guardian?.districtOrigin || '',
      note: guardian?.note || '',
    },
    resolver: yupResolver(guardianValidationSchema),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = guardian?.id

      action({
        variables: {
          guardian: {
            ...values,
            id,
            gender: values.gender.value,
            languageId: values.languageId ? values.languageId.id : null,
            schoolId: enterpriseId,
            enterpriseId: enterpriseId,
            note: values.note || null,
            job: values.job || null,
            religion: values.religion || null,
            regionOrigin: values.regionOrigin || null,
            departmentOrigin: values.departmentOrigin || null,
            districtOrigin: values.districtOrigin || null,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(`Parent ${data.guardian.lastName} enregistré`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            let name = ''
            if (props.relation) {
              if (props.relation.father) {
                name = 'father'
              }
              if (props.relation.mother) {
                name = 'mother'
              }
              if (props.relation.tutor) {
                name = 'tutor'
              }
            } else {
              name = 'guardian'
            }

            if (props.currentIndex) {
              messageService.sendMessage(name, {
                ...data.guardian,
                currentIndex: props.currentIndex,
              })
            } else {
              messageService.sendMessage(name, data.guardian)
            }
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter le parent: ${formatError(error)}`)
          //console.log(error.message)
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit}>
      <div className="pb-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {/* Personal Information Section */}
          <FormSection
            title={
              t('label-personalInformation') || 'Informations personnelles'
            }
            description={
              t('label-personalInfoDesc') || "Détails d'identification"
            }
            icon={<User size={18} />}
            color="#7367f0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <div className="md:col-span-1">
                <LiveView
                  document={LanguageCreatedDocument}
                  singleVar="language"
                  data={data}
                  loading={loading}
                  listVar="languages"
                  subscribeToMore={subscribeToMore}
                  sortField="name"
                  triggerUpdate={true}
                  enterpriseId={enterpriseId}
                >
                  {({ languages }) => (
                    <ControlledSelect
                      name="languageId"
                      label={t('label-spokenLanguage')}
                      control={control}
                      required
                      loading={loading}
                      prepend={<Languages size={14} />}
                      onChange={(val: any) => setValue('languageId', val)}
                      options={languages || undefined}
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option: any) => option.id}
                      autoFocus
                    />
                  )}
                </LiveView>
              </div>

              <ControlledSelect
                name="gender"
                control={control}
                label={t('label-gender')}
                prepend={<Users size={14} />}
                onChange={(value) => setValue('gender', value)}
                options={genderOptions.map(({ label, value }) => ({
                  label: t(label),
                  value,
                }))}
                required
              />

              <div className="md:col-span-2">
                <Input
                  name="lastName"
                  label={t('label-lastName')}
                  control={control}
                  required
                  prepend={<User size={14} />}
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  name="firstName"
                  label={t('label-firstName')}
                  control={control}
                  prepend={<Info size={14} />}
                />
              </div>
            </div>
          </FormSection>

          {/* Professional Information Section */}
          <FormSection
            title={
              t('label-professionalInformation') ||
              'Informations professionnelles'
            }
            description={
              t('label-professionalInfoDesc') || 'Carrière et croyances'
            }
            icon={<Briefcase size={18} />}
            color="#28c76f"
          >
            <div className="grid grid-cols-1 gap-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <Input
                  name="profession"
                  label={t('label-profession')}
                  control={control}
                  prepend={<Briefcase size={14} />}
                />
                <Input
                  name="job"
                  label={t('label-job')}
                  control={control}
                  prepend={<Activity size={14} />}
                />
              </div>

              <div className="col-span-full">
                <Input
                  name="religion"
                  label={t('label-religion')}
                  control={control}
                  className="hidden"
                />
                <GuardianReligionAutocomplete
                  onFill={(value: string) => {
                    setValue('religion', value)
                  }}
                  canRefetch={false}
                  label={t('label-religion')}
                  id="religionF"
                  value={guardian?.religion}
                />
              </div>

              <Input
                name="note"
                label={t('label-note')}
                control={control}
                type="textarea"
                rows={2}
                prepend={<StickyNote size={14} />}
              />
            </div>
          </FormSection>

          {/* Origin Section */}
          <FormSection
            title={t('label-origin') || 'Origine'}
            description={t('label-originDesc') || 'Détails géographiques'}
            icon={<MapPin size={18} />}
            color="#00cfe8"
            className="col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              <Input
                name="regionOrigin"
                label={t('label-regionOrigin')}
                control={control}
                prepend={<Flag size={14} />}
              />
              <Input
                name="departmentOrigin"
                label={t('label-departmentOrigin')}
                control={control}
                prepend={<Navigation size={14} />}
              />
              <Input
                name="districtOrigin"
                label={t('label-districtOrigin')}
                control={control}
                prepend={<MapPin size={14} />}
              />
            </div>
          </FormSection>

          {/* Contact & Address Section */}
          <div className="md:col-span-2">
            <TabNav
              items={[
                { id: '1', label: 'label-address' },
                { id: '2', label: 'label-contact' },
              ]}
            >
              <TabPane tabId="1">
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
                      prepend={<Hash size={14} />}
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
                        className="hidden"
                      />
                      <GuardianStreetAutocomplete
                        onFill={(value: string) => {
                          setValue('address.street', value)
                        }}
                        canRefetch={false}
                        label={t('label-street')}
                        id="streetF"
                        value={guardian?.address?.street}
                      />
                    </div>
                  </div>
                </FormSection>
              </TabPane>

              <TabPane tabId="2">
                <FormSection
                  title={t('label-contact') || 'Contact'}
                  description={
                    t('label-contactDesc') || 'Moyens de communication'
                  }
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
                        prepend={<Hash size={14} />}
                      />
                    </div>
                  </div>
                </FormSection>
              </TabPane>
            </TabNav>
          </div>
        </div>
      </div>

      <StickyActions>
        <ActionButtons
          cancelAction={modal?.hide}
          isSubmitting={props.loading}
          popover={props.popover}
          dirty={isDirty}
          onSubmit={onSubmit}
          disabled={props.loading}
          fixed={false}
        />
      </StickyActions>
    </Form>
  )
}

export default GuardianForm
