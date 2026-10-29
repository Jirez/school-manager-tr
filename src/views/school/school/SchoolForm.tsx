import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Form } from 'reactstrap'
import { toast } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import dayjs from 'dayjs'
import {
  School,
  FileSignature,
  MapPin,
  Phone,
  Briefcase,
  Languages,
  CheckCircle,
  Hash,
  Globe,
  Mail,
  Building2,
  Navigation,
  CreditCard,
  Building,
  Image as ImageIcon,
  Check,
  Flag,
} from 'lucide-react'

import type { SchoolType } from '@/views/school/school/School.type'
import { default as FormItem } from '@/@core/components/ui/forms/input'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import Switch from '@/@core/components/ui/forms/swith'
import Button from '@/@core/components/button'
import { formatError } from '@/utils/ErrorHelper'
import { schoolValidationSchema } from '@/views/school/school/school.validation'
import PhoneInput from '@/@core/components/ui/forms/phone-input'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import { m } from '@/paraglide/messages'

interface SchoolFormProps extends BaseFormProps {
  school: SchoolType
}

const SchoolForm: FC<SchoolFormProps> = ({ school, action, ...props }) => {
  const { t } = useTranslation()

  const { control, handleSubmit, getValues, watch } = useForm<SchoolType>({
    mode: 'onBlur',
    defaultValues: {
      name: school.name,
      name2: school.name2 || '',
      motto: school.motto || '',
      motto2: school.motto2 || '',
      schoolCode: school.schoolCode,
      schoolType: school.schoolType,
      schoolCategory: school.schoolCategory,
      shortName: school.shortName || '',
      active: school.active,
      note: school.note || '',
      logo: school.logo,
      creationDate: school.creationDate
        ? dayjs(school.creationDate).toDate()
        : null,
      studentType: school.studentType,
      registrationNumber: school.registrationNumber || '',
      webSite: school.webSite || '',
      address: {
        zipCode: school.address?.zipCode || '',
        country: school.address?.country || '',
        town: school.address?.town || '',
        state: school.address?.state || '',
        street: school.address?.street || '',
      },
      contactInfo: {
        fax: school.contactInfo?.fax || '',
        email: school.contactInfo?.email || '',
        mobile: school.contactInfo?.mobile || '',
        telephone: school.contactInfo?.telephone || '',
        postOfficeBox: school.contactInfo?.postOfficeBox || '',
      },
      legalInfo: {
        legalForm: school.legalInfo?.legalForm || '',
        shareCapital: school.legalInfo?.shareCapital || '',
        taxpayerNumber: school.legalInfo?.taxpayerNumber || '',
        tradeRegister: school.legalInfo?.tradeRegister || '',
      },
      authNumber: school.authNumber || '',
      nsifNumber: school.nsifNumber || '',
      venue: school.venue || '',
      signingAddress: school.signingAddress || '',
      bilingualName: school.bilingualName || '',
      identifier: school.identifier || '',
    },
    resolver: yupResolver(schoolValidationSchema),
  })

  const isActive = watch('active')

  const onSubmit: SubmitHandler<SchoolType> = (values) => {
    const id = Number(school.id)

    const { identifier, ...rest } = values

    action({
      variables: {
        school: {
          ...rest,
          id,
          creationDate: values.creationDate
            ? dayjs(values.creationDate).format(INPUT_DATE_FORMAT)
            : null,
          legalInfo: {
            shareCapital:
              values.legalInfo?.shareCapital !== ''
                ? Number(values.legalInfo?.shareCapital)
                : null,
            taxpayerNumber: values.legalInfo?.taxpayerNumber,
            legalForm: values.legalInfo?.legalForm,
            tradeRegister: values.legalInfo?.tradeRegister,
          },
          authNumber: values.authNumber || null,
          nsifNumber: values.nsifNumber || null,
          venue: values.venue || null,
          signingAddress: values.signingAddress || null,
          bilingualName: values.bilingualName || null,
          logo: values.logo || null,
        },
      },
    })
      .then(async ({ data }) => {
        toast.success(`Etablissement ${data.school.name} modifié`, {
          ...TOAST_OPTIONS,
        })
      })
      .catch((error) => {
        toast.error(
          `Impossible d'enregistrer l'établissement: ${formatError(error)}`,
        )
        console.log(error.message)
      })
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
      {/* Identity & Classification Section */}
      <FormSection
        title={t('label-schoolIdentity')}
        description={t('label-schoolIdentityDesc')}
        icon={<School size={20} />}
        color="#7367f0"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-1">
          <div className="md:col-span-4">
            <FormItem
              name="schoolCode"
              label={m.label_schoolCode()}
              placeholder={m.label_schoolCodePlaceholder()}
              control={control}
              prepend={<Hash size={14} />}
            />
          </div>
          <div className="md:col-span-4">
            <FormItem
              name="shortName"
              label={m.label_shortName()}
              placeholder={m.label_shortNamePlaceholder()}
              control={control}
            />
          </div>
          <div className="md:col-span-4">
            <FormItem
              name="registrationNumber"
              label={m.label_registrationNumber()}
              control={control}
            />
          </div>

          <div className="md:col-span-6">
            <FormItem
              name="name"
              label={m.label_name()}
              control={control}
              required
              prepend={<Building2 size={14} />}
            />
          </div>
          <div className="md:col-span-6">
            <FormItem name="name2" label={m.label_name2()} control={control} />
          </div>

          <div className="md:col-span-4">
            <FormItem
              name="identifier"
              label={m.label_identifier()}
              control={control}
              readOnly
            />
          </div>
          <div className="md:col-span-8">
            <FormItem
              name="bilingualName"
              label={m.label_bilingualName()}
              placeholder={m.label_bilingualNamePlaceholder()}
              control={control}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 border-t border-dashed border-gray-100 dark:border-gray-800">
          <div>
            <FormItem
              name="schoolType"
              control={control}
              type="select"
              className="mb-0"
              label={m.label_schoolType()}
              required
            >
              <option value="">{m.label_select()}</option>
              <option value="PUBLIC">{m.label_public()}</option>
              <option value="PRIVATE">{m.label_private()}</option>
            </FormItem>
          </div>

          <div>
            <FormItem
              name="schoolCategory"
              control={control}
              type="select"
              className="mb-0"
              label={m.label_schoolCategory()}
              required
            >
              <option value="">{m.label_select()}</option>
              <option value="PRIMARY_SCHOOL">{m.label_primarySchool()}</option>
              <option value="ENGLISH_PRIMARY_SCHOOL">
                {m.label_englishPrimarySchool()}
              </option>
              <option value="BILINGUAL_PRIMARY_SCHOOL">
                {m.label_bilingualPrimarySchool()}
              </option>
              <option value="HIGH_SCHOOL">{m.label_highSchool()}</option>
              <option value="ENGLISH_HIGH_SCHOOL">
                {m.label_englishHighSchool()}
              </option>
              <option value="BILINGUAL_HIGH_SCHOOL">
                {m.label_bilingualHighSchool()}
              </option>
              <option value="CETIC">CETIC</option>
              <option value="TECHNICAL_HIGH_SCHOOL">
                {m.label_technicalHighSchool()}
              </option>
              <option value="COLLEGE">{m.label_college()}</option>
              <option value="ENIEG">{m.label_enieg()}</option>
              <option value="UNIVERSITY">{m.label_university()}</option>
            </FormItem>
          </div>

          <div>
            <FormItem
              name="studentType"
              control={control}
              type="select"
              className="mb-0"
              label={m.label_studentType()}
              required
            >
              <option value="">{m.label_select()}</option>
              <option value="PUPIL">{m.label_pupil() || 'Ecoliers'}</option>
              <option value="STUDENT">{m.label_student() || 'Elèves'}</option>
              <option value="UNIVERSITY_STUDENT">
                {m.label_universityStudent() || 'Etudiants'}
              </option>
            </FormItem>
          </div>
        </div>
      </FormSection>

      {/* Mottos & Vision */}
      <FormSection
        title={m.label_schoolMottoInfo()}
        description={m.label_schoolMottoInfoDesc()}
        icon={<Languages size={20} />}
        color="#ff9f43"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormItem
            name="motto"
            label={m.label_motto()}
            control={control}
            required
            prepend={<Flag size={14} />}
          />
          <FormItem
            name="motto2"
            label={m.label_motto2()}
            control={control}
            required
            prepend={<Flag size={14} />}
          />
        </div>
      </FormSection>

      {/* Communications & Contacts */}
      <FormSection
        title={m.label_schoolContactInfo()}
        description={m.label_schoolContactInfoDesc()}
        icon={<Phone size={20} />}
        color="#28c76f"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5">
          <div className="md:col-span-8">
            <FormItem
              name="webSite"
              label={m.label_webSite()}
              placeholder={m.label_webSitePlaceholder()}
              control={control}
              prepend={<Globe size={14} />}
            />
          </div>
          <div className="md:col-span-4">
            <FormItem
              name="contactInfo.email"
              label={m.label_email()}
              control={control}
              prepend={<Mail size={14} />}
            />
          </div>

          <div className="md:col-span-4">
            <PhoneInput
              name="contactInfo.telephone"
              label={m.label_telephone()}
              control={control}
            />
          </div>
          <div className="md:col-span-4">
            <PhoneInput
              name="contactInfo.mobile"
              label={m.label_mobileTelephone()}
              control={control}
            />
          </div>
          <div className="md:col-span-2">
            <FormItem
              name="contactInfo.fax"
              label={m.label_fax()}
              control={control}
            />
          </div>
          <div className="md:col-span-2">
            <FormItem
              name="contactInfo.postOfficeBox"
              label={m.label_postOfficeBox()}
              control={control}
            />
          </div>
        </div>
      </FormSection>

      {/* Location Section */}
      <FormSection
        title={m.label_schoolAddressInfo()}
        description={m.label_schoolAddressInfoDesc()}
        icon={<MapPin size={20} />}
        color="#00cfe8"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5">
          <div className="md:col-span-2">
            <FormItem
              name="address.zipCode"
              label={m.label_zipCode()}
              control={control}
            />
          </div>
          <div className="md:col-span-5">
            <FormItem
              name="address.country"
              label={m.label_country()}
              control={control}
            />
          </div>
          <div className="md:col-span-5">
            <FormItem
              name="address.state"
              label={m.label_state()}
              control={control}
            />
          </div>

          <div className="md:col-span-6">
            <FormItem
              name="address.town"
              label={m.label_town()}
              control={control}
              required
              prepend={<Building size={14} />}
            />
          </div>
          <div className="md:col-span-6">
            <FormItem
              name="venue"
              label={m.label_venue()}
              control={control}
              prepend={<MapPin size={14} />}
            />
          </div>

          <div className="md:col-span-12">
            <FormItem
              name="address.street"
              label={m.label_address()}
              control={control}
              prepend={<Navigation size={14} />}
            />
          </div>
          <div className="md:col-span-12">
            <FormItem
              name="signingAddress"
              label={m.label_signingAddress()}
              control={control}
            />
          </div>
        </div>
      </FormSection>

      {/* Administrative & Legal */}
      <FormSection
        title={m.label_schoolLegalInfo()}
        description={m.label_schoolLegalInfoDesc()}
        icon={<Briefcase size={20} />}
        color="#ea5455"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5">
          <div className="md:col-span-4">
            <FormItem
              name="legalInfo.legalForm"
              label={m.label_legalForm()}
              control={control}
            />
          </div>
          <div className="md:col-span-4">
            <FormItem
              name="legalInfo.taxpayerNumber"
              label={m.label_taxPayerNumber()}
              control={control}
              prepend={<CreditCard size={14} />}
            />
          </div>
          <div className="md:col-span-4">
            <FormItem
              name="legalInfo.tradeRegister"
              label={m.label_tradeRegister()}
              control={control}
            />
          </div>

          <div className="md:col-span-4">
            <FormItem
              name="legalInfo.shareCapital"
              label={m.label_shareCapital()}
              control={control}
              type="number"
            />
          </div>
          <div className="md:col-span-4">
            <FormItem
              name="authNumber"
              label={m.label_authNumber()}
              control={control}
              prepend={<FileSignature size={14} />}
            />
          </div>
          <div className="md:col-span-4">
            <FormItem
              name="nsifNumber"
              label={m.label_nsifNumber()}
              control={control}
            />
          </div>

          <div className="md:col-span-6">
            <DatePicker
              name="creationDate"
              label={m.label_creationDate()}
              control={control}
              showIcon
            />
          </div>
          <div className="md:col-span-6">
            <FormItem
              name="logo"
              label={m.label_logo()}
              control={control}
              prepend={<ImageIcon size={14} />}
            />
          </div>
        </div>
      </FormSection>

      {/* Status */}
      <FormSection className="mb-4">
        <ToggleOption
          icon={<CheckCircle size={20} />}
          title={m.label_active()}
          description={m.label_schoolActiveDesc()}
          isActive={isActive}
        >
          <Switch
            name="active"
            control={control}
            defaultChecked={getValues('active')}
            label=""
          />
        </ToggleOption>
      </FormSection>

      <StickyActions>
        <div className="flex justify-end">
          <Button
            loading={props.loading}
            color="primary"
            className="round text-sm flex gap-1 items-center px-2 py-1"
          >
            <Check size={16} />
            {m.label_save()}
          </Button>
        </div>
      </StickyActions>
    </Form>
  )
}

export default SchoolForm
