import type { FC } from 'react'
import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import { Layers, Hash, FileText } from 'lucide-react'

import { useAuthentication } from '@/hooks/useAuthentication'
import type { LevelType } from '@/views/school/levels/Level.type'
import LiveView from '@/utils/LiveView'
import CycleAdd from '@/views/school/cycles/CycleAdd'
import { cycleOptions } from '@/utils/select/selectComponents'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { levelValidation } from '@/views/school/levels/level.validation'
import type { LevelSchemaType } from '@/views/school/levels/level.validation'
import { TOAST_OPTIONS } from '@/utils/constants'
import { CycleCreatedDocument, useCyclesQuery } from '@/gql/graphql'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { m } from '@/paraglide/messages'

interface LevelFormProps extends BaseFormProps {
  level?: LevelType
  modal?: NiceModalHandler
}

const LevelForm: FC<LevelFormProps> = ({ level, modal, action, ...props }) => {
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useCyclesQuery({
    variables: { id: enterpriseId },
  })

  const {
    handleSubmit,
    AppField,
    reset,
    store,
    AppForm,
    SubmitButton,
    setFieldValue,
  } = useAppForm({
    defaultValues: {
      numberOrder: level?.numberOrder || '',
      name: level?.name || '',
      note: level?.note || '',
      cycleId: level ? level.cycle : null,
      branchCount: level?.branchCount || '',
    } as LevelSchemaType,
    validators: {
      onChange: levelValidation,
    },
    onSubmitMeta: defaultMeta,
    onSubmit({ value, meta }) {
      const id = level ? Number(level.id) : undefined
      const parsed = levelValidation.parse(value)

      action({
        variables: {
          level: {
            ...parsed,
            id,
            cycleId: Number(parsed.cycleId?.id),
          },
        },
      })
        .then(async ({ data }) => {
          reset()
          toast.success(`Niveau ${data.level.name} enregistré`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('level', data.level)
            props.onModalClose?.()
          }
          if (meta.close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter le niveau: ${formatError(error)}`)
        })
    },
  })

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <div className="space-y-4">
        <FormSection
          icon={<Layers className="w-5 h-5" />}
          title={m.label_basicInfo()}
          description={m.label_levelInfo() || "Cycle d'appartenance du niveau"}
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
                <AppField
                  name="cycleId"
                  children={(field) => (
                    <field.ControlledSelect
                      label={m.label_cycle()}
                      required={true}
                      loading={loading}
                      options={cycles || undefined}
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option: any) => option.id}
                      components={{ Option: cycleOptions }}
                      form={<CycleAdd />}
                      formId="cycle"
                      optionLabel="name"
                      formTitle={m.action_add_cycle()}
                      prepend={<Layers size={16} />}
                      onChange={(val: any) => setFieldValue('cycleId', val)}
                    />
                  )}
                />
              )}
            </LiveView>
          </div>
        </FormSection>

        <FormSection
          icon={<Hash className="w-5 h-5" />}
          title={m.label_levelDetails()}
          description={m.label_levelDetailsDesc()}
          color="#28c76f"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <AppField
                name="numberOrder"
                children={(field) => (
                  <field.Input
                    label={m.label_numberOrder()}
                    required={true}
                    type="number"
                    prepend={<Hash size={16} />}
                  />
                )}
              />

              <AppField
                name="name"
                children={(field) => (
                  <field.Input
                    label={m.label_name()}
                    required={true}
                    prepend={<FileText size={16} />}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <AppField
                name="branchCount"
                children={(field) => (
                  <field.Input
                    label={m.label_branchCount()}
                    type="number"
                    prepend={<Hash size={16} />}
                  />
                )}
              />
            </div>
          </div>
        </FormSection>

        <FormSection
          icon={<FileText className="w-5 h-5" />}
          title={m.label_additionalInfo()}
          description={m.label_additionalInfoDesc()}
          color="#00cfe8"
        >
          <div className="space-y-4">
            <AppField
              name="note"
              children={(field) => (
                <field.Input
                  label={m.label_note()}
                  type="textarea"
                  rows={5}
                  prepend={<FileText size={16} />}
                />
              )}
            />
          </div>
        </FormSection>
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

export default LevelForm
