import type { FC } from 'react'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import { Form, TabPane } from 'reactstrap'
import { z } from 'zod'

import { TabNav } from '@/@core/components/tabs'
import { useAuthentication } from '@/hooks/useAuthentication'
import { formatError } from '@/utils/ErrorHelper'
import { messageService } from '@/utils/message.service'

import type { OldSchoolType } from './oldSchool.type'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  Globe,
  Navigation,
  Printer,
} from 'lucide-react'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { m } from '@/paraglide/messages'
import { optionalString } from '#/utils/zod.helpers'

const oldSchoolZodSchema = z.object({
  name: z.string().min(1, m.validation_required()),
  id: z.number().optional(),
  address: z
    .object({
      zipCode: optionalString(),
      country: optionalString(),
      town: optionalString(),
      state: optionalString(),
      street: optionalString(),
    })
    .optional(),
  contactInfo: z
    .object({
      telephone: optionalString(),
      mobile: optionalString(),
      email: optionalString(),
      fax: optionalString(),
      postOfficeBox: optionalString(),
    })
    .optional()
    .nullable(),
})

type OldSchoolZodSchemaType = z.infer<typeof oldSchoolZodSchema>

interface OldSchoolFormProps extends BaseFormProps {
  oldSchool?: OldSchoolZodSchemaType
  modal?: NiceModalHandler
}

const OldSchoolForm: FC<OldSchoolFormProps> = ({
  oldSchool,
  modal,
  action,
  ...props
}) => {
  const { enterpriseId } = useAuthentication()

  const { handleSubmit, AppField, reset, AppForm, SubmitButton } = useAppForm({
    defaultValues: {
      name: oldSchool?.name || '',
      address: {
        zipCode: oldSchool?.address?.zipCode || '',
        country: oldSchool?.address?.country || '',
        town: oldSchool?.address?.town || '',
        state: oldSchool?.address?.state || '',
        street: oldSchool?.address?.street || '',
      },
      contactInfo: {
        fax: oldSchool?.contactInfo?.fax || '',
        email: oldSchool?.contactInfo?.email || '',
        mobile: oldSchool?.contactInfo?.mobile || '',
        telephone: oldSchool?.contactInfo?.telephone || '',
        postOfficeBox: oldSchool?.contactInfo?.postOfficeBox || '',
      },
    } as any,
    validators: {
      onChange: oldSchoolZodSchema,
    },
    onSubmitMeta: defaultMeta,
    onSubmit({ value, meta }) {
      const id = oldSchool ? Number(oldSchool.id) : undefined
      const values = oldSchoolZodSchema.parse(value)

      action({
        variables: {
          oldSchool: {
            ...values,
            id,
            schoolId: enterpriseId,
          },
        },
      })
        .then(async ({ data }) => {
          reset()
          toast.success(
            `Ancien établissement ${data.oldSchool.name} enregistré`,
            { ...TOAST_OPTIONS },
          )

          if (props.popover) {
            messageService.sendMessage('oldSchool', data.oldSchool)
            props.onModalClose?.()
          }
          if (meta.close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter l'ancien établissement: ${formatError(error)}`,
          )
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
      <FormSection
        icon={<Building2 className="w-5 h-5" />}
        title={m.label_generalInfo()}
        description={m.label_school_name()}
        color="#7367f0"
      >
        <AppField
          name="name"
          children={(field) => (
            <field.Input
              label={m.label_name()}
              required
              prepend={<Building2 size={16} />}
            />
          )}
        />
      </FormSection>

      {/* Tabs */}
      <div className="mt-2">
        <TabNav
          items={[
            { id: '1', label: 'label-address' },
            { id: '2', label: 'label-contact' },
          ]}
        >
          <TabPane tabId="1">
            <FormSection
              icon={<MapPin className="w-5 h-5" />}
              title={m.label_address()}
              description={m.label_addressDesc()}
              color="#ff9f43"
            >
              <div className="flex flex-col md:flex-row gap-x-6 gap-y-2 mb-1">
                <div className="w-full md:w-4/12">
                  <AppField
                    name="address.zipCode"
                    children={(field) => (
                      <field.Input
                        label={m.label_zipCode()}
                        prepend={<MapPin size={16} />}
                      />
                    )}
                  />
                </div>

                <div className="w-full md:w-8/12">
                  <AppField
                    name="address.country"
                    children={(field) => (
                      <field.Input
                        label={m.label_country()}
                        prepend={<Globe size={16} />}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-x-6 gap-y-2 mb-1">
                <div className="w-full md:w-6/12">
                  <AppField
                    name="address.town"
                    children={(field) => (
                      <field.Input
                        label={m.label_town()}
                        prepend={<Navigation size={16} />}
                      />
                    )}
                  />
                </div>

                <div className="w-full md:w-6/12">
                  <AppField
                    name="address.state"
                    children={(field) => (
                      <field.Input
                        label={m.label_state()}
                        prepend={<MapPin size={16} />}
                      />
                    )}
                  />
                </div>
              </div>

              <AppField
                name="address.street"
                children={(field) => (
                  <field.Input
                    label={m.label_street()}
                    prepend={<MapPin size={16} />}
                  />
                )}
              />
            </FormSection>
          </TabPane>

          <TabPane tabId="2">
            <FormSection
              icon={<Phone className="w-5 h-5" />}
              title={m.label_contact()}
              description={m.label_contactDesc()}
              color="#28c76f"
            >
              <div className="flex flex-col md:flex-row gap-x-6 gap-y-2 mb-1">
                <div className="w-full md:w-6/12">
                  <AppField
                    name="contactInfo.telephone"
                    children={(field) => (
                      <field.PhoneInput label={m.label_telephone()} />
                    )}
                  />
                </div>

                <div className="w-full md:w-6/12">
                  <AppField
                    name="contactInfo.mobile"
                    children={(field) => (
                      <field.PhoneInput label={m.label_mobileTelephone()} />
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-x-6 gap-y-2 mb-1">
                <div className="w-full md:w-4/12">
                  <AppField
                    name="contactInfo.email"
                    children={(field) => (
                      <field.Input
                        label={m.label_email()}
                        prepend={<Mail size={16} />}
                      />
                    )}
                  />
                </div>

                <div className="w-full md:w-4/12">
                  <AppField
                    name="contactInfo.fax"
                    children={(field) => (
                      <field.Input
                        label={m.label_fax()}
                        prepend={<Printer size={16} />}
                      />
                    )}
                  />
                </div>

                <div className="w-full md:w-4/12">
                  <AppField
                    name="contactInfo.postOfficeBox"
                    children={(field) => (
                      <field.Input
                        label={m.label_postOfficeBox()}
                        prepend={<FileText size={16} />}
                      />
                    )}
                  />
                </div>
              </div>
            </FormSection>
          </TabPane>
        </TabNav>
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

export default OldSchoolForm
