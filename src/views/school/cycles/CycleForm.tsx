import type { FC } from 'react'
import { Form } from 'reactstrap'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  School,
  Repeat,
  Calendar,
  Grid,
  Hash,
  Type,
  Layers,
} from 'lucide-react'

import { default as FormItem } from '@/@core/components/ui/forms/input'
import type { CycleType } from '@/views/school/cycles/Cycle.Type'
import { useAuthentication } from '@/hooks/useAuthentication'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import {
  schoolSectionOptions,
  schoolYearOptions,
} from '@/utils/select/selectComponents'
import SchoolYearAdd from '@/views/school/schoolYears/SchoolYearAdd'
import SchoolSectionAdd from '@/views/school/schoolSections/SchoolSectionAdd'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { cycleValidationSchema } from '@/views/school/cycles/cycle.validation'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  SchoolSectionCreatedDocument,
  SchoolYearCreatedDocument,
  useSchoolSectionsQuery,
  useSchoolYearsQuery,
} from '@/gql/graphql'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'

interface CycleFormProps extends BaseFormProps {
  cycle?: CycleType
  modal?: NiceModalHandler
  loading: boolean
}

const initialValues: Partial<CycleType> = {
  numberOrder: undefined,
  name: '',
  name2: '',
  levelCount: undefined,
  schoolSection: undefined,
  schoolYear: undefined,
}

const CycleForm: FC<CycleFormProps> = ({ cycle, action, modal, ...props }) => {
  // ** Hooks
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useSchoolYearsQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataSection,
    loading: loadingSection,
    subscribeToMore: subscribeToMoreSection,
  } = useSchoolSectionsQuery({
    variables: { id: enterpriseId },
  })

  const {
    control,
    setValue,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<CycleType>({
    defaultValues: {
      numberOrder: cycle?.numberOrder || '',
      name: cycle?.name || '',
      name2: cycle?.name2 || '',
      levelCount: cycle?.levelCount || '',
      schoolYearId: cycle ? cycle.schoolYear : null,
      schoolSectionId: cycle ? cycle.schoolSection : null,
    },
    resolver: yupResolver(cycleValidationSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = cycle ? Number(cycle.id) : undefined

      action({
        variables: {
          cycle: {
            ...values,
            id,
            schoolYearId: Number(values.schoolYearId.id),
            schoolSectionId: Number(values.schoolSectionId.id),
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(`Cycle ${data.cycle.name} enregistrée`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('cycle', data.cycle)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter le cycle: ${formatError(error)}`)
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="space-y-6">
      {/* School Information Section */}
      <FormSection
        icon={<School className="w-5 h-5" />}
        title="Informations de l'école"
        description="Année scolaire et section"
        color="#7367f0"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LiveView
              document={SchoolYearCreatedDocument}
              singleVar="schoolYear"
              data={data}
              loading={loading}
              listVar="schoolYears"
              subscribeToMore={subscribeToMore}
              sortField="label"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ schoolYears }) => (
                <ControlledSelect
                  name="schoolYearId"
                  label={t('label-schoolYear')}
                  control={control}
                  loading={loading}
                  onChange={(val) => setValue('schoolYearId', val)}
                  options={schoolYears || undefined}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.id}
                  components={{ Option: schoolYearOptions }}
                  form={<SchoolYearAdd />}
                  formId="schoolYear"
                  optionLabel="label"
                  formTitle={t('action.add_schoolYear')}
                  prepend={<Calendar size={16} />}
                />
              )}
            </LiveView>

            <LiveView
              document={SchoolSectionCreatedDocument}
              singleVar="schoolSection"
              data={dataSection}
              loading={loadingSection}
              listVar="schoolSections"
              subscribeToMore={subscribeToMoreSection}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ schoolSections }) => (
                <ControlledSelect
                  name="schoolSectionId"
                  label={t('label-schoolSection')}
                  control={control}
                  loading={loadingSection}
                  onChange={(val) => setValue('schoolSectionId', val)}
                  options={schoolSections || undefined}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  components={{ Option: schoolSectionOptions }}
                  form={<SchoolSectionAdd />}
                  formId="schoolSection"
                  optionLabel="name"
                  formTitle={t('action.add_schoolSection')}
                  prepend={<Grid size={16} />}
                />
              )}
            </LiveView>
          </div>
        </div>
      </FormSection>

      {/* Cycle Details Section */}
      <FormSection
        icon={<Repeat className="w-5 h-5" />}
        title="Détails du cycle"
        description="Nom et ordre du cycle"
        color="#28c76f"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <FormItem
              name="numberOrder"
              label={t('label-numberOrder')}
              control={control}
              required
              prepend={<Hash size={16} />}
            />

            <FormItem
              name="name"
              label={t('label-designation')}
              control={control}
              required
              prepend={<Type size={16} />}
            />

            <FormItem
              name="name2"
              label={t('label-designation2')}
              control={control}
              prepend={<Type size={16} />}
            />

            <FormItem
              name="levelCount"
              label={t('label-levelCount')}
              control={control}
              prepend={<Layers size={16} />}
            />
          </div>
        </div>
      </FormSection>

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

export default CycleForm
