import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form } from 'reactstrap'
import * as yup from 'yup'

import { useAuthentication } from '@/hooks/useAuthentication'
import type { CouncilDecisionType } from './CouncilDecision.type'
import { toast } from 'react-toastify'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { yupResolver } from '@hookform/resolvers/yup'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { emptyStringToNull } from '@/utils/helpers'
import { TOAST_OPTIONS } from '@/utils/constants'
import { Gavel, Hash, Type, FileText, List } from 'lucide-react'
import { default as FormItem } from '@/@core/components/ui/forms/input'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'

interface CouncilDecisionFormProps extends BaseFormProps {
  councilDecision?: CouncilDecisionType
  modal?: NiceModalHandler
}

const initialValues: Partial<CouncilDecisionType> = {
  code: '',
  name: '',
  decisionType: '',
  note: '',
}

const CouncilDecisionForm: React.FC<CouncilDecisionFormProps> = ({
  councilDecision,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<CouncilDecisionType>({
    defaultValues: {
      code: councilDecision?.code || '',
      name: councilDecision?.name || '',
      decisionType: councilDecision?.decisionType || '',
      note: councilDecision?.note || '',
    },
    resolver: yupResolver(
      yup.object({
        code: yup.string().required(),
        name: yup.string().required(),
        decisionType: yup.string().required(),
        note: yup.string().optional().transform(emptyStringToNull),
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
      const id = councilDecision ? Number(councilDecision.id) : undefined

      action({
        variables: {
          decision: { ...values, id, schoolId: enterpriseId },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(
            `CouncilDecision ${data.councilDecision.name} enregistrée`,
            { ...TOAST_OPTIONS },
          )

          if (props.popover) {
            messageService.sendMessage('councilDecision', data.councilDecision)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter le councilDecision: ${formatError(error)}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="space-y-">
      <FormSection
        icon={<Gavel className="w-5 h-5" />}
        title={t('label-councilDecision') || 'Décision du conseil'}
        description="Type et code de la décision"
        color="#7367f0"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <FormItem
              name="decisionType"
              control={control}
              label={t('label-decisionType')}
              required
              type="select"
              prepend={<List size={16} />}
            >
              <option value="">{t('label-select')}</option>
              <option value="ADMISSIBLE">{t('ADMISSIBLE')}</option>
              <option value="REPEAT">{t('REPEAT')}</option>
              <option value="EXCLUDED">{t('EXCLUDED')}</option>
            </FormItem>

            <FormItem
              name="code"
              control={control}
              label={t('label-code')}
              required
              prepend={<Hash size={16} />}
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        icon={<Type className="w-5 h-5" />}
        title={t('label-details') || 'Détails'}
        description="Nom de la décision"
        color="#28c76f"
      >
        <div className="space-y-4">
          <FormItem
            name="name"
            control={control}
            label={t('label-name')}
            required
            prepend={<Type size={16} />}
          />
        </div>
      </FormSection>

      <FormSection
        icon={<FileText className="w-5 h-5" />}
        title={t('label-note') || 'Notes'}
        description="Informations complémentaires"
        color="#ea5455"
      >
        <div className="space-y-1">
          <FormItem
            name="note"
            control={control}
            label={t('label-note')}
            type="textarea"
            prepend={<FileText size={16} />}
          />
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

export default CouncilDecisionForm
