import { useTranslation } from 'react-i18next'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { Form } from 'reactstrap'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  FileText,
  Tag,
  Building2,
  DollarSign,
  Hash,
  User,
  AlignLeft,
} from 'lucide-react'

import { useAuthentication } from '@/hooks/useAuthentication'
import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import type { CashVoucherType } from './cash.voucher.type'
import { cashVoucherValidation } from './cash.voucher.validation'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import dayjs from 'dayjs'
import {
  DepartmentCreatedDocument,
  ExpenseCategoryCreatedDocument,
  useDepartmentsQuery,
  useExpenseCategoriesQuery,
  usePeopleByEnterpriseQuery,
} from '@/gql/graphql'
import LiveView from '@/utils/LiveView'
import ExpenseCategoryAdd from '../category/ExpenseCategoryAdd'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import DepartmentAdd from '@/views/payroll/department/DepartmentAdd'
import { useEffect } from 'react'
import {
  personOptions,
  personSingleValue,
} from '@/utils/select/selectComponents'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import NumericInput from '@/@core/components/ui/forms/numeric-input'

interface FormProps extends BaseFormProps {
  voucher?: CashVoucherType
  modal?: NiceModalHandler
}

const initialValues: Partial<CashVoucherType> = {
  reason: '',
  amount: '',
  date: undefined,
  operator: '',
  categoryId: undefined,
  departmentId: undefined,
  personId: undefined,
}

