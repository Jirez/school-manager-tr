import type { FC } from 'react'
import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Layers, Hash, FileText } from 'react-feather'

import { useAuthentication } from '@/hooks/useAuthentication'
import type { LevelType } from '@/views/school/levels/Level.type'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import CycleAdd from '@/views/school/cycles/CycleAdd'
import { cycleOptions } from '@/utils/select/selectComponents'
import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { yupResolver } from '@hookform/resolvers/yup'
import { levelValidationSchema } from '@/views/school/levels/level.validation'
import { TOAST_OPTIONS } from '@/utils/constants'
import { CycleCreatedDocument, useCyclesQuery } from '@/gql/graphql'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'

interface LevelFormProps extends BaseFormProps {
  level?: LevelType
  modal?: NiceModalHandler
}

const initialValues: Partial<LevelType> = {
  numberOrder: undefined,
  name: '',
  cycleId: null,
  note: '',
}

const LevelForm: FC<LevelFormProps> = ({ level, modal, action, ...props }) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useCyclesQuery({
    variables: { id: enterpriseId },
  })

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty },
  } = useForm<LevelType>({
    defaultValues: {
      numberOrder: level?.numberOrder || '',
      name: level?.name || '',
      note: level?.note || '',
      cycleId: level ? level.cycle : null,
      branchCount: level?.branchCount || '',
    },
    resolver: yupResolver(levelValidationSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = level ? Number(level.id) : undefined

      action({
        variables: {
          level: {
            ...values,
            id,
            cycleId: Number(values.cycleId.id),
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(`Niveau ${data.level.name} enregistré`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('level', data.level)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter le niveau: ${formatError(error)}`)
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="space-y-6">
      {/* Basic Information Section */}
      <FormSection
        icon={<Layers className="w-5 h-5" />}
        title="Informations de base"
        description="Cycle d'appartenance du niveau"
        color="#7367f0"
      >
        <div className="space-y-4">
          <LiveView
            document={CycleCreatedDocument}
            singleVar="cycle"
            data={data}
            loading={loading}
            listVar="cycles"
            subscribeToMore={subscribeToMore}
            sortField="name"
            triggerUpdate={true}
            enterpriseId={enterpriseId}
          >
            {({ cycles }) => (
              <ControlledSelect
                name="cycleId"
                label={t('label-cycle')}
                control={control}
                loading={loading}
                required={true}
                onChange={(val) => setValue('cycleId', val)}
                options={cycles || undefined}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                components={{ Option: cycleOptions }}
                form={<CycleAdd />}
                formId="cycle"
                optionLabel="name"
                formTitle={t('action.add_cycle')}
                prepend={<Layers size={16} />}
              />
            )}
          </LiveView>
        </div>
      </FormSection>

      {/* Level Details Section */}
      <FormSection
        icon={<Hash className="w-5 h-5" />}
        title="Détails du niveau"
        description="Informations d'identification du niveau"
        color="#28c76f"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <Input
              name="numberOrder"
              label={t('label-numberOrder')}
              control={control}
              required={true}
              type="number"
              prepend={<Hash size={16} />}
            />

            <Input
              name="name"
              label={t('label-name')}
              control={control}
              required={true}
              prepend={<FileText size={16} />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <Input
              name="branchCount"
              label={t('label-branchCount')}
              control={control}
              type="number"
              prepend={<Hash size={16} />}
            />
          </div>
        </div>
      </FormSection>

      {/* Additional Information Section */}
      <FormSection
        icon={<FileText className="w-5 h-5" />}
        title="Informations complémentaires"
        description="Notes et remarques sur le niveau"
        color="#00cfe8"
      >
        <div className="space-y-4">
          <Input
            name="note"
            label={''}
            control={control}
            type="textarea"
            prepend={<FileText size={16} />}
          />
        </div>
      </FormSection>

      {/* Action Buttons */}
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

export default LevelForm
