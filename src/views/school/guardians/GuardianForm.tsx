import type { FC } from 'react'
import { toast } from 'react-toastify'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
// import type { GuardianType } from './Guardian.type'
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
import LiveView from '@/utils/LiveView'
import { useAuthentication } from '@/hooks/useAuthentication'
import { genderOptions } from '../students/StudentFragmentForm'
import { TabNav } from '@/@core/components/tabs'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { guardianZodSchema } from './guardian.validation'
import type { GuardianZodSchemaType } from './guardian.validation'
import { TOAST_OPTIONS } from '@/utils/constants'
import { LanguageCreatedDocument, useLanguagesQuery } from '@/gql/graphql'
import GuardianStreetAutocomplete from '@/utils/GuardianStreetAutocomplete'
import GuardianReligionAutocomplete from '@/utils/GuardianReligionAutocomplete'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import FormSection from '@/@core/components/ui/forms/form-section'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { m } from '@/paraglide/messages'

interface GuardianFormProps extends BaseFormProps {
  guardian?: GuardianZodSchemaType
  modal?: NiceModalHandler
  relation?: any
  currentIndex?: number
}

const GuardianForm: FC<GuardianFormProps> = ({
  guardian,
  action,
  modal,
  ...props
}) => {
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useLanguagesQuery()

  const getSelectedGender = () => {
    if (!guardian) {
      return null
    }
    return genderOptions.find(({ value }) => value === guardian.gender) || null
  }

  const {
    handleSubmit,
    AppField,
    reset,
    AppForm,
    SubmitButton,
    setFieldValue,
  } = useAppForm({
    defaultValues: {
      lastName: guardian?.lastName || '',
      firstName: guardian?.firstName || '',
      gender: getSelectedGender(),
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
      active: guardian?.active ?? true,
    },
    validators: {
      // @ts-ignore validators are not typed yet
      onChange: guardianZodSchema,
    },
    onSubmitMeta: defaultMeta,
    onSubmit({ value, meta }) {
      const id = guardian?.id
      const values = guardianZodSchema.parse(value)

      action({
        variables: {
          guardian: {
            ...values,
            id,
            gender: values.gender?.value || values.gender,
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
        .then(async ({ data: result }) => {
          reset()
          toast.success(`Parent ${result.guardian.lastName} enregistré`, {
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
                ...result.guardian,
                currentIndex: props.currentIndex,
              })
            } else {
              messageService.sendMessage(name, result.guardian)
            }
            props.onModalClose?.()
          }
          if (meta.close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter le parent: ${formatError(error)}`)
        })
    },
  })

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <div className="pb-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {/* Personal Information Section */}
          <FormSection
            title={m.label_personalInformation()}
            description={m.label_personalInfoDesc()}
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
                    <AppField
                      name="languageId"
                      children={(field) => (
                        <field.ControlledSelect
                          label={m.label_spokenLanguage()}
                          required
                          loading={loading}
                          prepend={<Languages size={14} />}
                          options={languages || undefined}
                          getOptionLabel={(option: any) => option.name}
                          getOptionValue={(option: any) => option.id}
                          onChange={(val: any) =>
                            setFieldValue('languageId', val)
                          }
                          autoFocus
                        />
                      )}
                    />
                  )}
                </LiveView>
              </div>

              <AppField
                name="gender"
                children={(field) => (
                  <field.ControlledSelect
                    label={m.label_gender()}
                    prepend={<Users size={14} />}
                    options={genderOptions.map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                    required
                    onChange={(value: any) => setFieldValue('gender', value)}
                  />
                )}
              />

              <div className="md:col-span-2">
                <AppField
                  name="lastName"
                  children={(field) => (
                    <field.Input
                      label={m.label_lastName()}
                      required
                      prepend={<User size={14} />}
                    />
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <AppField
                  name="firstName"
                  children={(field) => (
                    <field.Input
                      label={m.label_firstName()}
                      prepend={<Info size={14} />}
                    />
                  )}
                />
              </div>
            </div>
          </FormSection>

          {/* Professional Information Section */}
          <FormSection
            title={m.label_professionalInformation()}
            description={m.label_professionalInfoDesc()}
            icon={<Briefcase size={18} />}
            color="#28c76f"
          >
            <div className="grid grid-cols-1 gap-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <AppField
                  name="profession"
                  children={(field) => (
                    <field.Input
                      label={m.label_profession()}
                      prepend={<Briefcase size={14} />}
                    />
                  )}
                />
                <AppField
                  name="job"
                  children={(field) => (
                    <field.Input
                      label={m.label_job()}
                      prepend={<Activity size={14} />}
                    />
                  )}
                />
              </div>

              <div className="col-span-full">
                <AppField
                  name="religion"
                  children={(field) => <field.Input className="hidden" />}
                />
                <GuardianReligionAutocomplete
                  onFill={(value: string) => {
                    setFieldValue('religion', value)
                  }}
                  canRefetch={false}
                  label={m.label_religion()}
                  id="religionF"
                  value={guardian?.religion}
                />
              </div>

              <AppField
                name="note"
                children={(field) => (
                  <field.Input
                    label={m.label_note()}
                    type="textarea"
                    rows={2}
                    prepend={<StickyNote size={14} />}
                  />
                )}
              />
            </div>
          </FormSection>

          {/* Origin Section */}
          <FormSection
            title={m.label_origin()}
            description={m.label_originDesc()}
            icon={<MapPin size={18} />}
            color="#00cfe8"
            className="col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              <AppField
                name="regionOrigin"
                children={(field) => (
                  <field.Input
                    label={m.label_regionOrigin()}
                    prepend={<Flag size={14} />}
                  />
                )}
              />
              <AppField
                name="departmentOrigin"
                children={(field) => (
                  <field.Input
                    label={m.label_departmentOrigin()}
                    prepend={<Navigation size={14} />}
                  />
                )}
              />
              <AppField
                name="districtOrigin"
                children={(field) => (
                  <field.Input
                    label={m.label_districtOrigin()}
                    prepend={<MapPin size={14} />}
                  />
                )}
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
                  title={m.label_address()}
                  description={m.label_addressDesc()}
                  icon={<Home size={18} />}
                  color="#ff9f43"
                  className="mt-2"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    <AppField
                      name="address.zipCode"
                      children={(field) => (
                        <field.Input
                          label={m.label_zipCode()}
                          prepend={<Hash size={14} />}
                        />
                      )}
                    />
                    <AppField
                      name="address.country"
                      children={(field) => (
                        <field.Input
                          label={m.label_country()}
                          prepend={<Globe size={14} />}
                        />
                      )}
                    />
                    <AppField
                      name="address.town"
                      children={(field) => (
                        <field.Input
                          label={m.label_town()}
                          prepend={<Navigation size={14} />}
                        />
                      )}
                    />
                    <AppField
                      name="address.state"
                      children={(field) => (
                        <field.Input
                          label={m.label_state()}
                          prepend={<MapPin size={14} />}
                        />
                      )}
                    />
                    <div className="md:col-span-2">
                      <AppField
                        name="address.street"
                        children={(field) => <field.Input className="hidden" />}
                      />
                      <GuardianStreetAutocomplete
                        onFill={(value: string) => {
                          setFieldValue('address.street', value)
                        }}
                        canRefetch={false}
                        label={m.label_street()}
                        id="streetF"
                        value={guardian?.address?.street}
                      />
                    </div>
                  </div>
                </FormSection>
              </TabPane>

              <TabPane tabId="2">
                <FormSection
                  title={m.label_contact()}
                  description={m.label_contactDesc()}
                  icon={<Phone size={18} />}
                  color="#28c76f"
                  className="mt-2"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    <AppField
                      name="contactInfo.telephone"
                      children={(field) => (
                        <field.PhoneInput label={m.label_telephone()} />
                      )}
                    />
                    <AppField
                      name="contactInfo.mobile"
                      children={(field) => (
                        <field.PhoneInput label={m.label_mobileTelephone()} />
                      )}
                    />
                    <AppField
                      name="contactInfo.email"
                      children={(field) => (
                        <field.Input
                          label={m.label_email()}
                          prepend={<Mail size={14} />}
                        />
                      )}
                    />
                    <AppField
                      name="contactInfo.fax"
                      children={(field) => (
                        <field.Input
                          label={m.label_fax()}
                          prepend={<Printer size={14} />}
                        />
                      )}
                    />
                    <div className="md:col-span-2">
                      <AppField
                        name="contactInfo.postOfficeBox"
                        children={(field) => (
                          <field.Input
                            label={m.label_postOfficeBox()}
                            prepend={<Hash size={14} />}
                          />
                        )}
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

export default GuardianForm