const CashVoucherForm: React.FC<FormProps> = ({
  voucher,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId, username } = useAuthentication()

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
    setValue,
  } = useForm<CashVoucherType & { amountF: string | number }>({
    defaultValues: {
      reason: voucher?.reason || '',
      amount: voucher?.amount || '',
      amountF: voucher?.amount || '',
      date: voucher ? dayjs(voucher.date).toDate() : null,
      number: voucher?.number || '',
      categoryId: voucher?.category || null,
      departmentId: voucher?.department || null,
      personId: voucher?.person || null,
    },
    //@ts-ignore
    resolver: yupResolver(cashVoucherValidation),
  })

  const {
    data: dataCategory,
    loading: loadingCategory,
    subscribeToMore: subscribeToMoreCategory,
  } = useExpenseCategoriesQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataDepartment,
    loading: loadingDepartment,
    subscribeToMore: subscribeToMoreDepartment,
  } = useDepartmentsQuery({
    variables: { id: enterpriseId },
  })

  const { data, loading } = usePeopleByEnterpriseQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'no-cache',
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = voucher ? Number(voucher.id) : undefined

      action({
        variables: {
          cashVoucher: {
            //...values,
            id,
            enterpriseId,
            date: dayjs(values.date).format(INPUT_DATE_FORMAT),
            operator: username,
            amount: Number(values.amount),
            reason: values.reason,
            categoryId: values.categoryId ? values.categoryId.id : undefined,
            departmentId: values.departmentId
              ? values.departmentId.id
              : undefined,
            personId: values.personId ? values.personId.id : undefined,
            number: values.number || null,
          },
        },
      })
        .then(async ({ data }) => {
          reset(initialValues)
          toast.success(`Bon de caisse ${data.cashVoucher.name} enregistré`, {
            ...TOAST_OPTIONS,
          })

          if (props.popover) {
            messageService.sendMessage('cashVoucher', data.cashVoucher)
            props.onModalClose?.()
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'ajouter le bon de caisse: ${formatError(error)}`,
          )
        })
    })(event)
  }

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'expenseCategory') {
          setValue('categoryId', message.value)
        }

        if (message.name === 'department') {
          setValue('departmentId', message.value)
        }
      }
    })
  }, [messageService])

  return (
    <Form onSubmit={onSubmit} className="space-y-1">
      {/* Basic Information Section */}
      <FormSection
        icon={<FileText size={20} />}
        title={t('label-basicInformation') || 'Informations de base'}
        description={t('label-basicInformationDesc') || 'Détails du document'}
        color="#7367f0"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1">
          <DatePicker
            name="date"
            label={t('label-date')}
            control={control}
            required
          />

          <Input
            name="number"
            control={control}
            label={t('label-number')}
            required={!!voucher}
            prepend={<Hash size={16} />}
            placeholder={t('placeholder-number')}
          />
        </div>
      </FormSection>

      {/* Category & Destination Section */}
      <FormSection
        icon={<Tag size={20} />}
        title={t('label-categoryAndDestination') || 'Catégorie et destination'}
        description={t('label-categoryAndDestinationDesc') || "Où va l'argent"}
        color="#28c76f"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <LiveView
            document={ExpenseCategoryCreatedDocument}
            subscribeToMore={subscribeToMoreCategory}
            data={dataCategory}
            listVar="expenseCategories"
            singleVar="expenseCategory"
            loading={loadingCategory}
            enterpriseId={enterpriseId}
          >
            {({ expenseCategories }) => (
              <ControlledSelect
                control={control}
                name="categoryId"
                label={t('label-category')}
                required
                prepend={<Tag size={16} />}
                options={
                  expenseCategories
                    ? expenseCategories.filter((u: any) => u.active)
                    : []
                }
                onChange={(val) =>
                  setValue('categoryId', val, { shouldDirty: true })
                }
                getOptionLabel={(o) => o.name}
                getOptionValue={(o) => o.id}
                formId="expenseCategory"
                form={<ExpenseCategoryAdd />}
                optionLabel="name"
                formTitle={t('action.add_expenseCategory')}
                modalClassName="modal-md"
              />
            )}
          </LiveView>

          <ControlledSelect
            name="personId"
            label={t('label-destination')}
            control={control}
            loading={loading}
            prepend={<User size={16} />}
            onChange={(val: any) =>
              setValue('personId', val, { shouldDirty: true })
            }
            options={
              data && data.people
                ? data.people.filter(
                    ({ __typename }: any) =>
                      __typename === 'Teacher' || __typename === 'Supplier',
                  )
                : undefined
            }
            getOptionLabel={(option: any) => option.displayName}
            getOptionValue={(option: any) => option.id}
            components={{
              Option: personOptions,
              SingleValue: personSingleValue,
            }}
            required
          />
        </div>
      </FormSection>

      {/* Department Section */}
      <FormSection
        icon={<Building2 size={20} />}
        title={t('label-department') || 'Département'}
        description={t('label-departmentDesc') || 'Service concerné'}
        color="#00cfe8"
      >
        <div className="grid grid-cols-1 gap-1">
          <LiveView
            document={DepartmentCreatedDocument}
            subscribeToMore={subscribeToMoreDepartment}
            data={dataDepartment}
            listVar="departments"
            singleVar="department"
            loading={loadingDepartment}
            enterpriseId={enterpriseId}
          >
            {({ departments }) => (
              <ControlledSelect
                control={control}
                name="departmentId"
                label={t('label-department')}
                prepend={<Building2 size={16} />}
                options={
                  departments ? departments.filter((u: any) => u.active) : []
                }
                onChange={(val) =>
                  setValue('departmentId', val, { shouldDirty: true })
                }
                getOptionLabel={(o) => o.name}
                getOptionValue={(o) => o.id}
                formId="department"
                form={<DepartmentAdd />}
                optionLabel="name"
                formTitle={t('action.add_department')}
                modalClassName="modal-md"
              />
            )}
          </LiveView>
        </div>
      </FormSection>

      {/* Amount & Reason Section */}
      <FormSection
        icon={<DollarSign size={20} />}
        title={t('label-amountAndReason') || 'Montant et motif'}
        description={
          t('label-amountAndReasonDesc') || 'Justification de la dépense'
        }
        color="#ff9f43"
      >
        <div className="grid grid-cols-1 gap-1">
          <NumericInput
            name="amount"
            nameF="amountF"
            control={control}
            label={t('label-amount')}
            required
            setValue={setValue}
            prepend={<DollarSign size={16} />}
            placeholder="0.00"
          />

          <Input
            name="reason"
            control={control}
            label={t('label-reason')}
            required
            type="textarea"
            rows={3}
            prepend={<AlignLeft size={16} />}
            placeholder={t('placeholder-reason')}
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

export default CashVoucherForm
