import { useForm } from 'react-hook-form'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Form, TabPane } from 'reactstrap'
import * as yup from 'yup'

import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { TabNav } from '@/@core/components/tabs'
import Input from '@/@core/components/ui/forms/input'
import PhoneInput from '@/@core/components/ui/forms/phone-input'
import { useAuthentication } from '@/hooks/useAuthentication'
import { formatError } from '@/utils/ErrorHelper'
import { messageService } from '@/utils/message.service'

import type { OldSchoolType } from './oldSchool.type'
import { emptyStringToNull } from '@/utils/helpers'
import { TOAST_OPTIONS } from '@/utils/constants'
import { Building2, MapPin, Phone, Mail, FileText } from 'lucide-react'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'

interface OldSchoolFormProps extends BaseFormProps {
  oldSchool?: OldSchoolType
  modal?: NiceModalHandler
}

const initialValues: Partial<OldSchoolType> = {
  name: '',
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

const OldSchoolForm: React.FC<OldSchoolFormProps> = ({
  oldSchool,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<OldSchoolType>({
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
    },
    resolver: yupResolver(
      yup.object({
        name: yup.string().required(),
        contactInfo: yup.object({
          telephone: yup
            .string()
            .optional()
            .min(9)
            .max(64)
            .transform(emptyStringToNull),
          fax: yup
            .string()
            .optional()
            .min(9)
            .max(64)
            .transform(emptyStringToNull),
          mobile: yup
            .string()
            .optional()
            .min(9)
            .max(64)
            .transform(emptyStringToNull),
          email: yup
            .string()
            .optional()
            .min(6)
            .max(60)
            .transform(emptyStringToNull),
          postOfficeBox: yup
            .string()
            .optional()
            .min(2)
            .max(64)
            .transform(emptyStringToNull),
        }),
        address: yup.object({
          town: yup
            .string()
            .optional()
            .min(2)
            .max(50)
            .transform(emptyStringToNull),
          state: yup
            .string()
            .optional()
            .min(2)
            .max(50)
            .transform(emptyStringToNull),
          street: yup
            .string()
            .optional()
            .min(2)
            .max(50)
            .transform(emptyStringToNull),
          country: yup
            .string()
            .optional()
            .min(2)
            .max(50)
            .transform(emptyStringToNull),
          zipCode: yup
            .string()
            .optional()
            .min(3)
            .max(5)
            .transform(emptyStringToNull),
        }),
      }),
    ),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = oldSchool ? Number(oldSchool.id) : undefined

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
          reset(initialValues)
          toast.success(
            `Ancien établissement ${data.oldSchool.name} enregistré`,
            { ...TOAST_OPTIONS },
          )

          if (props.popover) {
            messageService.sendMessage('oldSchool', data.oldSchool)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter l'ancien établissement: ${formatError(error)}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="space-y-6">
      <FormSection
        icon={<Building2 className="w-5 h-5" />}
        title="Informations générales"
        description="Nom de l'établissement scolaire"
        color="#7367f0"
      >
        <Input
          name="name"
          control={control}
          label={t('label-name')}
          required
          prepend={<Building2 size={16} />}
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
              title="Adresse"
              description="Localisation de l'établissement"
              color="#ff9f43"
            >
              <div className="flex flex-col md:flex-row gap-x-6 gap-y-2 mb-1">
                <Input
                  name="address.zipCode"
                  label={t('label-zipCode')}
                  control={control}
                  className="w-full md:w-4/12"
                  prepend={<MapPin size={16} />}
                />

                <Input
                  name="address.country"
                  label={t('label-country')}
                  control={control}
                  className="w-full md:w-8/12"
                  prepend={<MapPin size={16} />}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-x-6 gap-y-2 mb-1">
                <Input
                  name="address.town"
                  label={t('label-town')}
                  control={control}
                  className="w-full md:w-6/12"
                  prepend={<MapPin size={16} />}
                />

                <Input
                  name="address.state"
                  label={t('label-state')}
                  control={control}
                  className="w-full md:w-6/12"
                  prepend={<MapPin size={16} />}
                />
              </div>

              <Input
                name="address.street"
                label={t('label-street')}
                control={control}
                className="w-full"
                prepend={<MapPin size={16} />}
              />
            </FormSection>
          </TabPane>

          <TabPane tabId="2">
            <FormSection
              icon={<Phone className="w-5 h-5" />}
              title="Coordonnées"
              description="Informations de contact de l'établissement"
              color="#2f8724"
            >
              <div className="flex flex-col md:flex-row gap-x-6 gap-y-2 mb-1">
                <PhoneInput
                  name="contactInfo.telephone"
                  label={t('label-telephone')}
                  control={control}
                  className="w-full md:w-6/12"
                />

                <PhoneInput
                  name="contactInfo.mobile"
                  label={t('label-mobileTelephone')}
                  control={control}
                  className="w-full md:w-6/12"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-x-6 gap-y-2 mb-1">
                <Input
                  name="contactInfo.email"
                  label={t('label-email')}
                  control={control}
                  className="w-full md:w-4/12"
                  prepend={<Mail size={16} />}
                />

                <Input
                  name="contactInfo.fax"
                  label={t('label-fax')}
                  control={control}
                  className="w-full md:w-4/12"
                  prepend={<Phone size={16} />}
                />

                <Input
                  name="contactInfo.postOfficeBox"
                  label={t('label-postOfficeBox')}
                  control={control}
                  className="w-full md:w-4/12"
                  prepend={<FileText size={16} />}
                />
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

export default OldSchoolForm
