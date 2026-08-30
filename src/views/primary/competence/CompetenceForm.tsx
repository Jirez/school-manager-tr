import type { FC } from 'react'
import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Layers, Hash, FileText, Award, CheckCircle } from 'lucide-react'

import { useAuthentication } from '@/hooks/useAuthentication'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { levelOptions } from '@/utils/select/selectComponents'
import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { yupResolver } from '@hookform/resolvers/yup'
import { TOAST_OPTIONS } from '@/utils/constants'
import { LevelCreatedDocument, useLevelsQuery } from '@/gql/graphql'
import type { CompetenceType } from './competence.type'
import { competenceValidation } from './competence.validation'
import LevelAdd from '@/views/school/levels/LevelAdd'
import Switch from '@/@core/components/ui/forms/swith'

interface LevelFormProps extends BaseFormProps {
  competence?: CompetenceType
  modal?: NiceModalHandler
}

const initialValues: Partial<CompetenceType> = {
  numberOrder: undefined,
  name: '',
  levelId: undefined,
  description: '',
  marks: undefined,
}

const CompetenceForm: FC<LevelFormProps> = ({
  competence,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useLevelsQuery({
    variables: { id: enterpriseId },
  })

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty },
    getValues,
    watch,
  } = useForm<CompetenceType>({
    defaultValues: {
      numberOrder: competence?.numberOrder || undefined,
      name: competence?.name || '',
      description: competence?.description || '',
      levelId: competence ? competence.level : null,
      marks: competence?.marks || undefined,
      active: competence ? competence.active : true,
    },
    resolver: yupResolver(competenceValidation),
    mode: 'onBlur',
  })

  const isActive = watch('active')

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = competence ? Number(competence.id) : undefined

      action({
        variables: {
          competence: {
            ...values,
            id,
            levelId: Number(values.levelId.id),
            schoolId: enterpriseId,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(
            t('toast-competenceSaved', { name: data.competence.name }) ||
              `Compétence ${data.competence.name} enregistré`,
            {
              ...TOAST_OPTIONS,
            },
          )

          if (props.popover) {
            messageService.sendMessage('competence', data.competence)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            t('toast-competenceSaveError', { error: formatError(error) }) ||
              `Impossible d'ajouter la compétence: ${formatError(error)}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="space-y-1">
      <FormSection
        title={t('label-levelInfo')}
        description={t(
          'label-competenceLevelInfoDesc',
          'Associate this competence with an academic level',
        )}
        icon={<Layers size={20} />}
        color="#7367f0"
      >
        <LiveView
          document={LevelCreatedDocument}
          singleVar="level"
          data={data}
          loading={loading}
          listVar="levels"
          subscribeToMore={subscribeToMore}
          sortField="name"
          triggerUpdate={true}
          enterpriseId={enterpriseId}
        >
          {({ levels }) => (
            <ControlledSelect
              name="levelId"
              label={t('label-level')}
              control={control}
              loading={loading}
              onChange={(val) => setValue('levelId', val)}
              options={levels || undefined}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              components={{ Option: levelOptions }}
              form={<LevelAdd />}
              formId="level"
              optionLabel="name"
              formTitle={t('action.add_level')}
            />
          )}
        </LiveView>
      </FormSection>

      <FormSection
        title={t('label-competenceInfo')}
        description={
          t('label-competenceInfoDesc') ||
          'Define the name, order, and marks for this competence'
        }
        icon={<Award size={20} />}
        color="#28c76f"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-1">
          <Input
            name="numberOrder"
            label={t('label-numberOrder')}
            control={control}
            required={true}
            type="number"
            prepend={<Hash size={14} />}
            className="col-span-4"
          />

          <Input
            name="name"
            label={t('label-name')}
            control={control}
            required={true}
            prepend={<FileText size={14} />}
            className="col-span-8"
          />

          <Input
            name="marks"
            label={t('label-marks')}
            control={control}
            required={true}
            type="number"
            prepend={<Award size={14} />}
            className="col-span-12"
          />

          <Input
            name="description"
            label={t('label-description')}
            control={control}
            type="textarea"
            placeholder={t('label-enterDescription')}
            className="col-span-12"
          />
        </div>
      </FormSection>

      <FormSection
        title={t('label-status')}
        description={
          t('label-competenceStatusDesc') || 'Enable or disable this competence'
        }
        icon={<CheckCircle size={20} />}
        color="#ea5455"
      >
        <ToggleOption
          icon={<CheckCircle size={20} />}
          title={t('label-active')}
          description={
            t('label-competenceActiveDesc') ||
            'Allow use of this competence in evaluations'
          }
          isActive={isActive}
        >
          <Switch
            name="active"
            label=""
            control={control}
            defaultChecked={getValues('active')}
          />
        </ToggleOption>
      </FormSection>

      <ActionButtons
        cancelAction={modal?.hide}
        isSubmitting={props.loading}
        popover={props.popover}
        dirty={isDirty}
        onSubmit={onSubmit}
      />
    </Form>
  )
}

export default CompetenceForm
