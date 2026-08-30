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
  ShieldCheck,
  Clock,
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
  EarningCategoryCreatedDocument,
  useEarningCategoryQuery,
} from '@/gql/graphql'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { useEffect } from 'react'
import type { EarningType } from './earning.type'
import { earningValidation } from './earning.validation'
import EarningCategoryAdd from './category/EarningCategoryAdd'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'

interface FormProps extends BaseFormProps {
  earning?: EarningType
  modal?: NiceModalHandler
}

const EarningForm: React.FC<FormProps> = ({
  earning,
  modal,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useEarningCategoryQuery({
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
  } = useForm<EarningType>({
    defaultValues: {
      name: earning?.name || '',
      description: earning?.description || '',
      active: earning ? earning.active : true,
      isTaxable: earning ? earning.isTaxable : false,
      isOvertime: earning ? earning.isOvertime : false,
      categoryId: earning ? earning.category : null,
      calculationType: earning ? earning.calculationType : null,
      code: earning ? earning.code : null,
    },
    //@ts-ignore
    resolver: yupResolver(earningValidation),
  })

  const onSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = earning ? Number(earning.id) : undefined

      action({
        variables: {
          earning: {
            id: id,
            name: values.name,
            active: values.active,
            description: values.description,
            enterpriseId,
            categoryId: values.categoryId ? Number(values.categoryId.id) : null,
            code: values.code ? values.code : null,
            calculationType: values.calculationType,
            isTaxable: values.isTaxable,
            isOvertime: values.isOvertime,
          },
        },
      })
        .then(async ({ data }) => {
          reset()
          toast.success(`Gain ${data.earning.name} ajoutée`, {
            ...TOAST_OPTIONS,
          })
          if (close) {
            modal?.hide()
          }

          if (props.popover) {
            messageService.sendMessage('earning', data.earning)
            props.onModalClose?.()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter le gain ${formatError(error)}`)
        })
    })(event)
  }

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'earningCategory') {
          setValue('categoryId', message.value)
        }
      }
    })
  }, [messageService])

  return (
    <Form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-x-1 gap-y-1">
        <FormSection
          title={t('label-earningInfo') || 'Informations du gain'}
          description={
            t('label-earningInfoDesc') || 'Détails de base et calcul'
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
                document={EarningCategoryCreatedDocument}
                subscribeToMore={subscribeToMore}
                data={data}
                listVar="earningCategories"
                singleVar="earningCategory"
                loading={loading}
                enterpriseId={enterpriseId}
              >
                {({ earningCategories }) => (
                  <ControlledSelect
                    control={control}
                    name="categoryId"
                    label={t('label-earningCategory')}
                    required
                    prepend={<Tag size={16} />}
                    options={earningCategories || []}
                    onChange={(val) => setValue('categoryId', val)}
                    getOptionLabel={(o) => o.name}
                    getOptionValue={(o) => o.id}
                    className="w-full"
                    formId="category"
                    form={<EarningCategoryAdd />}
                    optionLabel="name"
                    formTitle={t('action.add_earningCategory')}
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

        <FormSection
          title={t('label-earningSettings') || 'Paramètres du gain'}
          description={
            t('label-earningSettingsDesc') || 'Options de configuration'
          }
          icon={<ShieldCheck size={18} />}
          color="#28c76f"
        >
          <div className="space-y-2">
            <ToggleOption
              icon={<CheckCircle size={16} />}
              title={t('label-active')}
              description={t('label-activeDesc') || 'Gain activé'}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <ToggleOption
                icon={<ShieldCheck size={16} />}
                title={t('label-taxable')}
                description={t('label-taxableDesc') || "Gain soumis à l'impôt"}
                isActive={watch('isTaxable')}
              >
                <Switch
                  name="isTaxable"
                  control={control}
                  label=""
                  defaultChecked={getValues('isTaxable')}
                  onChange={(e: any) =>
                    setValue('isTaxable', e.target.checked, {
                      shouldDirty: true,
                    })
                  }
                />
              </ToggleOption>

              <ToggleOption
                icon={<Clock size={16} />}
                title={t('label-isOvertime')}
                description={
                  t('label-isOvertimeDesc') || 'Heures supplémentaires'
                }
                isActive={watch('isOvertime')}
              >
                <Switch
                  name="isOvertime"
                  control={control}
                  label=""
                  defaultChecked={getValues('isOvertime')}
                  onChange={(e: any) =>
                    setValue('isOvertime', e.target.checked, {
                      shouldDirty: true,
                    })
                  }
                />
              </ToggleOption>
            </div>
          </div>
        </FormSection>

        <FormSection
          title={t('label-additionalInfo') || 'Informations complémentaires'}
          description={t('label-additionalInfoDesc') || 'Détails optionnels'}
          icon={<FileText size={18} />}
          color="#ff9f43"
          className="col-span-full"
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

export default EarningForm
