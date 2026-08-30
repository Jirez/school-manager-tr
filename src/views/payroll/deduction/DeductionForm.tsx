import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Tag,
  Hash,
  Type,
  Calculator,
  CheckCircle,
  FileText,
  Settings,
} from 'lucide-react'

import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Input from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'
import { useAuthentication } from '@/hooks/useAuthentication'
import { TOAST_OPTIONS } from '@/utils/constants'
import { formatError } from '@/utils/ErrorHelper'
import { messageService } from '@/utils/message.service'
import {
  DeductionCategoryCreatedDocument,
  useDeductionCategoryQuery,
} from '@/gql/graphql'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { useEffect } from 'react'
import type { DeductionType } from './deduction.type'
import { deductionValidation } from './deduction.validation'
import DeductionCategoryAdd from './category/DeductionCategoryAdd'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'

interface FormProps extends BaseFormProps {
  deduction?: DeductionType
  modal?: NiceModalHandler
}

const DeductionForm: React.FC<FormProps> = ({
  deduction,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useDeductionCategoryQuery({
    variables: { id: enterpriseId },
  })

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isDirty },
    reset,
    setValue,
    watch,
  } = useForm<DeductionType>({
    defaultValues: {
      name: deduction?.name || '',
      description: deduction?.description || '',
      active: deduction ? deduction.active : true,
      categoryId: deduction ? deduction.category : null,
      calculationType: deduction ? deduction.calculationType : null,
      code: deduction ? deduction.code : null,
    },
    //@ts-ignore
    resolver: yupResolver(deductionValidation),
  })

  const onSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = deduction ? Number(deduction.id) : undefined

      action({
        variables: {
          deduction: {
            id: id,
            name: values.name,
            active: values.active,
            description: values.description,
            enterpriseId,
            categoryId: values.categoryId ? Number(values.categoryId.id) : null,
            calculationType: values.calculationType,
            code: values.code ? values.code : null,
          },
        },
      })
        .then(async ({ data }) => {
          reset()
          toast.success(`Déduction ${data.deduction.name} ajoutée`, {
            ...TOAST_OPTIONS,
          })
          if (close) {
            modal?.hide()
          }

          if (props.popover) {
            messageService.sendMessage('deduction', data.deduction)
            props.onModalClose?.()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter la déduction ${formatError(error)}`)
        })
    })(event)
  }

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'deductionCategory') {
          setValue('categoryId', message.value)
        }
      }
    })
  }, [messageService])

  return (
    <Form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-x-1 gap-y-1">
        <FormSection
          title={t('label-deductionInfo') || 'Informations de la déduction'}
          description={
            t('label-deductionInfoDesc') || 'Détails de base et calcul'
          }
          icon={<Settings size={18} />}
          color="#7367f0"
        >
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <Input
                name="code"
                control={control}
                label={t('label-code')}
                prepend={<Hash size={16} />}
              />
              <Input
                name="name"
                control={control}
                label={t('label-name')}
                required
                prepend={<Type size={16} />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <LiveView
                document={DeductionCategoryCreatedDocument}
                subscribeToMore={subscribeToMore}
                data={data}
                listVar="deductionCategories"
                singleVar="deductionCategory"
                loading={loading}
                enterpriseId={enterpriseId}
              >
                {({ deductionCategories }) => (
                  <ControlledSelect
                    control={control}
                    name="categoryId"
                    label={t('label-deductionCategory')}
                    required
                    prepend={<Tag size={16} />}
                    options={deductionCategories || []}
                    onChange={(val) => setValue('categoryId', val)}
                    getOptionLabel={(o) => o.name}
                    getOptionValue={(o) => o.id}
                    className="w-full"
                    formId="category"
                    form={<DeductionCategoryAdd />}
                    optionLabel="name"
                    formTitle={t('action.add_deductionCategory')}
                    modalClassName="modal-md"
                  />
                )}
              </LiveView>

              <Input
                name="calculationType"
                control={control}
                label={t('label-calculationType')}
                type="select"
                className="w-full"
                prepend={<Calculator size={16} />}
                required
              >
                <option value="">{t('label-select')}</option>
                <option value="AMOUNT">{t('AMOUNT')}</option>
                <option value="PERCENTAGE">{t('PERCENTAGE')}</option>
              </Input>
            </div>
          </div>
        </FormSection>

        <div className="flex flex-col gap-1">
          <FormSection
            title={t('label-active') || 'Statut'}
            description={
              t('label-activeDesc') || 'Disponibilité de la déduction'
            }
            icon={<CheckCircle size={18} />}
            color="#28c76f"
          >
            <ToggleOption
              icon={<CheckCircle size={16} />}
              title={t('label-active')}
              description={t('label-activeDesc') || 'Déduction activée'}
              isActive={watch('active')}
            >
              <Switch
                name="active"
                control={control}
                label=""
                defaultChecked={getValues('active')}
                onChange={(e: any) =>
                  setValue('active', e.target.checked, { shouldDirty: true })
                }
              />
            </ToggleOption>
          </FormSection>

          <FormSection
            title={t('label-additionalInfo') || 'Informations complémentaires'}
            description={t('label-additionalInfoDesc') || 'Détails optionnels'}
            icon={<FileText size={18} />}
            color="#ff9f43"
          >
            <div className="">
              <Input
                name="description"
                control={control}
                label={t('label-description')}
                type="textarea"
                rows={3}
                prepend={<FileText size={16} />}
              />
            </div>
          </FormSection>
        </div>
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

export default DeductionForm
