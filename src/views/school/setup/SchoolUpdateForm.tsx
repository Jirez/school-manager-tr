import React from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form } from 'reactstrap'
import { toast } from 'react-toastify'
import {
  Building,
  FileText,
  Quote,
  Tags,
  MapPin,
  Phone,
  Mail,
  School,
  IdCard,
  Hash,
} from 'lucide-react'

import Input from '@/@core/components/ui/forms/input'
import { useAuthentication } from '@/hooks/useAuthentication'
import { yupResolver } from '@hookform/resolvers/yup'
import { schoolSetupValidationSchema } from './school.update.validation'
import { formatError } from '@/utils/ErrorHelper'
import WizardButtons from './WizardButtons'
import { TOAST_OPTIONS } from '@/utils/constants'
import { useSchoolUpdateMutation } from '@/gql/graphql'
import FormSection from '@/@core/components/ui/forms/form-section'

interface Props {
  stepper: any
}

interface FormProps {
  name2: string
  name: string
  motto: string
  motto2: string
  town: string
  postOfficeBox?: string
  registrationNumber?: string
  schoolCode: string
  telephone?: string
  schoolType: string
  schoolCategory: string
  studentType: string
}

const SchoolUpdateForm: React.FC<Props> = ({ stepper }) => {
  const { t } = useTranslation()
  const { enterprise, enterpriseId, schoolCategory } = useAuthentication()

  const [updateSchool, { loading }] = useSchoolUpdateMutation()

  const { control, handleSubmit } = useForm<FormProps>({
    defaultValues: {
      name: enterprise!,
      name2: '',
      motto: '',
      motto2: '',
      town: '',
      postOfficeBox: '',
      registrationNumber: '',
      schoolCode: '',
      schoolType: '',
      schoolCategory: schoolCategory!,
      studentType: '',
      telephone: '',
    },
    resolver: yupResolver(schoolSetupValidationSchema),
  })

  const onSubmit: SubmitHandler<FormProps> = (values) => {
    updateSchool({
      variables: {
        school: {
          ...values,
          id: enterpriseId,
          schoolCategory: values.schoolCategory as any,
          schoolType: values.schoolType as any,
          studentType: values.studentType as any,
        },
      },
    })
      .then((data) => {
        toast.success(t('action.saveComplete').toString(), {
          ...TOAST_OPTIONS,
        })
        stepper.next()
      })
      .catch((error) => {
        toast.error(`${t('action.saveError')}: ${formatError(error)}`)
      })
  }

  return (
    <React.Fragment>
      <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-x-2 gap-y-1">
          {/* Identification Section */}
          <FormSection
            title={t('label-identification') || 'Identification'}
            description={
              t('label-identificationDesc') ||
              "Informations légales de l'établissement"
            }
            icon={<IdCard size={18} />}
            color="#7367f0"
          >
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <Input
                  name="name"
                  label={t('label-name')}
                  control={control}
                  required
                  prepend={<Building size={16} />}
                />

                <Input
                  name="name2"
                  label={t('label-name2')}
                  control={control}
                  required
                  prepend={<Building size={16} />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <Input
                  name="schoolCode"
                  label={t('label-schoolCode')}
                  control={control}
                  required
                  prepend={<Hash size={16} />}
                />

                <Input
                  name="registrationNumber"
                  label={t('label-registrationNumber')}
                  control={control}
                  prepend={<FileText size={16} />}
                />
              </div>
            </div>
          </FormSection>

          {/* Motto Section */}
          <FormSection
            title={t('label-mottoAndSlogan') || 'Devise et Slogan'}
            description={
              t('label-mottoAndSloganDesc') || "Valeurs et identité de l'école"
            }
            icon={<Quote size={18} />}
            color="#ff9f43"
          >
            <div className="space-y-3">
              <Input
                name="motto"
                label={t('label-motto')}
                control={control}
                required
                prepend={<Quote size={16} />}
              />

              <Input
                name="motto2"
                label={t('label-motto2')}
                control={control}
                required
                prepend={<Quote size={16} />}
              />
            </div>
          </FormSection>

          {/* Classification Section */}
          <FormSection
            title={t('label-classification') || 'Classification'}
            description={
              t('label-classificationDesc') || 'Type, catégorie et public cible'
            }
            icon={<Tags size={18} />}
            color="#28c76f"
          >
            <div className="space-y-3">
              <Input
                type="select"
                control={control}
                name="schoolType"
                required
                label={t('label-schoolType')}
                prepend={<School size={16} />}
              >
                <option value="">{t('label-select')}</option>
                <option value="PUBLIC">{t('label-public')}</option>
                <option value="PRIVATE">{t('label-private')}</option>
              </Input>

              <Input
                type="select"
                control={control}
                name="schoolCategory"
                required
                label={t('label-schoolCategory')}
                prepend={<Tags size={16} />}
              >
                <option value="">{t('label-select')}</option>
                <option value="PRIMARY_SCHOOL">
                  {t('label-primarySchool')}
                </option>
                <option value="ENGLISH_PRIMARY_SCHOOL">
                  {t('label-englishPrimarySchool')}
                </option>
                <option value="BILINGUAL_PRIMARY_SCHOOL">
                  {t('label-bilingualPrimarySchool')}
                </option>
                <option value="HIGH_SCHOOL">{t('label-highSchool')}</option>
                <option value="ENGLISH_HIGH_SCHOOL">
                  {t('label-englishHighSchool')}
                </option>
                <option value="BILINGUAL_HIGH_SCHOOL">
                  {t('label-bilingualHighSchool')}
                </option>
                <option value="CETIC">CETIC</option>
                <option value="TECHNICAL_HIGH_SCHOOL">
                  {t('label-technicalHighSchool')}
                </option>
                <option value="COLLEGE">{t('label-college')}</option>
                <option value="UNIVERSITY">{t('label-university')}</option>
              </Input>

              <Input
                type="select"
                control={control}
                name="studentType"
                required
                label={t('label-studentType')}
                prepend={<FileText size={16} />}
              >
                <option value="">{t('label-select')}</option>
                <option value="PUPIL">Ecoliers</option>
                <option value="STUDENT">Elèves</option>
                <option value="UNIVERSITY_STUDENT">Etudiants</option>
              </Input>
            </div>
          </FormSection>

          {/* Contact Info Section */}
          <FormSection
            title={t('label-contactInformation') || 'Informations de contact'}
            description={
              t('label-contactInformationDesc') ||
              'Localisation et moyens de communication'
            }
            icon={<Phone size={18} />}
            color="#00cfe8"
          >
            <div className="space-y-3">
              <Input
                name="town"
                label={t('label-town')}
                control={control}
                required
                prepend={<MapPin size={16} />}
              />

              <Input
                name="telephone"
                label={t('label-telephone')}
                control={control}
                prepend={<Phone size={16} />}
              />

              <Input
                name="postOfficeBox"
                label={t('label-postOfficeBox')}
                control={control}
                prepend={<Mail size={16} />}
              />
            </div>
          </FormSection>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <WizardButtons loading={loading} />
        </div>
      </Form>
    </React.Fragment>
  )
}

export default SchoolUpdateForm
