import { Form } from 'reactstrap'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { useApolloClient } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import {
  Calendar,
  Clock,
  Settings,
  Type,
  ListOrdered,
  Users,
} from 'lucide-react'

import DatePicker from '@/@core/components/ui/forms/date-picker'
import Input from '@/@core/components/ui/forms/input'
import WizardButtons from './WizardButtons'
import { validationSchema } from '@/views/school/schoolYears/SchoolYear.validation'
import { useAuthentication } from '@/hooks/useAuthentication'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'
import { useSchoolYearSetupSaveMutation } from '@/gql/graphql'
import FormSection from '@/@core/components/ui/forms/form-section'

interface Props {
  stepper: any
}

interface FormProps {
  label: string
  label2: string
  periodType: string
  current: boolean
  cycleCount: string | number
  startDate: any
  endDate: any
  ageMin: string
  ageMax: string
}

const SchoolYearSetupForm: React.FC<Props> = ({ stepper }) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const client = useApolloClient()

  const { control, handleSubmit } = useForm<FormProps>({
    defaultValues: {
      label: '',
      label2: '',
      periodType: '',
      current: true,
      cycleCount: '',
      startDate: new Date(),
      endDate: new Date(),
      ageMax: '',
      ageMin: '',
    },
    resolver: yupResolver(validationSchema),
  })

  const [schoolYearSave, { loading }] = useSchoolYearSetupSaveMutation()

  const onSubmit: SubmitHandler<FormProps> = (values) => {
    schoolYearSave({
      variables: {
        schoolYear: {
          ...values,
          startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
          endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
          ageMin: values.ageMin ? Number(values.ageMin) : null,
          ageMax: values.ageMax ? Number(values.ageMax) : null,
          schoolId: enterpriseId,
          //id: 1,
          current: true,
          periodType: values.periodType as any,
        },
      },
    })
      .then(async ({ data }) => {
        toast.success(t('action.saveComplete').toString(), {
          ...TOAST_OPTIONS,
        })
        client.resetStore()
        stepper.next()
      })
      .catch((error) => {
        toast.error(`${t('action.saveError')}: ${formatError(error)}`)
      })
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-1">
          {/* Year Information Section */}
          <FormSection
            title={t('label-schoolYearInfo') || "Informations de l'année"}
            description={
              t('label-schoolYearInfoDesc') ||
              "Désignation et dates de l'année académique"
            }
            icon={<Calendar size={18} />}
            color="#7367f0"
          >
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <Input
                  name="label"
                  label={t('label-designation')}
                  control={control}
                  required
                  prepend={<Type size={16} />}
                  placeholder="Ex: Année scolaire 2025/2026"
                />

                <Input
                  name="label2"
                  label={t('label-designation2')}
                  control={control}
                  required
                  prepend={<Type size={16} />}
                  placeholder="Ex: School Year 2025/2026"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <DatePicker
                  name="startDate"
                  label={t('label-startDate')}
                  control={control}
                  required
                />

                <DatePicker
                  name="endDate"
                  label={t('label-endDate')}
                  control={control}
                  required
                />
              </div>
            </div>
          </FormSection>

          {/* Academic Configuration Section */}
          <FormSection
            title={t('label-academicConfig') || 'Configuration académique'}
            description={
              t('label-academicConfigDesc') ||
              'Type de période et nombre de cycles'
            }
            icon={<Settings size={18} />}
            color="#28c76f"
          >
            <div className="space-y-3">
              <Input
                type="select"
                control={control}
                name="periodType"
                label={t('label-periodType')}
                prepend={<Clock size={16} />}
                required
              >
                <option value="">{t('label-select')}</option>
                <option value="TRIMESTER">{t('label-trimester')}</option>
                <option value="SEMESTER">{t('label-semester')}</option>
              </Input>

              <Input
                name="cycleCount"
                label={t('label-cycleCount')}
                control={control}
                type="number"
                required
                prepend={<ListOrdered size={16} />}
              />
            </div>
          </FormSection>

          {/* Age Requirements Section */}
          <FormSection
            title={t('label-ageRequirements') || "Critères d'âge"}
            description={
              t('label-ageRequirementsDesc') || "Limites d'âge pour les élèves"
            }
            icon={<Users size={18} />}
            color="#ff9f43"
            className="col-span-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Input
                name="ageMin"
                label={t('label-ageMin')}
                control={control}
                type="number"
                prepend={<Users size={16} />}
              />

              <Input
                name="ageMax"
                label={t('label-ageMax')}
                control={control}
                type="number"
                prepend={<Users size={16} />}
              />
            </div>
          </FormSection>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <WizardButtons loading={loading} />
        </div>
      </Form>
    </>
  )
}

export default SchoolYearSetupForm
